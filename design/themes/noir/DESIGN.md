# Noir Design Language · v1.0

> 从 `pics/9e86025a06aa77238927e02082f6b2fd.jpg`（金融仪表盘，双明暗样图）反演的可执行设计语言，**取其暗色变体为唯一主体**。
> 一句话：**近黑紫底上靠 8% 白描边分层，蓝色是唯一行动色、金色只做第二数据语义，小圆角高密度。**
>
> - 机器可读：`tokens.json`（DTCG）→ `build/theme.css` / `build/tailwind.v4.css` / `build/tokens.js`
> - 证据：`measurements.json` + `semantic-map.json`
> - 与其他语言的关系：共享 token 语义契约，值域不兼容。**本语言是三套中唯一 dark scheme**（`color-scheme: dark`）。

## 1. 设计主张

| # | 原则 | 落地 |
|---|------|------|
| 1 | 靠描边分层，不靠阴影 | 卡片/输入/菜单一律 1px `border`（白 8%）；全语言无 box-shadow |
| 2 | 亮度阶梯极小 | bg #131118 → surface #1B1920 → raised #26232E，每档 ~5% 明度 |
| 3 | 蓝是行动，金是数据 | accent 只给按钮/选中/焦点；金色只给数据线与徽标，禁止当状态色 |
| 4 | 高密度 | base 字号 13、卡片间距 16、顶栏 56、窄图标侧栏 72 |
| 5 | 小圆角 | 卡片 12 / 按钮 8 / 小件 6；胶囊只出现在日期范围与开关 |

## 2. 使用规则（给 Agent）

1. 只用 `build/theme.css` 的 CSS 变量；不写裸 hex、不写魔法 px。
2. **禁止 box-shadow**（`shadow.card` token 即 `none`；antd 组件默认阴影需覆盖为描边）。
3. 金额/数字用 `font-weight-semibold` + `font-variant-numeric: tabular-nums`。
4. 正负值成对出现时用 `positive-weak`/`negative-weak` 弱底胶囊（+$ 绿 / −$ 红，样图明确出现）。
5. 图表：主线 `data-1`(蓝)、二线紫 `data-2`、金线 `data-3`；网格 `chart-grid`(白 6%)。
6. 侧栏是 72px 纯图标栏：选中项 = accent 圆角方块 + 白图标；展开菜单面板浮层用 surface-raised。
7. 提交前跑 `python tools/design_lint.py <files>`。

## 3. 组件形态（样图明确出现）

- **侧栏**：72px 图标栏，与画布同色仅右描边分隔；选中项蓝色圆角方块（radius-md）。
- **顶栏**：56px，描边输入框式搜索（不是胶囊），右侧日期范围选择器胶囊。
- **卡片**：radius-lg(12)，surface 底 + 描边；左侧 3px accent 竖条强调（Exchange/Total Saved 卡）。
- **按钮**：主按钮 accent 底 radius-md；次按钮 surface-raised 底 + 描边。
- **交易列表**：图标圆片(36px, raised 底) + 名称 + 时间(micro) + 金额右对齐（负值红）。
- **会员卡**：紫底(#723DED)圆角卡作为特殊数据载体。

## 4. 测得 vs 推断

- **测得**：#15141A/#1B1920/#27242F 亮度阶梯、#4972FE、#723DED、白 6-8% 分隔线、4px 网格、72px 窄栏、13px 级正文。
- **推断**：金色取目测 #E8B339（样图压缩后误差 ±10）；交互态、动效、字族（Inter 系假设）。
- 明暗双样图中**浅色变体未采纳**——如需浅色金融语言应另立主题，不与 Noir 混用。
