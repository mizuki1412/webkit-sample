# WebKit Sample — Agent Guide

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
npm run test     # vitest run（纯函数单测：权限判定、分页解析）
```

Vite 8 (not v5), config at `vite.config.mjs`; vitest config at `vitest.config.mjs`.

## Backend (go-frame) 对接约定

- 后端为 `go-frame`（默认 `rest.port=10000`、`rest.base` 空）；dev 代理 `/api → VITE_PROXY_TARGET || http://127.0.0.1:10000`。
- 响应包裹 `{result, message, data, total}`：0 成功、**401 登录失效**、**403 权限不足**、500 业务错误。
  401 → `lib/request/index.js` 清会话跳登录页（带 redirect）；403 → 仅提示。**勿把任何 401 处理改回 reload**（会死循环）。
- 权限判定权威在后端 `tokenkit.Principal`；前端镜像实现在 `lib/store/userInfo.js`（`matchPrivilege`/`userHasPrivilege`，多角色并集 − extend.privilegeExclude，支持 `*` 与 `user:*` 通配），与后端语义逐条对齐，两边改一处必须同步另一处。数据形状：`user.roles[].privileges`。
- 登出 `postUserLogout` 是 **POST /user/logout**，先请求成功（finally 里也清本地）再清 store——顺序反了会假登出。
- 服务端分页：后端 `JsonSuccessWithPage` 返回顶层 `{data, total}`；用 `lib/utils/page.js` 的 `parsePage(ret, currentPage, pageSize)` 映射成 kit-pagination-page 的 `{data, currentPage, total, totalPage}`。
- 文件上传/下载走 `lib/api/common.js`（`/common/upload`、`/common/download[/private]`、`/common/file/list|del`），私有下载靠 cookie 免 header；已删除的 OSS/service3 链路勿再引用。

## Architecture

- **Entry**: `src/main.js` → `src/plugins/webkit.js` bootstraps router, store, 轻量全局组件（KitModal/KitIcon/KitPaginationPage）
- **App shell**: `src/App.vue` — wraps `<router-view>` in antdv's `a-config-provider` + `a-app`
- **Router**: defined in `src/router/index.js`, uses `lib/router` for base setup + interceptors (`routeBaseBefore`/`routeBaseAfter`)
- **Lib** (`lib/`): reusable toolkit — components, layout, request, store, router, service, utils. Imported via absolute paths (e.g. `/lib/router`)
- **Views**: admin views in `src/views/`, mobile views in `src/views-app/`

## Bundle 纪律（主包体积）

主包目前 ~196KB (gzip ~57KB)。重库**禁止**进 `main.js`/`webkit.js` 全局注册：

- antdv 组件靠 `unplugin-vue-components`（AntdvNextResolver）按需——**不要** `app.use(antd)`
- `KitRichText`(tinymce)、`KitGantt`(dhtmlx)、`v-chart`(echarts)、`form-create` 只在使用页面局部 import（页面在 `import {ECharts as VChart} from "/lib/plugin/echarts"` 这类具名导入）
- 新增重组件同样处理；构建后主包超 ~300KB 需要说明理由

## UI Frameworks

- **antdv-next** (no import needed): auto-imported by `unplugin-vue-components` via `@antdv-next/auto-import-resolver`
- **Vant** (for mobile pages): also auto-imported; CSS loaded globally in `webkit.js`
- **Icons**: `vite-plugin-svg-icons` — put SVGs in `src/assets/icons/`, use `<KitIcon>` component

## Key Conventions

- Vite base URL comes from env var `VITE_ASSETS_BASE_URL`
- `lib/plugin/vite-helper.js` reads env with `loadEnv(mode, process.cwd())` — only `VITE_*` vars are exposed
- TinyMCE: place language pack in `public/tinymce/`
- `lib/plugin/vite-add-element.js` exists but is **not wired** into `vite.config.mjs`
- Tests: vitest（`lib/**/*.test.js`）；lint: oxlint（配置 `.oxlintrc.json`）；typecheck 仍无 — only Prettier (`semi: false`)
- Chinese locale (antdv + dayjs) set in `App.vue`

## Prettier

```bash
# Only config: semi: false
npx prettier --write .
```
