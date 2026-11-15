---
name: design-implement
description: 把 design/lang 设计语言与 design/demo 审查 demo 实现进项目 src/design（app 皮肤）：编译 token、重写 theme.css/adapter.css/registry antd 映射、更新 main.js、清理旧语言残留与切换器、跑 lint 门禁。当用户说 "实现ui"、"实现设计"、"落地设计语言"，或 design/demo 审查通过后要求落地时使用。
---

# design-implement —— 设计语言落地（阶段 2/2）

把阶段 1（/design）产出并通过审查的语言素材与 demo，实现进 `src/design/`。

**前置**：`design/lang/tokens.json` 与 `design/lang/DESIGN.md` 必须存在（缺失则引导先跑 /design）；用户应已审查 `design/demo/`（若明显未审查，提示一句后继续）。

## 1. 编译

```bash
python design/tools/build.py   # lang/tokens.json → lang/build/{theme.css, tailwind.v4.css, tokens.js, tokens.flat.json}
```

## 2. 重写 src/design 皮肤（单语言）

- **theme.css**：以 `lang/build/theme.css` 内容为准（`:root` + `color-scheme`）；删除旧 `themes.css`、`designs.json`。
- **adapter.css**：重写为单语言作用域——去掉 `html[data-design]` / `[data-design="<id>"]` 前缀，规则直接在 `:root` 生效；页面词汇 `.d-card` / `.d-card-raised` / `.d-label` 与 `demo/demo.css` 保持同源（从 demo 移植）；antd 细节覆盖（表头/弹窗/菜单等）按 DESIGN.md 组件规范。
- **registry.js**：重写为单语言 antd 映射——值取 DESIGN.md 的 antd 映射表，algorithm 按 `$scheme` 选 `darkAlgorithm` / `defaultAlgorithm`；导出静态 `antdTheme` 常量。
- **design-tokens.js**：保留（运行时读 CSS 变量，图表用色）。
- **删除切换器**：`design-switcher.vue`、`use-design-theme.js` 删除；`App.vue` 移除 `<design-switcher/>`，`designTheme` 改为 registry 导出的静态 `antdTheme`。
- **解耦所有 useDesignTheme 使用方**：全仓 grep `use-design-theme`（App.vue、layout-admin.vue、views/…）逐一改造；`layout-admin.vue` 的布局形态按 DESIGN.md 布局语法**固化**（该图标栏就图标栏，该文本侧栏就文本侧栏），同步 `router/index.js` 注释。

## 3. main.js

```js
import "./design/theme.css"     // 变量在前
import "./design/adapter.css"   // 适配层在后
```

## 4. 残留清零

全仓 grep 以下关键词，代码与注释一并清零：

```
design/pics | design/themes | design/out | design/sample | all-themes | data-design | use-design-theme | design-switcher | designs.json
```

`design/`（assets/lang/demo/tools）与 `src/design/`（theme.css / adapter.css / registry.js / design-tokens.js）之外不应再有设计语言相关文件。web-frame 不动；`src/views-app/` 未接路由不动。

## 5. 门禁

```bash
python design/tools/design_lint.py                       # demo/ 审查页
python design/tools/design_lint.py src/design/adapter.css   # 皮肤适配层
npm run lint && npm run test && npm run build
```

全部 0 error / 通过才算完成。

## 6. 交付

- 报告改动清单（皮肤文件、解耦点、删除的切换器）。
- 提醒用户 `npm run dev` 肉眼验收——go-frame 后端本地起不了，登录后页面无法自动化视觉验证，需人工确认。
- 本次全部改动可 git 整体回滚；`design/lang` 与 `design/demo` 是语言事实源，后续改 token 重跑 build.py 即可。
