#!/usr/bin/env python3
"""
build.py - compile DTCG tokens into consumable frontend artifacts.

两种编译目标：

1. 单主题（volt，历史管线，保持不动）:
       out/tokens.json -> out/theme.css / tailwind.v4.css / tokens.js / tokens.flat.json

2. 多主题（design/themes/<id>/tokens.json，三套语言共用一份语义契约）:
       themes/<id>/tokens.json -> themes/<id>/build/{theme.css,tailwind.v4.css,tokens.js,tokens.flat.json}
       全部主题合并             -> themes/build/all-themes.css   （html[data-design="<id>"] 切换）
       注册表                   -> themes/build/designs.json     （切换器/文档消费）

Run: python tools/build.py
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out"
THEMES = ROOT / "themes"


def walk(node: dict, path: list[str]):
    """Yield (path, type, value) for every DTCG leaf."""
    group_type = node.get("$type")
    for key, child in node.items():
        if key.startswith("$"):
            continue
        if isinstance(child, dict) and "$value" in child:
            yield path + [key], child.get("$type", group_type), child["$value"]
        elif isinstance(child, dict):
            yield from walk(child, path + [key])


def var_name(path: list[str]) -> str:
    head = path[0]
    rest = path[1:]
    if head == "color":
        return "--color-" + "-".join(rest)
    if head == "space":
        return "--space-" + "-".join(rest)
    if head == "radius":
        return "--radius-" + "-".join(rest)
    if head == "font":
        if rest[0] == "family":
            return "--font-family"
        prefixes = {"size": "--font-size-", "weight": "--font-weight-",
                    "leading": "--leading-", "tracking": "--tracking-"}
        return prefixes[rest[0]] + "-".join(rest[1:])
    if head == "motion":
        return ("--duration-" if rest[0] == "duration" else "--ease-") + "-".join(rest[1:])
    if head == "chart":
        return "--chart-" + "-".join(rest)
    return "--" + "-".join(path)


def css_value(value, type_: str) -> str:
    if type_ == "fontFamily":
        return ", ".join(f'"{v}"' if " " in v else v for v in value)
    if type_ == "cubicBezier":
        return "cubic-bezier(" + ", ".join(str(v) for v in value) + ")"
    if type_ == "shadow":
        if isinstance(value, str):  # e.g. "none"
            return value
        return ("{offsetX}px {offsetY}px {blur}px {spread}px {color}".format(**value))
    return str(value)


def tw_value(value, type_: str) -> str:
    """Tailwind v4 kebab namespaces, e.g. --color-accent, --spacing-4."""
    if type_ == "fontFamily":
        return ", ".join(f'"{v}"' if " " in v else v for v in value)
    if type_ == "cubicBezier":
        return "cubic-bezier(" + ", ".join(str(v) for v in value) + ")"
    return str(value)


def collect(tokens: dict) -> list[tuple[str, str, str, str]]:
    """-> (dot path, type, value, css var name)"""
    return [(".".join(p), t, v, var_name(p)) for p, t, v in walk(tokens, [])]


def emit_theme_css(flat, path: Path, selector: str, header: str, scheme: str | None = None):
    lines = [header, f"{selector} {{"]
    if scheme:
        lines.append(f"  color-scheme: {scheme};")
    for _, type_, value, var in flat:
        lines.append(f"  {var}: {css_value(value, type_)};")
    lines.append("}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def emit_tailwind_v4(by_var: dict, path: Path, header: str):
    v4 = [header,
          "/* import this from your tailwind entry, AFTER @import \"tailwindcss/theme.css\" */",
          "@theme {", "  /* color */"]
    for var, (type_, value) in sorted(by_var.items()):
        if type_ == "color":
            v4.append(f"  {var}: {tw_value(value, type_)};")
    v4.append("")
    v4.append("  /* spacing (named scale on top of Tailwind default) */")
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith("--space-"):
            v4.append(f"  --spacing-{var[len('--space-'):]}: {value};")
    v4.append("")
    v4.append("  /* radius */")
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith("--radius-"):
            v4.append(f"  {var}: {value};")
    v4.append("")
    v4.append("  /* font */")
    fam = next(v for v, (t, vv) in by_var.items() if t == "fontFamily")
    v4.append(f"  {fam}: {by_var[fam][1]};")
    for var, (type_, value) in sorted(by_var.items()):
        if type_ in ("dimension",) and var.startswith(
                ("--font-size-", "--font-weight-", "--leading-", "--tracking-")):
            v4.append(f"  {var}: {value};")
    v4.append("")
    v4.append("  /* motion */")
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith(("--duration-", "--ease-")):
            v4.append(f"  {var}: {value};")
    v4.append("")
    v4.append("  /* chart */")
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith("--chart-"):
            v4.append(f"  {var}: {value};")
    v4.append("}")
    path.write_text("\n".join(v4) + "\n", encoding="utf-8")


def emit_tokens_js(by_var: dict, path: Path, header: str):
    esm = [header,
           "// import { tokens, cssVar } from '<this-file-relative-path>'",
           "export const tokens = {", "  color: {"]
    for var, (type_, value) in sorted(by_var.items()):
        if type_ == "color":
            esm.append(f"    '{var[len('--color-'):]}': '{value}',")
    esm += ["  },", "  space: {"]
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith("--space-"):
            esm.append(f"    '{var[len('--space-'):]}': '{value}',")
    esm += ["  },", "  radius: {"]
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith("--radius-"):
            esm.append(f"    '{var[len('--radius-'):]}': '{value}',")
    esm += ["  },", "  font: {"]
    for var, (type_, value) in sorted(by_var.items()):
        if type_ in ("dimension", "fontFamily", "fontWeight", "number") and var.startswith(
                ("--font-",)):
            esm.append(f"    '{var[2:]}': '{value}',")
    esm += ["  },", "  layout: {"]
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith("--layout-"):
            esm.append(f"    '{var[len('--layout-'):]}': '{value}',")
    esm += ["  },", "  chart: {"]
    for var, (type_, value) in sorted(by_var.items()):
        if var.startswith("--chart-"):
            esm.append(f"    '{var[len('--chart-'):]}': '{value}',")
    esm += ["  },", "}", ""]
    esm.append("export const cssVar = (name) => `var(--${name})`;")
    esm.append("")
    path.write_text("\n".join(esm), encoding="utf-8")


def emit_flat(flat, path: Path):
    flat_map = {var: {"path": p, "type": t, "value": v} for p, t, v, var in flat}
    path.write_text(json.dumps(flat_map, indent=2, ensure_ascii=False), encoding="utf-8")


def build_single(tokens_path: Path, out_dir: Path) -> None:
    """volt 的单主题管线（out/），保持历史行为不变。"""
    tokens = json.loads(tokens_path.read_text(encoding="utf-8"))
    flat = collect(tokens)
    by_var = {var: (t, v) for p, t, v, var in flat}
    header = f"/* generated by tools/build.py from {tokens_path.relative_to(ROOT).as_posix()} - do not edit */"

    emit_theme_css(flat, out_dir / "theme.css", ":root", header)
    emit_tailwind_v4(by_var, out_dir / "tailwind.v4.css", header)
    emit_tokens_js(by_var, out_dir / "tokens.js", header)
    emit_flat(flat, out_dir / "tokens.flat.json")

    # legacy tailwind v3 preset (kept for non-v4 projects)
    def group(prefix: str) -> dict:
        return {var[len(prefix):]: f"var({var})" for _, _, _, var in flat
                if var.startswith(prefix) and var != prefix}

    preset = f"""{header}
