# Volt Design Language · v1.0

> 从一张 1440×900 的 UI 样图逆向得到的**可执行设计语言**，不是通用设计系统。
> 它描述的是「这类界面该怎么长」：深色、数据密集、单一高亮色的控制台/金融产品。
>
> - 机器可读：`tokens.json`（DTCG）→ `theme.css` / `tailwind.v4.css`（本仓库 Tailwind v4 首选）/ `tokens.js`（Vue/JS）
> - 人 / Agent 可读：本文档
> - 活样例：`kitchen-sink.html`；用同一语言写的新页面：`demo/settings.html`（原生）与 `demo/vue/SettingsView.vue`（Vue 3 + Tailwind v4）
> - 证据：`measurements.json`（像素测量）+ `semantic-map.json`（语义映射）

---

## 0. 怎么用

写任何 UI 之前，按顺序做四件事：

1. 读本文档的 §2–§7，确定颜色、字号、间距、组件形态。
2. 只使用 `theme.css` 里的 CSS 变量；不写裸 hex、不写魔法 px。
3. 新组件先在 `kitchen-sink.html` 里加一个样例，再进业务页面。
4. 提交前跑 `python tools/design_lint.py <files>`，0 error 才算完成。

需要新值时，先改 `tokens.json` → `python tools/build.py` → 再用变量。
**不允许**在业务代码里就地发明一个颜色或间距。

---

## 1. 设计主张

| # | 原则 | 落地方式 |
|---|------|----------|
| 1 | **夜间驾驶舱** | 近黑画布 + 三级表面亮度分层；不用投影表达层级 |
| 2 | **一个高音** | 酸橙只给主行动、主数据线、选中态；单屏面积 ≤ 5% |
| 3 | **数字优先** | 余额/涨跌是视觉主角；标签小、灰、退后 |
| 4 | **软形状，硬网格** | 卡片 16px 大圆角，但一切间距落在 4px 网格上 |
| 5 | **短促安静** | 动效 120–180ms，标准缓动，无回弹、无炫技 |

一句话：**深色底上，用一层层略微提亮的表面组织信息，只允许一个地方大声说话。**

---

## 2. 颜色

### 2.1 色板

| Token | 值 | 角色 | 使用规则 |
|-------|----|------|----------|
| `--color-bg` | `#0B0D12` | 页面画布 | 只铺在 body / app 背景；不要用纯黑 `#000` |
| `--color-surface` | `#12151C` | 一级承载面 | 卡片、表格、面板的默认底色 |
| `--color-surface-raised` | `#171B24` | 二级面 / 控件 | 输入框、分段控件、导航选中态、悬浮行 |
| `--color-border` | `#22252C` | 1px 分隔线 | 所有描边统一用它；不要再造第二种灰 |
| `--color-text` | `#F2F5F9` | 主文本 / 数字 | 近白，不用 `#FFF` |
| `--color-text-muted` | `#8A93A6` | 次级文本 | 导航未选中、图例、说明 |
| `--color-text-faint` | `#5B6478` | 三级文本 | 轴标签、表头、辅助信息；仅非关键内容 |
| `--color-accent` | `#C8F751` | 电光青柠 | 主按钮、主数据线、选中态、关键数字 |
| `--color-accent-ink` | `#0E1206` | 强调色上的前景 | 酸橙底上的文字/图标 |
| `--color-accent-weak` | `#C8F7511F` | 强调弱底 | 选中行、轻高亮背景 |
| `--color-positive` | `#4ED8A0` | 正向语义 | 上涨、在线、成功 |
| `--color-negative` | `#FF6B6B` | 负向语义 | 下跌、错误、危险 |
| `--color-data-1` | `#6E9BFF` | 数据序列 2 | 环形图、第二组折线 |
| `--color-data-2` | `#8A93A6` | 数据序列 3 | 分类图第三段 |
| `--color-data-3` | `#3A4152` | 数据序列 4 / 空轨道 | 环形图空轨道、最次要分类 |

### 2.2 硬规则

