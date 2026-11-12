#!/usr/bin/env python3
"""
analyze.py - measure a UI screenshot into design-token evidence.

This is the "objective half" of the image -> design-language pipeline.
It does not try to understand the UI; it only measures what is physically
on the pixels: palette, solid-surface blocks, corner radii, spacing gaps,
and a relative type scale. A vision pass (human or multimodal model) then
assigns semantic roles on top of these numbers.

Usage:
    python analyze.py <image.png> [out_dir]
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


# ---------------------------------------------------------------- helpers
def hexc(rgb) -> str:
    return "#%02X%02X%02X" % tuple(int(round(v)) for v in rgb)


def load_rgb(path: Path) -> np.ndarray:
    return np.array(Image.open(path).convert("RGB"))


def cluster_palette(rgb: np.ndarray, max_colors: int = 16) -> list[dict]:
    """Greedy clustering of the most frequent exact colors.

    UI screenshots are dominated by flat fills, so exact-color peaks are a
    better signal than k-means (which smears a 1px accent line into nothing).
    Merge threshold is 8: near-adjacent surface elevations stay distinct.
    """
    flat = rgb.reshape(-1, 3)
    colors, counts = np.unique(flat, axis=0, return_counts=True)
    order = np.argsort(-counts)
    colors = colors[order][:800].astype(np.float64)
    counts = counts[order][:800].astype(np.float64)

    clusters: list[dict] = []
    for c, n in zip(colors, counts):
        best, best_d = -1, 1e9
        for i, cl in enumerate(clusters):
            d = float(np.linalg.norm(c - cl["mean"]))
            if d < best_d:
                best_d, best = d, i
        if best >= 0 and best_d <= 8:
            cl = clusters[best]
            cl["sum"] += c * n
            cl["weight"] += n
            cl["pixels"] += int(n)
            cl["mean"] = cl["sum"] / cl["weight"]
            if n > cl["peak_count"]:
                cl["peak"], cl["peak_count"] = c, int(n)
        else:
            clusters.append({
                "sum": c * n, "weight": n, "pixels": int(n),
                "mean": c.copy(), "peak": c.copy(), "peak_count": int(n),
            })

    total = flat.shape[0]
    out = []
    for cl in clusters:
        out.append({
            "hex": hexc(cl["mean"]),
            "peak_hex": hexc(cl["peak"]),
            "share": round(cl["pixels"] / total, 5),
            "pixels": cl["pixels"],
        })
    out.sort(key=lambda x: -x["pixels"])
    return out[:max_colors]


def find_accents(rgb: np.ndarray) -> list[dict]:
    """Saturated colors, independent of how few pixels they occupy.

    Accents are often <1% of a screen, so a share-ranked palette would hide
    them. Group by hue and report the modal exact color inside each group.
    """
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)  # H:0-179 S,V:0-255
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    mask = (s > 90) & (v > 80)
    total = rgb.shape[0] * rgb.shape[1]
    if not mask.any():
        return []

    hues = h[mask]
    hist = np.bincount(hues, minlength=180).astype(np.float64)
    # smooth over +-5 degrees so one hue group is not split
    smooth = np.convolve(np.concatenate([hist[-6:], hist, hist[:6]]),
                         np.ones(13) / 13, mode="same")[6:-6]
    order = np.argsort(-smooth)
    picked: list[int] = []
    for cand in order:
        if smooth[cand] <= 0:
            break
        if all(min(abs(int(cand) - p), 180 - abs(int(cand) - p)) > 14 for p in picked):
            picked.append(int(cand))
        if len(picked) >= 6:
            break

    flat = rgb.reshape(-1, 3)[mask.reshape(-1)]
    out = []
    for hue in picked:
        d = np.minimum((hues.astype(int) - hue) % 180, (hue - hues.astype(int)) % 180)
        sel = flat[d <= 7]
        if len(sel) < 0.0002 * total:
            continue
        cols, cnts = np.unique(sel, axis=0, return_counts=True)
        mx = cols.max(axis=1).astype(int)
        mn = cols.min(axis=1).astype(int)
        vivid = (mx - mn >= 70) & (mx >= 180)  # drop dark antialias blends
        if vivid.any():
            cols, cnts = cols[vivid], cnts[vivid]
        peak = cols[np.argmax(cnts)]
        out.append({
            "hex": hexc(peak),
            "share": round(len(sel) / total, 5),
            "hue": int(hue),
            "pixels": int(len(sel)),
        })
    out.sort(key=lambda x: -x["pixels"])
    return out


def fill_holes(mask: np.ndarray) -> np.ndarray:
    """External-contour fill: card interiors contain text/other colors."""
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled = np.zeros_like(mask)
    cv2.drawContours(filled, contours, -1, 255, -1)
    return filled


def corner_radius(comp: np.ndarray, bbox) -> float:
    """Estimate border-radius from how far the corner is cut away.

    Along the bbox diagonal, a rounded corner's first solid pixel sits at
    d = r * (1 - 1/sqrt(2)). Invert that. Median of the four corners.
    """
    x, y, w, h = bbox
    m = comp[y:y + h, x:x + w] > 0
    if w < 6 or h < 6:
        return 0.0
    diag = max(3, min(w, h) // 2)
    radii = []
    for ox, oy, sx, sy in ((0, 0, 1, 1), (w - 1, 0, -1, 1),
                           (0, h - 1, 1, -1), (w - 1, h - 1, -1, -1)):
        d = 0
        while d < diag:
            px, py = ox + sx * d, oy + sy * d
            if 0 <= px < w and 0 <= py < h and m[py, px]:
                break
            d += 1
        if d >= diag:
            continue
        radii.append(d / (1 - 1 / math.sqrt(2)))
    if not radii:
        return 0.0
    return round(float(np.median(radii)) * 2) / 2  # 0.5px precision


def find_blocks(rgb: np.ndarray, palette: list[dict], min_share: float = 0.0015):
    """Solid-color blocks: cards, inputs, pills, buttons."""
    total = rgb.shape[0] * rgb.shape[1]
    blocks = []
    for entry in palette:
        if entry["share"] < min_share:
            continue
        peak = np.array([int(entry["peak_hex"][i:i + 2], 16) for i in (1, 3, 5)],
                        dtype=np.int16)
        diff = np.abs(rgb.astype(np.int16) - peak).max(axis=2)
        mask = (diff <= 6).astype(np.uint8)
        n, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
        for i in range(1, n):
            x, y, w, h, area = stats[i]
            if area < 0.0015 * total or w < 24 or h < 16:
                continue
            if area / float(w * h) < 0.3:
                continue  # thin frame / border line, not a surface
            if w > 0.9 * rgb.shape[1] and h > 0.9 * rgb.shape[0]:
                continue  # page background
            comp = (labels == i).astype(np.uint8) * 255
            comp = fill_holes(comp)
            radius = corner_radius(comp, (x, y, w, h))
            blocks.append({
                "color": entry["peak_hex"],
                "bbox": [int(x), int(y), int(w), int(h)],
                "area_px": int(area),
                "radius_px": radius,
            })
    blocks.sort(key=lambda b: -b["area_px"])
    return blocks


def merge_fragments(rgb: np.ndarray, blocks: list[dict]) -> list[dict]:
    """Re-join solid blocks split by 1px border lines.

    A table card is one surface, but its row separators cut the color mask
    into horizontal strips. Merge strips of the same color that share an
    axis and are separated by <= 3px, then re-measure the radius on the
    union so the card's true corner radius is recovered.
    """
    def gap(a, b):
        ax, ay, aw, ah = a
        bx, by, bw, bh = b
        if ax + aw <= bx:
            return bx - (ax + aw)
        if bx + bw <= ax:
            return ax - (bx + bw)
        return 0

    def vgap(a, b):
        ax, ay, aw, ah = a
        bx, by, bw, bh = b
        if ay + ah <= by:
            return by - (ay + ah)
        if by + bh <= ay:
            return ay - (by + bh)
        return 0

    merged = True
    while merged:
        merged = False
        for i in range(len(blocks)):
            for j in range(i + 1, len(blocks)):
                a, b = blocks[i], blocks[j]
                if a["color"] != b["color"]:
                    continue
                ax, ay, aw, ah = a["bbox"]
                bx, by, bw, bh = b["bbox"]
                overlap_x = min(ax + aw, bx + bw) - max(ax, bx)
                overlap_y = min(ay + ah, by + bh) - max(ay, by)
                join = False
                if overlap_x > 0.8 * min(aw, bw) and vgap(a["bbox"], b["bbox"]) <= 3:
                    join = True
                if overlap_y > 0.8 * min(ah, bh) and gap(a["bbox"], b["bbox"]) <= 3:
                    join = True
                if not join:
                    continue
                x1, y1 = min(ax, bx), min(ay, by)
                x2, y2 = max(ax + aw, bx + bw), max(ay + ah, by + bh)
                blocks[i] = {
                    "color": a["color"], "bbox": [x1, y1, x2 - x1, y2 - y1],
                    "area_px": a["area_px"] + b["area_px"], "radius_px": a["radius_px"],
                }
                blocks.pop(j)
                merged = True
                break
            if merged:
                break

    for b in blocks:  # radius on the union
        x, y, w, h = b["bbox"]
        peak = np.array([int(b["color"][i:i + 2], 16) for i in (1, 3, 5)], dtype=np.int16)
        sub = rgb[y:y + h, x:x + w].astype(np.int16)
        diff = np.abs(sub - peak).max(axis=2)
        mask = (diff <= 6).astype(np.uint8) * 255
        mask = fill_holes(mask)
        b["radius_px"] = corner_radius(mask, (0, 0, w, h))
    blocks.sort(key=lambda b: -b["area_px"])
    return blocks


def measure_gutters(rgb: np.ndarray) -> dict:
    """Find empty bands that run across the layout: the real grid gutters.

    Edge projection over the content area. A card gutter has almost no
    edges over its full length; card interiors cannot be flat for the whole
    span because they contain text and a border. This is far more stable
    than measuring gaps between arbitrary color blocks.
    """
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 40, 120)
    h, w = gray.shape
    left, top = int(w * 0.16), int(h * 0.071)  # skip sidebar / topbar

    def runs(flat: np.ndarray) -> list[list[int]]:
        out, start = [], None
        for i, v in enumerate(flat):
            if v and start is None:
                start = i
            elif not v and start is not None:
                out.append([start, i - start])
                start = None
        if start is not None:
            out.append([start, len(flat) - start])
        return [r for r in out if r[1] >= 6]

    col_edges = (edges[top:, :] > 0).sum(axis=0)
    row_edges = (edges[:, left:] > 0).sum(axis=1)
    vg = runs(col_edges < max(3, int(0.008 * (h - top))))
    hg = runs(row_edges < max(3, int(0.008 * (w - left))))

    return {
        "vertical_gutters": [{"x": int(x), "width_px": int(n)} for x, n in vg],
        "horizontal_gutters": [{"y": int(y), "height_px": int(n)} for y, n in hg],
    }


def measure_spacing(blocks: list[dict]) -> dict:
    """Gaps between sibling blocks that share a row or column."""
    boxes = [b["bbox"] for b in blocks if b["area_px"] < 0.2 * 1440 * 900]
    h_gaps, v_gaps = [], []
    for i, a in enumerate(boxes):
        ax, ay, aw, ah = a
        for b in boxes[i + 1:]:
            bx, by, bw, bh = b
            # skip containment (parent card vs child content)
            if ax <= bx and ay <= by and ax + aw >= bx + bw and ay + ah >= by + bh:
                continue
            if bx <= ax and by <= ay and bx + bw >= ax + aw and by + bh >= ay + ah:
                continue
            overlap_y = min(ay + ah, by + bh) - max(ay, by)
            if overlap_y > 0.6 * min(ah, bh):
                if ax + aw <= bx:
                    h_gaps.append(bx - (ax + aw))
                elif bx + bw <= ax:
                    h_gaps.append(ax - (bx + bw))
            overlap_x = min(ax + aw, bx + bw) - max(ax, bx)
            if overlap_x > 0.6 * min(aw, bw):
                if ay + ah <= by:
                    v_gaps.append(by - (ay + ah))
                elif by + bh <= ay:
                    v_gaps.append(ay - (by + bh))

    gaps = [g for g in h_gaps + v_gaps if 2 <= g <= 64]
    if not gaps:
        return {"base_unit_px": None, "sample_gaps_px": [], "gap_counts": {}}

    def fit(unit: int) -> float:
        """Fraction of gaps that sit within 1px of a multiple of `unit`."""
        return float(np.mean([min(g % unit, unit - g % unit) <= 1 for g in gaps]))

    candidates = [4, 8, 12, 16]
    best = max(candidates, key=lambda u: (round(fit(u), 2), u))
    counts: dict[str, int] = {}
    for g in sorted(gaps):
        counts[str(g)] = counts.get(str(g), 0) + 1
    top = sorted(counts.items(), key=lambda kv: -kv[1])[:8]
    return {
        "base_unit_px": best,
        "base_unit_fit": round(fit(best), 2),
        "rhythm_8px_fit": round(fit(8), 2),
        "sample_gaps_px": sorted(set(gaps)),
        "gap_counts": {k: v for k, v in top},
    }


def measure_type(rgb: np.ndarray) -> dict:
    """Cluster text-line heights to recover a relative type scale.

    White top-hat (dark UI) / black-hat (light UI) suppresses large flat
    areas and keeps small bright elements such as glyphs. Lines are then
    joined horizontally so each contour is one text line, not one glyph.
    Solid bright blocks (buttons, logo marks) are rejected by ink density.
    """
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    dark_ui = float(gray.mean()) < 128
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 25))
    if dark_ui:
        resp = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, kernel)
    else:
        resp = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

    binimg = (resp > 20).astype(np.uint8) * 255
    joined = cv2.dilate(binimg, cv2.getStructuringElement(cv2.MORPH_RECT, (9, 1)))
    joined = cv2.morphologyEx(joined, cv2.MORPH_CLOSE,
                              cv2.getStructuringElement(cv2.MORPH_RECT, (3, 2)))
    contours, _ = cv2.findContours(joined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    heights = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if not (6 <= h <= 44 and w >= 14 and w / max(h, 1) >= 2.0):
            continue
        ink = float((binimg[y:y + h, x:x + w] > 0).mean())
        if ink > 0.62:  # solid block, not a text line
            continue
        heights.append(h)

    if not heights:
        return {"height_clusters_px": [], "text_lines": 0}

    clusters: list[list[int]] = []
    for h in sorted(heights):
        if clusters and abs(h - np.median(clusters[-1])) <= 1.5:
            clusters[-1].append(int(h))
        else:
            clusters.append([int(h)])

    out = []
    for cl in clusters:
        med = float(np.median(cl))
        if len(cl) < 2 and med < 18:  # keep rare display-size lines
            continue
        out.append({
            "height_px": med,
            "count": len(cl),
            "est_font_px_range": [int(round(med / 0.95)), int(round(med / 0.70))],
        })
    out.sort(key=lambda x: -x["height_px"])
    return {"height_clusters_px": out, "text_lines": len(heights)}


def draw_overlay(rgb: np.ndarray, blocks: list[dict], out_path: Path) -> None:
    vis = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR).copy()
    for b in blocks:
        x, y, w, h = b["bbox"]
        cv2.rectangle(vis, (x, y), (x + w, y + h), (0, 255, 0), 1)
        label = f'{b["color"]} r={b["radius_px"]:g}'
        cv2.putText(vis, label, (x + 4, y + 12), cv2.FONT_HERSHEY_SIMPLEX,
                    0.34, (0, 255, 0), 1, cv2.LINE_AA)
    cv2.imwrite(str(out_path), vis)


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("usage: python analyze.py <image.png> [out_dir]")
    img_path = Path(sys.argv[1]).resolve()
    out_dir = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else img_path.parent.parent / "out"
    out_dir.mkdir(parents=True, exist_ok=True)

    rgb = load_rgb(img_path)
    palette = cluster_palette(rgb)
    accents = find_accents(rgb)
    blocks = merge_fragments(rgb, find_blocks(rgb, palette))
    spacing = measure_spacing(blocks)
    layout = measure_gutters(rgb)
    typo = measure_type(rgb)

    result = {
        "image": {"file": img_path.name,
                  "width": int(rgb.shape[1]), "height": int(rgb.shape[0])},
        "palette": palette,
        "accents": accents,
        "blocks": blocks,
        "layout": layout,
        "spacing": spacing,
        "type": typo,
    }
    (out_dir / "measurements.json").write_text(
        json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    draw_overlay(rgb, blocks, out_dir / "measured-overlay.png")

    print(f"image      {result['image']['width']}x{result['image']['height']}")
    print("palette    " + ", ".join(f"{p['peak_hex']}({p['share']*100:.1f}%)"
                                    for p in palette[:8]))
    print("accents    " + ", ".join(f"{a['hex']}({a['share']*100:.2f}%)" for a in accents))
    print(f"blocks     {len(blocks)} solid regions")
    for b in blocks[:8]:
        print(f"           {b['color']} r={b['radius_px']:g} bbox={b['bbox']}")
    print(f"spacing    base={spacing['base_unit_px']}px gaps={spacing['sample_gaps_px'][:12]}")
    vg = [g["width_px"] for g in layout["vertical_gutters"]]
    hg = [g["height_px"] for g in layout["horizontal_gutters"]]
    print(f"gutters    vertical={vg} horizontal={hg}")
    print("type       " + ", ".join(f"h{c['height_px']:g}x{c['count']}"
                                    for c in typo["height_clusters_px"]))
    print(f"written    {out_dir / 'measurements.json'}")


if __name__ == "__main__":
    main()
