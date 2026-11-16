---
name: ui2demo
description: 把 UI 原图（设计稿/截图，放 design/assets/ 或用户指定路径）转成单文件 HTML demo：读图分析 → 产出 design/demo/<页名>/index.html（Tailwind + 纯静态，浏览器直接审查）。当用户说 "ui2demo"、"图片转demo"、"把这张图做成页面"、"出个 demo"，或 design/assets 有新原图要转 demo 时使用。只产出 demo，不改 src/（移植用 /demo2src）。
---

# ui2demo —— UI 原图 → HTML demo（阶段 1/2）

把一张 UI 原图转成**可在浏览器审查的静态 demo**。demo 的唯一使命：给人看效果、给
`/demo2src` 当移植底稿——它不是最终代码。

## 0. 前置

1. 输入：用户指定的原图（通常在 `design/assets/`）。没有图就停下要图。
2. 确定输出目录：`design/demo/<页名>/index.html`（页名用英文短横线，如 `page-dashboard`）。
3. 若存在 `design/assets/NOTES.md`（取舍偏好、想强调什么），作为第一优先级。

## 1. 读图（先整后零）

先看整页布局，再逐块提取，形成清单（可写进 demo 顶部 HTML 注释）：

- **布局**：几列栅格、侧栏/顶栏/内容区怎么分、留白节奏（外边距、块间距）
- **区块清单**：每个卡片/面板——底色、圆角、阴影、内边距、标题层级
- **组件清单**：按钮/表格/表单/标签/分页…各自的形态（尺寸、圆角、配色）
- **颜色**：主色、底色、文字层级色、状态色（正/负/警示）——从图上取值，不发明
- **字阶**：每级文字的字号/字重（像素反推有 ±1–2px 误差，取整就近）

图上没有的状态（hover/focus/disabled/响应式）**不发明**——移植阶段交给 antdv 默认行为。

## 2. 产出 demo

`design/demo/<页名>/index.html`，约束：

- **单文件**：HTML + Tailwind CDN（`<script src="https://cdn.tailwindcss.com"></script>`，打开需联网）。
- **优先 Tailwind class**：demo 的 class 要能原样搬进项目（项目用 Tailwind 4）——布局/间距/
  圆角/阴影/配色全用 Tailwind 词汇写，不用自定义语义 class。
- **纯静态**：无构建、无 JS 逻辑；数据写死示意即可。
- **贴原图**：颜色/间距/尺寸尽量还原；已知偏差在 demo 顶部注释标注。
- 原图里与 antdv 同款的控件（按钮、输入框、表格…）demo 阶段仍用纯 HTML 复刻其**视觉**
  （demo 不引框架）；映射成 antdv 组件是 /demo2src 的事。

## 3. 审查与迭代

浏览器打开 `index.html` 对照原图（用户审，或截图对比）。不贴就改，直到用户认可。

## 边界

- 只写 `design/demo/`；不碰 `src/`、不碰全局样式（移植是 /demo2src 的事）。
- 复刻自己项目的设计稿或提取自己产品的视觉规则；**不要复制他人受版权保护的界面**。