- **层级靠提亮，不靠阴影。** `bg → surface → surface-raised` 三级足够；全站 0 投影。
- **边框只有一种。** 1px `--color-border`；不要用更亮/更暗的描边，也不要双线。
- **强调色是配额制。** 单屏酸橙面积 ≤ 5%；禁止大面积铺底、禁止给正文上色。
- **语义色只表达语义。** 绿=涨/在线/成功，红=跌/错误/危险；不能拿来当装饰色。
- **弱底用 token。** 胶囊底色用 `--color-positive-weak` / `--color-negative-weak` / `--color-accent-weak`，不要手写 `rgba()`。
- **文本只用三级。** 不要新增第 4 种灰；需要更弱就降字号或字重，而不是继续降对比度。
- **数据系列顺序固定。** 主序列 `accent` → `data-1` → `data-2` → `data-3`。

### 2.3 对比度

| 组合 | 约对比度 | 用途 |
|------|----------|------|
| `text` on `surface` | ≈ 15:1 | 正文、数字，安全 |
| `text-muted` on `surface` | ≈ 5.5:1 | 次级文本，安全 |
| `text-faint` on `surface` | ≈ 2.9:1 | **仅**非关键标签；不可承载操作或数据 |
| `accent-ink` on `accent` | ≈ 14:1 | 主按钮，安全 |

---

## 3. 字体与数字

### 3.1 字族

```css
--font-family: "Segoe UI", Inter, system-ui, sans-serif;
```

不引入第二个字族。中英文混排沿用系统字体，字重承担层级。

### 3.2 字阶

| Token | px | 字重 | 字距 | 行高 | 用途 |
|-------|----|------|------|------|------|
| `micro` | 10.5 | 600 | `0.11em` | 1.25 | 大写微标签、表头（`TOTAL BALANCE`） |
| `xs` | 11.5 | 600 | 0 | 1.25 | 胶囊、图例、辅助信息 |
| `sm` | 12.5 | 400 / 600 | 0 | 1.45 | 表格正文、按钮、搜索框 |
| `base` | 14 | 500 / 600 | 0 | 1.45 | 导航、卡片标题、正文 |
| `md` | 16 | 600 | 0 | 1.25 | 强调数字、侧栏汇总 |
| `lg` | 18 | 600 | 0 | 1.25 | 大号统计值 |
| `xl` | 25 | 600 | `-0.01em` | 1.15 | 页面标题 |
| `display` | 34 | 600 | `-0.02em` | 1.05 | 主余额、英雄数字 |

规则：

- **只允许这 8 级。** 需要 13px / 15px / 22px 时，选最近的级，不要新建。
- **大写只给 micro。** 其他一律 sentence case。
- **大号数字收紧字距**（`-0.02em`），小号文本正常。
- **数字必须等宽**：`font-variant-numeric: tabular-nums;` 防止跳动。
- **长文本最大行宽 720px**（`--layout-text-max`）。

### 3.3 数字格式

| 场景 | 格式 | 示例 |
|------|------|------|
| 法币金额 | `$` + 千分位 + 2 位小数 | `$128,430.55` |
| 涨跌幅 | 符号 + 百分比 + 箭头 | `↑ 2.84%` / `−2.41%` |
| 币数量 | 最多 4 位有效小数 + 币种 | `0.846 BTC` |
| 时间 | 相对时间优先 | `Updated 2 min ago` |

涨跌**不能只靠颜色**：必须同时有符号/箭头，保证色觉障碍可读。

---

## 4. 空间与布局