/** @type {{import('tailwindcss').Config}} */
module.exports = {{
  theme: {{
    extend: {{
      colors: {json.dumps(group("--color-"), indent=8)},
      spacing: {json.dumps(group("--space-"), indent=8)},
      borderRadius: {json.dumps(group("--radius-"), indent=8)},
      fontFamily: {{ sans: "var(--font-family)" }},
      fontSize: {json.dumps(group("--font-size-"), indent=8)},
      fontWeight: {json.dumps(group("--font-weight-"), indent=8)},
      lineHeight: {json.dumps(group("--leading-"), indent=8)},
      letterSpacing: {json.dumps(group("--tracking-"), indent=8)}
    }}
  }}
}};
"""
    (out_dir / "tailwind.preset.js").write_text(preset, encoding="utf-8")
    print(f"volt     {len(flat)} leaves -> {out_dir.relative_to(ROOT).as_posix()}/")


def build_multi(themes_root: Path, build_dir: Path) -> None:
    """多主题：每主题独立产物 + 合并 all-themes.css + designs.json 注册表。"""
    build_dir.mkdir(parents=True, exist_ok=True)
    registry: list[dict] = []
    css_blocks: list[str] = []

    for theme_dir in sorted(p for p in themes_root.iterdir() if p.is_dir()):
        tokens_file = theme_dir / "tokens.json"
        if not tokens_file.exists():
            continue
        tokens = json.loads(tokens_file.read_text(encoding="utf-8"))
        theme_id = theme_dir.name
        scheme = tokens.get("$scheme", "light")
        flat = collect(tokens)
        by_var = {var: (t, v) for p, t, v, var in flat}

        out = theme_dir / "build"
        out.mkdir(exist_ok=True)
        header = (f"/* generated by tools/build.py from design/{tokens_file.relative_to(ROOT).as_posix()} "
                  f"- do not edit */")
        emit_theme_css(flat, out / "theme.css", ":root", header)
        emit_tailwind_v4(by_var, out / "tailwind.v4.css", header)
        emit_tokens_js(by_var, out / "tokens.js", header)
        emit_flat(flat, out / "tokens.flat.json")

        # 合并产物：data-design 属性选择器（:root 兜底 = 第一个主题）
        selector = f':root, [data-design="{theme_id}"]' if not registry else f'[data-design="{theme_id}"]'
        emit_theme_css(flat, out / "theme.scoped.css", selector, header, scheme=scheme)
        css_blocks.append((out / "theme.scoped.css").read_text(encoding="utf-8"))

        accent = by_var.get("--color-accent", ("color", "#000"))[1]
        registry.append({
            "id": theme_id,
            "scheme": scheme,
            "source": tokens.get("$source", ""),
            "description": tokens.get("$description", ""),
            "swatch": [accent, by_var["--color-bg"][1], by_var["--color-surface"][1],
                       by_var["--color-text-muted"][1]],
            "tokens": len(flat),
        })
        print(f"theme    {theme_id:<10} {len(flat)} leaves ({scheme}) -> themes/{theme_id}/build/")

    all_css = [
        "/* generated by tools/build.py - do not edit",
        " * 多主题合并样式：所有语言共用一份语义契约（--color- 与 --space- 等同名变量）。",
        " * 页面挂 <html data-design=\"<id>\"> 即完成整站切换；未挂属性时默认第一套。",
        " */",
        "",
        *css_blocks,
    ]
    (build_dir / "all-themes.css").write_text("\n".join(all_css), encoding="utf-8")
    (build_dir / "designs.json").write_text(
        json.dumps(registry, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"merged   {len(registry)} themes -> themes/build/all-themes.css + designs.json")


def main() -> None:
    build_single(OUT / "tokens.json", OUT)
    build_multi(THEMES, THEMES / "build")


if __name__ == "__main__":
    main()
