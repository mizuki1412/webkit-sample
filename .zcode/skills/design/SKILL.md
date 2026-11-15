---
name: design
description: 从 design/assets 参考素材反演并融合出一套设计语言：分析原图 → 融合为一套语言 → 生成 design/lang 语言素材 + design/demo 纯 CSS/HTML 审查 demo。当用户说 "design"、"做设计"、"出/重新推设计语言"，或 design/assets 有新素材要产出设计语言时使用。只产出 lang+demo，不改 src/（落地用 /design-implement）。
---

# design —— 从参考素材到设计语言（阶段 1/2）

把 `design/assets/` 里的参考素材反演、融合成**一套**设计语言，产出两样东西：

- `design/lang/` —— 语言素材（唯一事实源 `tokens.json` + 可执行规范 `DESIGN.md` + 证据）
- `design/demo/` —— 纯 CSS/HTML 审查 demo（浏览器直接打开，无构建、无 JS）

**边界**：不碰 `src/`（落地是阶段 2 `/design-implement`）；一套项目一套语言，重跑本指令会整体重写 `lang/` 与 `demo/`（`assets/` 与 `tools/` 不动）。目录契约见 `design/README.md`。

## 0. 前置检查

1. `design/assets/` 必须有参考素材（截图/元素图）；为空则停止，请用户投放素材。
2. 读 `design/assets/NOTES.md`（若用户写了）：素材主导关系、深浅偏好、想强调什么——它是融合裁决的第一优先级。
3. 若 `design/lang/tokens.json` 已存在（已有语言）：除非用户明说重做，先确认是否覆盖重推。

## 1. 测量层（客观事实）

对每张参考图（按 NOTES.md 的主导顺序）：

```bash
python design/tools/analyze.py design/assets/<图> design/lang/evidence/<素材名>/
```

产出 `measurements.json` + `measured-overlay.png`（像素事实：色板占比、表面块、圆角、间隙、字包围盒）。依赖 cv2/numpy/Pillow（已装）。

- 高分辨率、扁平纯色块多的图最准；照片、玻璃拟态、复杂渐变会降级——降级时如实标注置信度，不要编造精度。

## 2. 语义层（角色判定）

逐图看图 + 对照 measurements，写 `design/lang/evidence/<素材名>/semantic-map.json`：

- 颜色角色：画布 / 卡片 / 控件 / 描边 / 文本三级 / 强调 / 正负 / 警示 / 数据系列 / 侧栏…
- 组件清单：按钮、输入、表格、卡片、导航、标签…的形态与尺寸
- 布局语法：侧栏宽、顶栏、留白节奏、卡片网格
- 状态规范：hover / 选中 / 禁用——图上出现的才叫「测得」

关键教训：**强调色可能只占 <1% 像素但语义权重最高**（纯按面积排序会漏掉它）——语义判定必须叠加在测量之上。

## 3. 融合为一套语言（本指令的核心）

多素材不是多主题——全部融合成**一套**语言，规则：

1. **统一语义契约**：所有 token 走同名语义变量（`color.bg / surface / surface-raised / border / border-strong / text / text-muted / text-faint / accent / accent-ink / accent-weak / positive(-weak) / negative(-weak) / warning(-weak) / data-* / chart-* / sidebar-* / header`、`space.1…`、`radius.*`、`font.*`、`layout.*`），DTCG 格式，必须与 `design/tools/build.py` 的 `var_name()` 映射兼容（可参考 git 历史中 design/themes/noir/tokens.json 的写法）。
2. **裁决顺序**（同角色多候选冲突时）：① `assets/NOTES.md` 用户偏好 → ② 与整体氛围一致的主导素材（多数派/语义权重）→ ③ 其余候选连同舍弃理由记入 DESIGN.md「决策记录」，供用户审查时推翻。
3. **缺失角色推导**：素材给不出的（hover/focus/disabled、`*-weak` 弱色变体、动效曲线、字体家族）按既有体系推导（alpha 变体、4px 网格相邻档、系统栈近似），在 DESIGN.md 标「推断」，不冒充测得。
4. **schema 元数据**：`$scheme`（dark|light，按融合后整体氛围）、`$source`（assets 清单）、`$description`（一句话设计主张）。
5. 每个叶子 token 带 `$description` 写明证据来源（哪张图、哪个部件、实测值）。

## 4. 写语言素材 design/lang/

```
design/lang/
  tokens.json        # DTCG，唯一事实源
  DESIGN.md          # 人/Agent 可读可执行规范
  evidence/<素材>/   # measurements.json + measured-overlay.png + semantic-map.json
  build/             # build.py 产物（勿手改）
```

`DESIGN.md` 必含：设计主张、使用规则（给 Agent）、组件形态（含尺寸）、**antd 映射表**（`colorPrimary=accent` 等，每行给最终值——/design-implement 直接消费）、布局语法、测得 vs 推断清单、决策记录。

然后编译：

```bash
python design/tools/build.py   # → lang/build/{theme.css, tailwind.v4.css, tokens.js, tokens.flat.json}
```

## 5. 写审查 demo design/demo/（纯 CSS/HTML）

```
design/demo/
  theme.css     # 复制 lang/build/theme.css（:root 语义变量）
  demo.css      # 语言词汇纯 CSS 形态：.d-card/.d-card-raised/.d-label + 按钮/输入/表格/表单/标签/导航/弹窗形态
  index.html    # 总览陈列板：色板/字阶/间距/圆角/动效 + 全组件 kitchen-sink
  page-*.html   # 1–2 张代表性整页，复刻素材的页面意象（列表/表单/仪表盘等）
```

硬规则：

- 禁 JS、禁外链（字体用 tokens 字体栈回退系统栈）、禁构建与框架；每页 `<link rel="stylesheet" href="theme.css">` + `demo.css`。
- 复刻的是**语言**（变量、形态、密度、节奏），不像素级仿制原素材——抽取规则而非复制他人受版权保护的界面。
- 保留 `demo/README.md` 不覆盖。
- 可参考用户技能 impeccable / design-taste-frontend 的口径提升质感，但 demo 仍须纯 css/html。

## 6. 门禁与交付

```bash
python design/tools/design_lint.py    # demo 全部页面，0 error 才算完成
```

交付时向用户报告：

- 审查入口：浏览器直接打开 `design/demo/index.html`（逐页看 page-\*.html）
- 关键裁决清单（融合取舍 + 被舍弃候选与理由）
- 测得 vs 推断项、置信度存疑处
- 明确说明：`src/` 未动；审查通过后下指令 **实现ui**（/design-implement）落地进 `src/design/`。
