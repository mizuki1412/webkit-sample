# WebKit Sample — Agent Guide

go-frame 后端的示例与测试工程，同时是 **web-frame 框架层的开发仓库**（`web-frame/` 目录即上游源，经 git subtree 发布到各项目）。**框架层的分层规则、适配器契约、go-frame 对接约定、新项目引导/升级工作流见 [web-frame/AGENTS.md](web-frame/AGENTS.md)**——改 web-frame、接新后端、起新项目先读它；本文件只记 sample 工程自身的事项。

## Stack

Vue 3 + Vite 8 (Rolldown) + Tailwind CSS 4 + antdv-next (+ Vant for mobile views)

## Setup

```bash
npm i --force    # required: force install due to peer dep conflicts
```

## Dev & Build

```bash
npm run dev      # npx vite --mode dev       → loads .env + .env.dev
npm run build    # npx vite build --mode pro → loads .env + .env.pro
npm run lint     # oxlint（0 error 才算过；存量 warning 见 .oxlintrc.json 注释）
npm run test     # vitest run（纯函数单测：分页解析、权限镜像、报文加密互操作向量）
```

Vite 8 (not v5), config at `vite.config.mjs`; vitest config at `vitest.config.mjs`.

## Architecture

- **Entry**: `src/main.js` → `setupWebkit(app, {env, backend: goFrameBackend, routes})`（web-frame 标准装配入口）
- **App shell**: `src/App.vue` — wraps `<router-view>` in antdv's `a-config-provider` + `a-app`（中文 locale 在此设置）
- **Router**: `src/router/index.js` 定义路由表，布局组件取 `/web-frame/components-layout/kit-layout-admin.vue`
- **Business api**: `src/api/`（示例 `test.js`），页面不裸发 axios
- **Views**: admin 视图 `src/views/`，移动端视图 `src/views-app/`（当前未接路由，处于闲置状态）

## Backend (go-frame)

- 后端为 `go-frame`（默认 `rest.port=10000`、`rest.base` 空）；dev 代理 `/api → VITE_PROXY_TARGET || http://127.0.0.1:10000`。生产走同源 nginx 反代（若后端配了 `rest.base` 则反代目标为 `/server`）。
- 响应信封/401/403 语义、登出顺序、parsePage 分页、payloadCryptoEnable 报文加密、权限镜像同步——全部见 [web-frame/AGENTS.md](web-frame/AGENTS.md) 的「go-frame 适配器对接约定」。
- 本工程默认未开启报文加密；需要时在 `src/main.js` 调 `payloadCryptoEnable()`（自 `/web-frame/backend/go-frame` 引入）。

## Sample 专属约定

- `src/after.css`：tailwind 之上的覆盖样式，在 `src/main.js` 于 tailwind 之后引入。
- TinyMCE 语言包放 `public/tinymce/`；`vite-plugin-svg-icons` 扫 `src/assets/icons/`，图标组件用 `<KitIcon>`（web-frame/assets/icons/common 有公共 svg，用时复制过来）。
- form-create 只在 `/fc/*` demo 页局部引入；重库（tinymce/dhtmlx/echarts）同样页面局部 import——Bundle 纪律详见 web-frame/AGENTS.md。
- Tests: vitest（`web-frame/**/*.test.js` + `src/**/*.test.js`）；lint: oxlint（`.oxlintrc.json`）；typecheck 仍无 — only Prettier (`semi: false`)。

## Prettier

```bash
# Only config: semi: false
npx prettier --write .
```