### 4.1 间距标尺

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`

对应 `--space-1 … --space-16`。**禁止** 6、10、13、18、22、30 这类非标尺值。

### 4.2 应用骨架

```
┌────────── 232 ──────────┬────────────────────────────────────┐
│                         │  topbar 64                         │
│  logo                   ├────────────────────────────────────┤
│                         │  content padding: 32 / 24          │
│  nav item 40            │  page header                       │
│  (gap 4)                │  ┌──────────────────────┬────────┐ │
│                         │  │ 1fr                  │ 360    │ │
│                         │  │ card pad 24          │ card   │ │
│                         │  └──────────────────────┴────────┘ │
│                         │  gap 24                            │
│  plan card (bottom)     │  ┌────────────────────────────────┐ │
│                         │  │ table, row 52                  │ │
└─────────────────────────┴────────────────────────────────────┘
```

| 常量 | 值 | Token |
|------|----|-------|
| 侧栏宽 | 232 | `--layout-sidebar` |
| 顶栏高 | 64 | `--layout-topbar` |
| 内容左右留白 | 32 | `--layout-content-x` |
| 内容上下留白 | 24 | `--layout-content-y` |
| 区块间距 | 24 | `--layout-gap` |
| 卡片内边距 | 24 | `--layout-card-pad` |
| 控件高 | 36 | `--layout-control-h` |
| 表格行高 | 52 | `--layout-table-row` |
| 页面最大宽 | 1440 | `--layout-page-max` |

### 4.3 网格配方

```css
/* 仪表盘主区：主内容 + 360 侧栏 */
.dashboard { display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:var(--layout-gap); }

/* 资产表：6 列，右侧留一列给迷你图 */
.assets-row { display:grid; grid-template-columns:2.2fr 1fr 1fr 1fr 1.1fr .9fr; gap:var(--space-4); }

/* 表单：两列，标签在左，控件在右 */
.form-row { display:grid; grid-template-columns:200px minmax(0,1fr); gap:var(--space-6); }
```

- 页面头部：标题左、操作右，底部与内容间距 20。
- 卡片之间永远 24；卡片内部按 24 / 16 / 12 递减。
- 侧栏固定，不随内容滚动；只有 content 区域滚动。

### 4.4 响应式（**样图无证据，属扩展规则**）

| 断点 | 行为 |
|------|------|
| ≥ 1280 | 如上，232 侧栏 + 双列 |
| 1024–1279 | 侧栏收为 64px 图标栏；仪表盘保留双列 |
| < 1024 | 侧栏变抽屉；所有网格单列；内容留白 20 |

---

## 5. 形状与层级

| 元素 | 圆角 | Token |
|------|------|-------|
| 卡片、面板 | 16 | `--radius-lg` |
| 按钮、输入框、导航项 | 10 | `--radius-sm` |
| 小标记、菜单项、币种方块 | 8 | `--radius-xs` |
| 胶囊、开关、头像 | 999 | `--radius-full` |

- **不使用 4 / 6 / 12 / 20 圆角。** 需要介于两者之间时，选更接近的一级。
- **层级 = 表面亮度 + 1px 边框。** 禁止 `box-shadow` 做卡片浮起；只有浮层（菜单、弹层）在必要时使用阴影，且需新增 token。
- **不嵌套卡片。** 卡片内需要分组时，用 1px 分隔线 + 间距，不要再套一个带边框的卡片。
- 图标统一 16–17px，线性、1.6px 描边、圆头圆角。

---

## 6. 组件规范

> 尺寸单位 px；颜色/圆角/字号一律引用 token。状态未在样图中出现，按此表执行。

### 6.1 按钮

| 变体 | 尺寸 | 样式 | 状态 |
|------|------|------|------|
| Primary | h36，padding 0 16 | `accent` 底 + `accent-ink` 字，12.5/700，radius 10 | hover `brightness(1.05)`；active `scale(.98)`；focus 2px accent ring + 2px offset；disabled opacity .4 |
| Icon | 36×36 | 透明底 + 1px border + muted 图标 | hover `surface-raised`，图标转 text |
| Ghost / link | 自适应 | 无底无边，muted 11.5–12 | hover text；focus ring |

主按钮**每屏最多一个**。同一个视觉区不要出现两个酸橙实心按钮。

### 6.2 输入 / 搜索

- h36，radius 10，`surface-raised` 底，1px `border`，左图标 15px。
- 占位符 `text-faint`，12.5；输入文字 `text`。
- focus：边框转 `accent`，外加 3px `accent-weak` 光晕。
- 错误：边框转 `negative`，下方 11px `negative` 说明；不要只变红。

### 6.3 导航项

- h40，padding 0 12，gap 11，radius 10，14/500，默认 `text-muted`。
- hover：文字转 `text`，底 `surface-raised` 50%。
- active：底 `surface-raised`，文字 `text`，图标 `accent`。
- 分组间距 4；组与组之间 24 + 1px 分隔线（可选）。

### 6.4 卡片

```css
.card{
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--layout-card-pad);
}
```

- 头部：标题 14/600 + 右侧 meta 11 `text-faint`。
- 卡片内区块间距 16；底部操作区与内容间距 16，上方可加 1px 分隔线。
- 卡片高度由内容决定；同排卡片默认等高（grid stretch）。

### 6.5 胶囊 / 状态

| 类型 | 规格 |
|------|------|
| Delta | h22，padding 0 8，radius full，10.5/700；`positive-weak`+`positive` 或 `negative-weak`+`negative` |
| Live | h30，padding 0 11，radius full，11.5/600；`positive-weak` 底 + 6px 圆点 + `positive` 字 |
| Neutral | 同上，`surface-raised` 底 + `text-muted` 字 |

### 6.6 表格

- 列头：10/600，`0.08em` 字距，大写，`text-faint`，h30。
- 行：h52，`border-bottom` 1px；最后一行去边框；hover `surface-raised` 50%。
- 主单元格：30px 币种方块（radius 8，`surface-raised`，1px 边框，11.5/700）+ 两行文本（12.5/600 + 10.5 faint）。
- 数字列左对齐（与样图一致），不要右对齐；保持列网格稳定。
- 迷你图宽 86×26，线宽 1.6，颜色随涨跌。

### 6.7 环形图 / 折线图

- 环形：外径 132，线宽 14，空轨道 `data-3`；中心数字 16/600 + 10.5 micro 大写标签。
- 折线：线宽 2，主色 `accent`；面积填充 `accent` 16% → 0 的线性渐变。
- 网格线：仅横向，1px，`--color-chart-grid`，最多 3 条；不画 Y 轴刻度。
- X 轴标签 10px `text-faint`，只标 4–5 个点。
- 图例：7×7 圆角方块 + 11.5 文本 + 右侧数值；顺序与环形一致。

### 6.8 开关

- 34×20，radius full；开：`accent` 底 + 14px `accent-ink` 圆钮右置 3px；关：`data-3` 底 + `text-muted` 圆钮。
- 过渡 120ms；点击热区至少 44×44。

### 6.9 头像 / 币种标记

- 头像：36 圆，1px border，`surface-raised` 底，12.5/600 muted 缩写。
- 币种方块：30×30，radius 9，`surface-raised`，1px border，11/700 muted；不要用币种品牌色，保持单色系统。

---

## 7. 页面骨架

### 7.1 标准页面

```html
<div class="app">                 <!-- grid: 232px 1fr -->
  <aside class="side">…</aside>
  <div class="main">
    <header class="top">…</header>
    <main class="content">        <!-- padding 32/24, gap 24 -->
      <div class="page-head">…</div>
      <section class="card">…</section>
    </main>
  </div>
