#!/usr/bin/env python3
"""
build.py - compile DTCG tokens into consumable frontend artifacts.

单语言管线（一套项目一套设计语言，见 design/README.md）：

    design/lang/tokens.json -> design/lang/build/{theme.css, tailwind.v4.css, tokens.js, tokens.flat.json}

theme.css 的语义变量被两处消费：
    - design/demo/theme.css（/design 阶段复制过去，供纯 css/html 审查页）
    - src/design/theme.css（/design-implement 阶段落地为 app 皮肤变量层）

Run: python design/tools/build.py
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANG = ROOT / "lang"


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


def build_lang() -> None:
    """design/lang/tokens.json -> lang/build/。语言素材由 /design 指令生成。"""
    tokens_path = LANG / "tokens.json"
    if not tokens_path.exists():
        raise SystemExit(
            "design/lang/tokens.json 不存在：先由 /design 指令从 design/assets 素材生成语言（见 design/README.md）。")
    tokens = json.loads(tokens_path.read_text(encoding="utf-8"))
    flat = collect(tokens)
    by_var = {var: (t, v) for p, t, v, var in flat}
    scheme = tokens.get("$scheme", "light")
    out = LANG / "build"
    out.mkdir(parents=True, exist_ok=True)
    header = "/* generated by tools/build.py from design/lang/tokens.json - do not edit */"

    emit_theme_css(flat, out / "theme.css", ":root", header, scheme=scheme)
    emit_tailwind_v4(by_var, out / "tailwind.v4.css", header)
    emit_tokens_js(by_var, out / "tokens.js", header)
    emit_flat(flat, out / "tokens.flat.json")
    print(f"lang     {len(flat)} leaves ({scheme}) -> design/lang/build/")


def main() -> None:
    build_lang()


if __name__ == "__main__":
    main()
