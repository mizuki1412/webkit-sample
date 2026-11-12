#!/usr/bin/env python3
"""
design_lint.py - keep UI code inside the design language.

Checks HTML / CSS / JSX-ish files for values that are not in out/tokens.json:
  color/hex        hex not present in the token set
  color/function   rgb()/rgba()/hsl()/hsla() not driven by a var
  type/scale       font-size not a token or var
  radius/scale     border-radius not a token or var
  space/grid       padding/margin/gap not a token or var
  shadow/token     box-shadow without a var (the language has no card shadows)

Usage:
  python tools/design_lint.py                     # lint the demo pages
  python tools/design_lint.py path1 path2 ...     # lint specific files
Exit code 1 when any error is found.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FLAT = json.loads((ROOT / "out" / "tokens.flat.json").read_text(encoding="utf-8"))

HEX_ALLOWED: set[str] = set()
FONT_SIZES: set[float] = set()
RADII: set[float] = set()
SPACING: set[float] = set()

for var, meta in FLAT.items():
    kind, value = meta["type"], meta["value"]
    if kind == "color" and isinstance(value, str) and value.startswith("#"):
        HEX_ALLOWED.add(value.lower())
    if var.startswith("--font-size-"):
        FONT_SIZES.add(round(float(str(value).replace("px", "")), 2))
    if var.startswith("--radius-"):
        RADII.add(round(float(str(value).replace("px", "")), 2))
    if var.startswith("--space-"):
        SPACING.add(round(float(str(value).replace("px", "")), 2))

DECL = re.compile(r"([a-zA-Z][a-zA-Z-]*)\s*:\s*([^;{}]+)")
HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")
COLOR_FN = re.compile(r"\b(rgba?|hsla?)\([^)]*\)")
PX = re.compile(r"(-?\d+(?:\.\d+)?)px\b")

SPACING_PROPS = {
    "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "gap", "row-gap", "column-gap",
}


def px_values(value: str) -> list[float]:
    return [float(n) for n in PX.findall(value)]


def lint_file(path: Path) -> list[tuple[int, str, str]]:
    problems: list[tuple[int, str, str]] = []
    lines = path.read_text(encoding="utf-8").splitlines()

    for lineno, line in enumerate(lines, 1):
        for m in HEX.finditer(line):
            if m.group(0).lower() not in HEX_ALLOWED:
                problems.append((lineno, "color/hex",
                                 f"{m.group(0)} is not a token"))
        for m in COLOR_FN.finditer(line):
            if "var(" not in m.group(0):
                problems.append((lineno, "color/function",
                                 f"{m.group(0)} - use a token or *-weak token"))

        for m in DECL.finditer(line):
            prop, value = m.group(1).lower(), m.group(2).strip()
            if not value:
                continue
            if prop == "font-size" and "var(" not in value:
                nums = px_values(value)
                if nums and any(round(n, 2) not in FONT_SIZES for n in nums):
                    problems.append((lineno, "type/scale",
                                     f"font-size: {value} is not in the type scale"))
            elif prop == "border-radius" and "var(" not in value:
                for token in re.split(r"[\s/]+", value):
                    if not token or token in {"0"} or "%" in token:
                        continue
                    nums = px_values(token)
                    if nums and any(round(n, 2) not in RADII for n in nums):
                        problems.append((lineno, "radius/scale",
                                         f"border-radius: {value} is not a radius token"))
                        break
            elif prop in SPACING_PROPS and "var(" not in value:
                if value in {"auto", "0", "inherit"} or "%" in value or "calc(" in value:
                    continue
                nums = px_values(value)
                if nums and any(round(n, 2) not in SPACING and n != 0 for n in nums):
                    problems.append((lineno, "space/grid",
                                     f"{prop}: {value} is not on the 4px token scale"))
            elif prop == "box-shadow" and "var(" not in value and value != "none":
                problems.append((lineno, "shadow/token",
                                 "card shadows are not part of this language"))
    return problems


def main() -> None:
    args = sys.argv[1:]
    if args:
        paths = [Path(a).resolve() for a in args]
    else:
        paths = [ROOT / "out" / "kitchen-sink.html", ROOT / "demo" / "settings.html"]

    total = 0
    for path in paths:
        if not path.exists():
            print(f"{path}: not found")
            total += 1
            continue
        problems = lint_file(path)
        for lineno, rule, message in problems:
            print(f"{path.name}:{lineno}: [{rule}] {message}")
        total += len(problems)

    print(f"\n{total} error(s) in {len(paths)} file(s)")
    if total:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
