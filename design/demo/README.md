# design/demo/ —— 纯 CSS/HTML 审查 demo（/design 指令生成）

本目录由 `/design` 指令**整体生成/重写**（README 保留）。当前为空：待首次 `/design` 产出。

**审查方式：浏览器直接打开 `index.html`**（无构建、无 JS、无外链）。

| 文件          | 说明                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `theme.css`   | 语义变量（复制自 `design/lang/build/theme.css`）                                                        |
| `demo.css`    | 语言词汇纯 CSS 形态：`.d-card` / `.d-card-raised` / `.d-label` + 按钮/输入/表格/表单/标签/导航/弹窗形态 |
| `index.html`  | 总览陈列板：色板 / 字阶 / 间距 / 圆角 / 动效 + 全组件 kitchen-sink                                      |
| `page-*.html` | 代表性整页（复刻 assets 素材的页面意象）                                                                |

demo 复刻的是**语言**（变量、形态、密度、节奏），不是像素仿制素材原图。
审查通过后下指令「实现ui」（/design-implement）落地进 `src/design/`。
