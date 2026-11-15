# design/lang/ —— 设计语言素材（/design 指令生成）

本目录由 `/design` 指令**整体生成/重写**（重推语言会覆盖本目录，README 保留）。
当前为空：待首次 `/design` 从 `design/assets/` 素材生成。

| 文件               | 说明                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `tokens.json`      | DTCG 语义 token，**唯一事实源**；`$scheme` / `$source` / `$description` + 每叶子带证据 `$description`    |
| `DESIGN.md`        | 人/Agent 可读可执行规范：设计主张、使用规则、组件形态、**antd 映射表**、布局语法、测得 vs 推断、决策记录 |
| `evidence/<素材>/` | `measurements.json`（analyze.py 像素实测）+ `measured-overlay.png` + `semantic-map.json`（角色判定）     |
| `build/`           | `build.py` 产物（theme.css / tailwind.v4.css / tokens.js / tokens.flat.json），勿手改                    |