</div>
```

### 7.2 页面头部

- 左：标题 `xl` + 副标题 12 `text-faint`（间距 5）。
- 右：一个主操作或分段控件；不要超过两个控件。
- 头部与首个卡片间距 20。

### 7.3 卡片内部结构

```
eyebrow (micro, faint)        右上 meta (11, faint)
hero value (display)          secondary stat (md)
meta row (11.5, faint)
──────────────────────────────
chart / table / content
```

---

## 8. 数据可视化

- **一个主序列。** 主数据线用 `accent`；第二序列 `data-1`；第三 `data-2`；第四 `data-3`。
- 语义色（正/负）只用于表达涨跌，不能当分类色。
- 同屏最多 4 个系列；超过 4 个归类为「Other」。
- 网格线只横向、最多 3 条；不使用纵向网格。
- 面积渐变只允许 `--color-chart-area` 到透明。
- 图表内文字最小 10px；轴标签不旋转。
- 空数据：画 `data-3` 空轨道 + 居中 12px `text-faint` 说明，不要留纯空白。

---

## 9. 文案

- **Sentence case**，除 micro 标签外不用全大写。
- 标签用名词（`Total balance` / `Available`），动作按钮用动词（`Deposit` / `Upgrade`）。
- 标题 ≤ 3 个词；说明 ≤ 2 行，超出用 tooltip。
- 不使用感叹号、不使用「请」，不写营销形容词。
- 数字与单位之间留空格：`0.846 BTC`；货币符号紧贴：`$128,430.55`。
- 时间优先相对表达：`Updated 2 min ago`，超过 24h 用日期。

---

## 10. 动效

| Token | 值 | 用途 |
|-------|----|------|
| `--duration-fast` | 120ms | hover、press、开关 |
| `--duration-base` | 180ms | 展开、弹层、页面内切换 |
| `--ease-standard` | `cubic-bezier(.2,.8,.2,1)` | 全部标准动效 |

- 不做弹跳、不做视差、不做超过 200ms 的装饰动画。
- 只动 `opacity` / `transform` / `background-color` / `border-color`。
- 必须支持 `prefers-reduced-motion: reduce` → 时长归零。

---

## 11. 无障碍

- 所有交互元素 focus 可见：2px `accent` ring，offset 2。
- 点击热区 ≥ 36×36；开关/图标按钮外层扩到 44×44。
- 涨跌同时用颜色 + 符号/箭头表达。
- 图标按钮必须有 `aria-label`；图表提供文本摘要。
- `text-faint` 不用于操作、金额、关键数据。
- 表格行 hover 不是唯一选中反馈，需有 `aria-selected` / 勾选态。

---

## 12. 开发契约（给 AI / 工程师）

### 必须

1. 只使用 `theme.css` 中的 CSS 变量；颜色、字号、间距、圆角一律 `var(--…)`。
2. 新值先加 token：`tokens.json` → `python tools/build.py`；不允许业务代码就地写死。
3. 新组件先在 `kitchen-sink.html` 增加样例，再进业务页。
4. 每个交互组件实现 4 态：default / hover / focus-visible / disabled。
5. 完成前跑 `python tools/design_lint.py`，0 error。
6. 页面截图与 `demo/settings.html` 并排比对，确认属于同一语言。

### 禁止

- 裸 hex、`rgb()`、任意 px（1px 边框除外）。
- 纯黑 / 纯白、投影卡片、第二种强调色、第二种字体。
- 13 / 15 / 18 / 22px 等未入标尺的字号与间距。
- 用 emoji 当图标；用品牌色做币种标记。
- 为了「好看」加渐变、发光、玻璃拟态。

### 给 Agent 的启动提示词

```text
Read out/DESIGN.md, out/theme.css and out/tokens.flat.json before writing UI.
Use only CSS variables from theme.css. Do not invent colors, sizes or spacing.
If a value is missing, add it to tokens.json, run tools/build.py, then use it.
Model new screens on demo/settings.html and add component samples to kitchen-sink.html.
Run tools/design_lint.py before finishing.
```

---

## 13. 证据与置信度

| 结论 | 测量证据 | 置信度 |
|------|----------|--------|
| 画布 / 表面 / 控件面三层 | 像素占比 35.5% / 54.1% / 3.0% | 高 |
| 描边 #22252C | 1.0% 像素；= 白 7% 叠在 surface 上 | 高 |
| 酸橙 #C8F751 是唯一强调色 | 0.92% 像素，集中在主按钮/折线/logo | 高 |
| 卡片圆角 16 | 三大卡片测得 13.5 / 15.5 / 15.5 | 高 |
| 控件圆角 10 | 搜索框、按钮均为 10 | 高 |
| 间距基数 4px | 80% 的相邻间隙落在 4 的倍数 | 高 |
| 布局 232 / 64 / 32 / 24 | 侧栏与卡片包围盒 | 高 |
| 字阶 10.5–34 | 字形高度聚类 9 / 11 / 13 / 16 / 19.5 / 31 | 中 |
| hover / focus / disabled | 静态图不可见，按本文档约定 | 约定 |
| 响应式断点 | 静态图不可见，§4.4 为扩展规则 | 约定 |

**未从样图得到、需要产品/设计确认的：** 移动端导航形态、表单校验文案、弹层与菜单、加载与空状态、深浅色切换（当前只有深色）。
