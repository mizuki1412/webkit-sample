# Lumen · 融合设计语言 v1.0

> **来源**：主体 [assets/2.webp](../assets/2.webp)（Commercehq 电商运营台，浅色），
> 元素补充 [assets/1.jpg](../assets/1.jpg) 亮色变体（金融仪表盘）。**浅色单 scheme，无暗色变体。**
> 证据：[evidence/2/](evidence/2/)（measurements + semantic-map + 预览）、[evidence/1/](evidence/1/)。
> 唯一事实源：[tokens.json](tokens.json)（72 叶子，DTCG）；`python design/tools/build.py` 编译。

## 1. 设计主张

**清爽商务运营台。** 淡紫灰画布上的纯白卡片，商务蓝做唯一强调；全大写字距标签
承担节标题层级（语言签名）；数字大而黑、正文 14px。分层靠**色块与极轻阴影**，
不靠描边（描边只用于输入/ghost 按钮）。从 1.jpg 吸收三个元素签名：
左侧彩色竖条 mark、深色对比卡（ink）、多彩数据系列。

## 2. 使用规则（给 Agent）

1. 只用语义变量（`--color-*` / `--space-*` / `--radius-*` / `--font-*` / `--layout-*` / `--shadow-*`），不写裸 hex / 魔法 px。
2. 页面词汇：`.d-card`（白卡）、`.d-card--flat`（浅灰嵌入卡）、`.d-card--mark`（左竖条卡）、
   `.d-card--ink`（深色对比卡）、`.d-label`（全大写节标签）、`.d-btn` / `.d-btn--ghost` / `.d-btn--soft`、
   `.d-input`、`.d-badge`、`.d-avatar`、`.d-progress`。词汇实现见 `demo/demo.css`（实现阶段移植进 `src/design/adapter.css`）。
3. 全大写标签 = 节标题的唯一形态：`font-size: var(--font-size-micro)` + uppercase + `var(--tracking-caps)` + `var(--color-text-muted)`。
4. 图表用色走 `--color-data-1..4`（蓝/靛/金/青），网格 `--color-chart-grid`，弱填充 `--color-chart-area`。
5. 涨跌语义：`positive` / `negative` 配 `*-weak` 底胶囊；`warning` 只做数据强调（金），不做状态色。
6. 缺值时改 `lang/tokens.json` → 重跑 `build.py`，不局部发明。

## 3. 语义变量表（核心）

