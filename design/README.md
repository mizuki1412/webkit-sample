# design/ —— 从参考素材到落地的设计语言工作流

**一套项目一套 UI 语言。** 素材放 `design/assets/`，两个阶段指令完成「分析 → 审查 → 落地」
（均为本仓库工作区技能，位于 `.zcode/skills/`）：

```
design/assets/      参考素材（样图 / 元素截图；NOTES.md 可选：取舍偏好、主导关系）
   │
   │  /design（阶段 1：分析 + 融合 + 审查产物；不碰 src/）
   ▼
design/lang/        语言素材：tokens.json（DTCG 唯一事实源）+ DESIGN.md（可执行规范）
                    + evidence/（测量与语义证据）+ build/（build.py 产物）
design/demo/        纯 CSS/HTML 审查 demo（浏览器直接打开，无构建、无 JS）
   │
   │  人审 demo → 下指令「实现ui」
   │  /design-implement（阶段 2：落地 src/）
   ▼
src/design/         app 皮肤：theme.css（变量）+ adapter.css（词汇 + antd 覆盖）
                    + registry.js（antd 映射）+ design-tokens.js（JS 读变量，图表用色）
```

## 目录契约

| 目录          | 内容                                                         | 谁写              |
| ------------- | ------------------------------------------------------------ | ----------------- |
| `assets/`     | 用户投放的参考素材                                           | 人                |
| `lang/`       | 设计语言素材；重跑 /design 整体重写                          | /design           |
| `demo/`       | 纯 css/html 审查页；保留 README.md                           | /design           |
| `tools/`      | analyze.py（测量）/ build.py（编译）/ design_lint.py（门禁） | 仓库              |
| `src/design/` | app 皮肤（实现态）                                           | /design-implement |

## 方法：三层流水线

**测量层**（`analyze.py` 像素事实）→ **语义层**（视觉 + 人定角色）→ **契约层**（tokens 固化 + lint 门禁）。

纯视觉模型给不出可审计的值（`#C8F751` 还是 `#D4FF5E` 每次不一样）；纯脚本不懂语义
（占 0.92% 像素的强调色按面积排序会被漏掉）。混合流水线：脚本给事实，视觉给角色，
tokens 固化，lint 防漂移。

## 工具

```bash
python design/tools/analyze.py design/assets/<图> design/lang/evidence/<素材>/   # 测量证据
python design/tools/build.py                                                     # lang/tokens.json → lang/build/
python design/tools/design_lint.py                                               # demo/ 门禁（默认）
python design/tools/design_lint.py <files>                                       # 指定文件（如 src/design/adapter.css）
```

依赖：Python + cv2 / numpy / Pillow（本机已装）。

## 方法边界

静态样图给得出颜色、形状、间距、字阶、组件形态、布局语法；给不出 hover/focus/disabled、
响应式、动效、字体家族/字重——按既有体系推导并在 DESIGN.md 标「推断」，不冒充测得。
像素反推字号有 ±1–2px 误差；高分辨率、扁平纯色块多的图最准。
用本流程提取自己产品的视觉规则或做竞品抽象；**不要复制他人受版权保护的界面**。

## 当前状态（过渡期）

- `design/lang/`、`design/demo/` 为空，待首次 `/design` 生成（assets/ 已有两张初始样图）。
- `src/design/`（themes.css / designs.json / registry.js…）是旧 noir+porcelain 双主题的
  **过渡期冻结皮肤**——源 tokens 已随旧 `design/themes/` 清理（git 历史可查）；
  首个 `/design-implement` 会将其整体替换为 `design/lang` 的单语言实现。
