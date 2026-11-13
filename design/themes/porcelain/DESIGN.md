# Porcelain Design Language · v1.0

> 从 `pics/ec71aa5bdb76f08b598df0c55ed63b3c.webp`（Commercehq 电商运营台）反演的可执行设计语言。
> 一句话：**淡紫灰画布上三块纯白面板，商务蓝做行动色，海军蓝大写字距标签是签名，小圆角紧凑网格。**
>
> - 机器可读：`tokens.json`（DTCG）→ `build/theme.css` / `build/tailwind.v4.css` / `build/tokens.js`
> - 证据：`measurements.json` + `semantic-map.json`
> - 与其他语言的关系：共享 token 语义契约，值域不兼容。与 Aurora 同为 light，但更克制：蓝色面积 ≤5%，靠字距与层级表达专业感。

## 1. 设计主张

| # | 原则 | 落地 |
|---|------|------|
| 1 | 白面板 + 描边分层 | 面板 radius-lg(10) + 1px border；画布 #E9EDF5 淡紫灰 |
| 2 | 海军蓝标题是签名 | 标题/区块标签/大数字用 `text-heading`(#0B1B4D)，不用纯黑 |
| 3 | 全大写宽字距标签 | 区块标题一律 micro 号 + `tracking-caps`(0.08em) + 大写（TOTAL SALES 式） |
| 4 | 蓝面积克制 | accent 只给按钮/选中项/柱图/进度线；画布上蓝占比 ≤5%（实测 4.1%） |
| 5 | 涨跌成对 | KPI 涨跌、渠道占比用 positive/negative 深色文字，不用弱底胶囊 |

## 2. 使用规则（给 Agent）

1. 只用 `build/theme.css` 的 CSS 变量；不写裸 hex、不写魔法 px。
2. 区块标题必须用 `.d-label`（构建产物提供）：大写 + `tracking-caps` + `text-faint`。
3. 侧栏白底：未选中项灰字 + 小图标；选中项 = accent 圆角按钮(radius-md)白字 + 左侧 3px 蓝 notch。
4. 表格：表头 surface-raised 底 + micro 大写；行 hover surface-raised。
5. 图表：柱图 data-1/data-2 蓝色双柱；渠道/进度用 3px `data-3` 水平线。
6. 提交前跑 `python tools/design_lint.py <files>`。

## 3. 组件形态（样图明确出现）

- **侧栏**：白底 232px，底部 CTA 按钮（accent 底）。
- **顶栏**：64px 白底 + 底描边，长条描边搜索框。
- **KPI 行**：图标圆片(40px, surface-raised/accent-weak 底) + 标签 + 大数字 + 涨跌幅三角。
- **柱图**：蓝色实心圆头柱(radius-full 顶端) + 灰色对比柱。
- **表格卡**：表头行 surface-raised，数据行白底，行间 1px border。
- **右栏活动流**：INSIGHT 下拉胶囊 + accent 实底信息卡（白字）+ 通知卡。

## 4. 测得 vs 推断

- **测得**：#DCE3EF(画布)/#FFFFFF(面板)/#F5F7FB(次面)、#3A78F2、#010B48 海军蓝、4px 网格、gutter 众数 16。
- **推断**：warning 色（样图未出现）、交互态、动效、字族（Inter 系假设）、画布应用内淡化值（原样图外框偏饱和，直接用在管理后台过重，取 #E9EDF5 并在 DESIGN 标注）。