| 变量 | 值 | 证据 |
|---|---|---|
| `--color-bg` | `#DDE4EF` | 实测 29.2%（画布，淡紫灰蓝） |
| `--color-surface` | `#FFFFFF` | 实测 28.5%（卡片/面板） |
| `--color-surface-raised` | `#F5F7FB` | 实测 23.4%（浅灰嵌入卡/输入底/**右栏底**） |
| `--color-border` | `#D1D8E8` | 实测 6.1% |
| `--color-text` | `#151827` | 实测区间 #000–#27282B 取中 |
| `--color-text-muted` | `#939AB1` | 实测两处一致（大写标签/表头） |
| `--color-accent` | `#3A78F2` | 实测 4.81%（选中/柱图/CTA/进度/链接） |
| `--color-positive` | `#0EA129` | 实测 ↑$15,686.65 |
| `--color-negative` | `#E5484D` | 实测 #E36F6F~#FF2B63 取中 |
| `--color-warning` | `#C6792A` | 实测 1.jpg Total Saved 金竖条 |
| `--color-ink` | `#151933` | 实测 1.jpg 信用卡（深色对比卡/tooltip） |
| `--color-sidebar` | `#FFFFFF` | 审查裁决：1.jpg 白底形式（2.webp 实测 #EFF1F7 被推翻） |
| `--color-header` | `#FFFFFF` | 推断（素材无贯通顶栏） |

完整清单见 tokens.json（每个叶子带证据 `$description`）。

## 4. 组件形态

| 组件 | 形态 | 来源 |
|---|---|---|
| 侧栏 | **1.jpg 形式**：侧栏列透明浮于窗口底，菜单条 = 白色圆角面板（200px 窄栏，`--color-sidebar` 白底 + `--shadow-card`，保留文字）；品牌卡 / 底部 CTA 独立浮动，**白底轻投影、无边框**（边框会与阴影打架，1.jpg hamburger 同法）；菜单项 `sidebar-text`，选中 = accent 圆角块 + 白字 + `--shadow-pop` 投影 + **菜单条左缘 accent 胶囊标**（~6×24，`--radius-full`） | 1.jpg + 2.webp |
| 按钮 | 主 = accent 实心 r8 h40；ghost = 白底 `border` 描边；soft = `accent-weak` 底蓝字（INSIGHT/CHECK DATA 形） | 2.webp + 1.jpg |
| 输入/搜索 | `surface-raised` 底 r8-10 h40，无边框；聚焦描边 `border-strong` | 2.webp |
| 表格 | `surface-raised` 圆角条卡，列头 muted 小字，数值黑 semibold，行无描边 | 2.webp |
| mark 卡 | 白卡 + 左侧 3px 彩条（`--color-warning` 金 / `--color-accent` 蓝 / data-2 靛） | 1.jpg |
| ink 卡 | `--color-ink` 深底白字（信用卡/tooltip/强调块），muted 用 `--color-ink-text-muted` | 1.jpg |
| 徽章 | `*-weak` 底 + 同色文字，r-full 胶囊（↑37% 绿 / ↓34% 红） | 2.webp |
| 头像点 | 圆形容器彩色底（青/绿），`.d-avatar` | 1.jpg/2.webp |
| 进度条 | 4px 高轨道 `chart-grid`，分段 accent 填充 | 2.webp REVENUE |
| 迷你折线 | 卡内右侧 sparkline（SVG path），data-1/2/3 | 1.jpg |

## 5. antd 映射表（/design-implement 直接消费）

| antd token | 值 | 语义来源 |
|---|---|---|
| `colorPrimary` / `colorInfo` / `colorLink` | `#3A78F2` | accent |
| `colorSuccess` | `#0EA129` | positive |
| `colorWarning` | `#C6792A` | warning |
| `colorError` | `#E5484D` | negative |
| `colorTextBase` / `colorText` | `#151827` | text |
| `colorTextSecondary` | `#939AB1` | text-muted |
| `colorTextTertiary` | `#B4BCD0` | text-faint |
| `colorBgLayout` | `#DDE4EF` | bg |
| `colorBgContainer` | `#FFFFFF` | surface |
| `colorBgElevated` | `#FFFFFF` | surface（下拉浮层 + shadow-pop） |
| `colorBorder` | `#B9C3DA` | border-strong |
| `colorBorderSecondary` | `#D1D8E8` | border |
| `borderRadius` | `8` | radius.md |
| `borderRadiusLG` | `12` | radius.lg |
| `borderRadiusSM` | `6` | radius.sm |
| `controlHeight` | `40` | layout.control-h |
| `fontSize` | `14` | font.size.base |
| algorithm | `defaultAlgorithm`（light） | $scheme |

## 6. 布局语法

- 三栏心智：侧栏 232 + 内容流 + 右栏 ~320（本仓库实现为 sider + header + content 两栏，右栏信息并入内容网格）。
- **分隔语法**：中央内容 = 白色浮层，方向性投影 `--shadow-sheet`（朝侧栏浅 → 白底侧栏与主区联动近；朝右栏深 → 与 `--color-surface-raised` 右栏分层清，实测接缝最暗 `#F2F3F7`）；右栏无白底无描边，其上的次级卡为白卡浮起；**右栏内容左内距加大（≥32px）避开阴影带**，投影只落在空的栏底上、不遮内容。
- **侧栏语法**：1.jpg 形式——侧栏列透明，菜单条为白色圆角面板（200px 窄栏 + 文字菜单，`--shadow-card` 浮起）；选中项 = accent 块 + 胶囊标贴菜单条左缘；与主区的联动靠 sheet 阴影浅侧。
- 内容节奏：`content-x/y = 24`，卡片间距 `--space-6`，卡内距 `--layout-card-pad`。
- 页首 = 全大写标签 → hero 数字（xl/tight）→ 说明行 → 图表 → 节标签 → 统计行/表格。

## 7. 测得 vs 推断

- **测得**：全部表面色、accent、muted、positive、金竖条、ink 卡、control-h 40、sidebar 232、4px 网格。
- **推断**（素材给不出）：hover/focus/disabled 态（alpha 变体）、border-strong、text-faint、
  chart-grid、data-3 金（晕值与实心之间）、ink-text-muted、阴影两档、motion、字体家族、header 白条、radius 档位归一。

## 8. 决策记录（融合裁决）

| 角色 | 候选 | 裁决 | 理由 |
|---|---|---|---|
| accent | 2.webp `#3A78F2` vs 1.jpg `#4972FE`/靛 `#4A6ACE` | **#3A78F2** | 主体素材；1.jpg 蓝降级为 data 系列与选中块同场景使用 |
| 画布 | 2.webp `#DDE4EF` vs 1.jpg `#EFEFEF` | **#DDE4EF** | 主体素材；1.jpg 灰太平（少紫蓝呼吸感） |
| 表面层数 | — | bg → surface → surface-raised 三层 | 2.webp 实测占比 29/28/23 三层分明 |
| 负面红 | 区域 #E36F6F vs 峰值 #FF2B63 | **#E5484D** | 区间取中：峰值太荧光、均值太粉 |
| 文字黑 | #000000 vs #27282B | **#151827** | 抗锯齿区间取中，保留轻海军蓝（与 ink 同族协调） |
| 暗色变体 | 1.jpg 双明暗样图 | **不采用暗色** | 用户明确要求 |
| 侧栏形态 | 2.webp 文本侧栏 vs 1.jpg 图标方块侧栏 | **文本侧栏** | 主体素材；1.jpg 的选中方块形态由 2.webp Dashboard 项同款承担 |
| 侧栏底/宽 | 2.webp `#EFF1F7` 230px vs 1.jpg 白底窄栏 | **白色菜单条 200px** | 用户审查裁决（2026-11-15，两轮收敛）：1.jpg 形式——白色圆角菜单条浮于窗口底，窄栏 + 文字；与主区联动靠 sheet 阴影浅侧 |
| 主区投影 | 全向 `--shadow-pop` | **方向性 `--shadow-sheet`** | 用户审查裁决（2026-11-15）：朝侧栏浅、朝右栏深，突出侧栏与主区联动 |
