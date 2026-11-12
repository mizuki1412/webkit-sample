# 从一张 UI 样图到可执行的设计语言（webkit-sample 集成版）

> 这套方法把一张 UI 样图**反演**成能约束后续开发的设计语言：design tokens、组件规范、准入门禁。
> 本目录已经跑通并适配本仓库（**Vue 3 + Vite 8 + Tailwind CSS 4 + antdv-next**）。

## 0. 一句话结论

**可以，而且值得工程化。** 但不要让模型“看图写一段设计规范”就完事——那样得到的是漂亮的形容词，不是可执行的约束。有效做法是把「看图」变成 **有证据、可编译、可检查** 的四件套：

```
DESIGN.md（可执行规范） + tokens（可编译） + kitchen-sink（活样例） + design-lint（门禁）
```

## 1. 方法：三层流水线

| 层 | 回答的问题 | 产物 | 谁来做 |
|----|-----------|------|--------|
| **测量层** | 图上到底有什么 | 色板、圆角、间距、字号、布局包围盒 | `tools/analyze.py`（像素事实） |
| **语义层** | 这些分别是什么角色 | 颜色角色、组件清单、布局语法、状态规范 | 视觉模型 + 人（`out/semantic-map.json`） |
| **契约层** | 以后怎么不跑偏 | `out/tokens.json` → CSS/Tailwind/Vue + `out/DESIGN.md` + `tools/design_lint.py` | 工程化 |

```
sample/mock.png
 ├─ tools/analyze.py ──► out/measurements.json   （客观测量 + out/measured-overlay.png）
 └─ vision pass ──────► out/semantic-map.json    （角色命名 + 组件/布局/状态）
                        │
                        ▼ 人审 + 归一化
                   out/tokens.json  (DTCG, 74 叶子)
                    │          │
        build.py ───┘          └── out/DESIGN.md（人/Agent 读的规范）
         │
         ├─ out/theme.css          CSS 变量（任意栈）
         ├─ out/tailwind.v4.css    Tailwind v4 @theme（本仓库首选）
         ├─ out/tailwind.preset.js Tailwind v3（迁移过渡）
         ├─ out/tokens.js          ESM（Vue/JS 里 import）
         └─ out/tokens.flat.json   lint 白名单
                        │
                        ▼
           out/kitchen-sink.html（组件陈列活样例）
           demo/settings.html  +  demo/vue/SettingsView.vue（同语言新页面）
                        │
                        ▼
                tools/design_lint.py（准入检查）
```

### 为什么不能只用一种

- **纯视觉模型**：能说出「深色、克制、一个高亮色」，但 `#C8F751` 还是 `#D4FF5E`、圆角 14 还是 16，每次都不一样，且无法审计。
- **纯脚本**：测得出 `#C8F751` 只占 0.92% 像素，但不知道它是主行动色还是图表装饰色。
- **混合**（本仓库路线）：脚本给事实，视觉给角色，人做取舍，tokens 固化，lint 防漂移。

## 2. 本次从样图反演出的关键事实

样图 [`sample/mock.png`](sample/mock.png) · 测量 [`out/measurements.json`](out/measurements.json) · 检测框 [`out/measured-overlay.png`](out/measured-overlay.png)

| 结论 | 证据 | token |
|------|------|-------|
| 三层表面（画布/卡片/控件） | 像素占比 35.5% / 54.1% / 3.0% | `#0B0D12 / #12151C / #171B24` |
| 1px 分隔线 | 1.0% 像素，= 白 7% 叠在 surface 上 | `#22252C` |
| 唯一强调色 | 0.92% 像素，集中在主按钮/折线/logo | `#C8F751` |
| 卡片圆角 16 / 控件圆角 10 | 实测 13.5–15.5 → 归一 16；输入/按钮 10 | `--radius-lg` / `--radius-sm` |
| 4px 网格 / 8px 节奏 | 80% 间隙落在 4 的倍数 | `--space-1…` |
| 布局 232 / 64 / 32 / 24 | 侧栏、顶栏、留白、卡片间距 | `--layout-*` |
| 字阶 10.5 → 34（8 级） | 字形高度聚类 9/11/13/16/19.5/31（置信度：中） | `--font-size-*` |

> 关键洞察：**强调色只占 0.92% 像素但语义权重最高**——纯按面积排序会把它忽略掉，所以「测量」必须与「语义」结合。测量噪声也如实标注在 [`out/DESIGN.md`](out/DESIGN.md) §13。

## 3. 集成进本仓库（Tailwind v4 + Vue）

本仓库不是纯 HTML 演示，是 **Vue 3 + Vite 8 + Tailwind CSS 4**（`@tailwindcss/vite`）+ antdv-next + ECharts。因此首选 v4 的 `@theme`，而不是 v3 的 JS preset。

### 3.1 颜色 / 间距 / 圆角 utility

Tailwind v4 的 `@theme` 会把 `--color-*` 暴露为颜色 utility、把 `--spacing-*` 扩展 spacing scale。把生成的 CSS 接进 Tailwind 入口（`web-frame/tailwind.css` 或 `src/after.css`）：

```css
@import "tailwindcss/theme.css";
@import "tailwindcss/utilities.css";
@import "../design/out/tailwind.v4.css";   /* 由 build.py 生成 */
```

之后在 Vue 组件里直接写：

```html
<div class="bg-bg text-text border border-border rounded-[16px] p-6">
  <span class="text-text-faint text-xs">Total balance</span>
</div>
<button class="bg-accent text-accent-ink rounded-[10px] h-9 px-4 text-sm font-bold">Save</button>
```

`bg-surface` / `text-text-faint` 这类 utility 来自 `--color-*`；`rounded-[16px]`、`h-9`、`p-6` 对应 radius/spacing token。

### 3.2 在 JS / Vue 里用（非 utility 场景）

```js
import { tokens } from "/design/out/tokens.js"
tokens.color.accent      // '#C8F751'
tokens.space['4']        // '16px'
tokens.radius.lg         // '16px'
```

用于 ECharts `series` 颜色、动态 style、测试断言等。

### 3.3 项目集成点建议

- `src/after.css`（当前为空）：放 tailwind 之上的设计 token 覆盖层。
- `web-frame/tailwind.css`：已有 `@source "./"`，框架类会被扫描；v4 的 `@theme` 加在这里最稳妥。
- antdv-next 组件走 `@antdv-next/tailwind/compat.css` 映射 token；本设计 token 需要一张到 antdv 的映射表（后续按需补）。

## 4. 在新页面里使用设计语言（给 Agent / 工程师）

```text
Read design/out/DESIGN.md, design/out/theme.css and design/out/tokens.js before writing UI.
Use only CSS variables / generated Tailwind utilities. Do not invent colors, sizes or spacing.
If a value is missing, add it to design/out/tokens.json, run design/tools/build.py, then use it.
Model new screens on design/out/kitchen-sink.html and design/demo/vue/SettingsView.vue;
add component samples to kitchen-sink.html. Run design/tools/design_lint.py before finishing.
```

## 5. 在本仓库里跑

```bash
cd D:/codes/web/webkit-sample

# 1. 重新编译 tokens（theme.css / tailwind.v4.css / tokens.js / tokens.flat.json）
python design/tools/build.py

# 2. 准入门禁（默认检查 demo 页面；传参可查自己的文件）
python design/tools/design_lint.py
python design/tools/design_lint.py demo/drift-example.html   # 验证能抓到 9 处跑偏

# 3. 重新测量样图（先有 Chrome 截图）
python design/tools/analyze.py design/sample/mock.png design/out
```

### 看效果

- 组件陈列页：[`out/kitchen-sink.html`](out/kitchen-sink.html)（截图 [`out/kitchen-sink.png`](out/kitchen-sink.png)）
- 原生新页面：[`demo/settings.html`](demo/settings.html)
- **Vue 版新页面**（本仓库真实栈）：[`demo/vue/SettingsView.vue`](demo/vue/SettingsView.vue)
  离线验证页：[`demo/vue/settings.render.html`](demo/vue/settings.render.html)（CDN：[`demo/vue/settings.cdn.html`](demo/vue/settings.cdn.html)）
  截图：[`demo/vue/settings.png`](demo/vue/settings.png)

## 6. 方法论的边界

- 静态样图给得出：颜色、形状、间距、字阶、组件形态、布局语法。
- **给不出**：hover/focus/disabled、响应式、动效、字体家族/字重、信息架构、交互。这些必须按约定补，并在文档里标成「推断」而非「测得」。
- 像素反推字号有 ±1–2px 误差；别当字体排版的唯一依据。
- 高分辨率、扁平纯色块多的图最准；照片、玻璃拟态、复杂渐变会变差。
- 用这套流程提取**自己产品的视觉规则**或做竞品抽象；不要用来复制他人受版权保护的界面。

## 7. 下一步（可选）

- 封装成可复用的 workflow / skill：输入一张图 → 产出 `design/` 目录 + kitchen-sink + lint。
- 接 Figma MCP（源文件而非截图，精度更高）。
- 加深浅双主题：给每个 token 增加 `light:` / `dark:` 语义。
- 把 antdv-next 组件与 token 的映射表补全，替换掉 `@antdv-next/tailwind/compat.css` 里的默认值。
