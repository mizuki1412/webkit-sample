# web-frame — 通用前端框架层 Agent Guide

`web-frame/` 是自包含的通用前端框架层（Vue 3 + Vite + antdv-next），以**独立 git 仓库**发布、经 **git subtree** 引入各项目：顶层目录是**后端中立的核心层**，`web-frame/backend/<name>/` 是**后端适配器层**。新项目按「新项目引导」引入本目录（含本文件）即可得到标准前端工程；对接新后端时新增一个适配器目录，不改核心层。webkit-sample 是官方示例与测试项目。

## 分层与依赖规则（最重要）

```
src（业务） ──→ web-frame 核心层 ──→ 什么都不依赖（仅 npm 三方包）
web-frame/backend/<name>（适配器） ──→ web-frame 核心层
```

- **核心层禁止 import `web-frame/backend/*`**：request/store/router/service/components/components-layout/utils/plugin 里不允许出现任何后端专属逻辑（协议键名、端点、权限模型、加密协议）。
- **适配器允许 import 核心层**（用相对路径），核心层组件经 `web-frame/store/backend.js` 的 `getBackend()` 反查适配器能力。
- 后端假设只允许存在于适配器内。判断标准：换一个后端（不同响应信封、不同鉴权、不同端点）时，需要改的文件必须全部落在 `web-frame/backend/<name>/`。

## 目录结构

```
web-frame/
├── AGENTS.md  index.js  VERSION  tailwind.css  assets/icons/
├── request/               axios 封装：request/download/upload/genGetUrl、错误通道、401 跳转
│   └── index.js           RequestConfig 可重载（协议键/错误处理/payloadCodec 钩子）
├── store/                 reactive 全局单例（无 pinia）
│   ├── configkit.js       VITE_* 环境装载（configKitInit）
│   ├── userInfo.js        会话状态 + token 的 localStorage 持久化（不含权限模型）
│   ├── backend.js         后端适配器注册表 setBackend/getBackend
│   ├── currentRoute.js  errorMsgChannel.js  index.js
├── router/                useRouter 工厂、登录/权限守卫（checkUserLogin 由适配器注入）、
│   └── menu.js            路由 meta 约定（RouteMetaKey/RouteName）、由路由表生成菜单
├── service/               组合式函数：useLoading/useLoadingModal、useSearch、useConfirm、
│   └── echarts-helper.js  echarts option 封装（重库，页面按需 import）
├── components/            Kit* 组件（每个 .vue 配同名 .js install 插件）：
│                          kit-modal/icon/pagination-page/rich-text/gantt/upload/
│                          color-picker/roll-title/err-channel/fabric-show + table/
├── components-layout/     kit-layout-admin(.vue/-horizon)、kit-layout-app 三件套、user-center
├── utils/                 纯函数：array/date/dayjs/logic/number/object/regex/uuid/clock/
│                          download/pinyin(-map)/antdv（index.js barrel 只收轻量通用件）
├── plugin/                vite 插件助手（vite-add-icon/antd/vant、vite-helper）+ echarts 注册
└── backend/
    └── go-frame/          go-frame 适配器（见下文「适配器契约」）
```

## 装配入口 setupWebkit（web-frame/index.js）

```js
import {setupWebkit} from "/web-frame"
import {goFrameBackend} from "/web-frame/backend/go-frame"
import {routes} from "./router"

setupWebkit(app, {
  env: import.meta.env,        // 默认 import.meta.env
  backend: goFrameBackend,     // 后端适配器（必须；未装配时 getBackend()/登录校验 fail-loud/fail-closed）
  routes,                      // 传入则创建 router、构建菜单、挂 routeBaseBefore/After 守卫
  // components: [...]         全局注册的组件插件，默认 [KitModal, KitIcon, KitPaginationPage]
})
```

setupWebkit 依次完成：引入 antdv reset + `/web-frame/tailwind.css` → `configKitInit(env)` + `setAxiosDefaultBaseUrl()` → `backend.install()` → 注册默认轻量组件 → 命令式 Modal 毛玻璃遮罩 patch → 创建路由并挂全局守卫。vant 等平台库样式由 app 侧自行引入。

## 后端适配器契约（web-frame/backend/<name>/）

一个适配器 = 一个目录 + 一个入口 `index.js`。参照 `go-frame/` 实现：

```js
export const myBackend = {
  name: "my-backend",
  install() {
    setBackend(myBackend)
    // 1) 响应信封协议键写入 RequestConfig（见 web-frame/request/index.js 注释）：
    //    defaultKeyCode/defaultKeyMsg/defaultKeyData/defaultCodeSuccess/defaultCodeAuthFail
    // 2) 注入 RouteInterceptorConfig.checkUserLogin（启动时校验会话，失败清本地）
  },
  user: { getUserInfo, login, logout, updatePwd, adminList },        // 会话/用户（user-center 消费）
  file: { upload, list, del, download, downloadPrivate, link, linkPrivate }, // 文件（kit-rich-text 等消费）
  page: { parse(ret, currentPage, pageSize) },                       // 分页适配 → {data,currentPage,total,totalPage}
  crypto: { enable(opts), disable(), active() },                     // 可选：报文加密（经 RequestConfig.payloadCodec 钩子）
}
```

核心层已有接缝，适配器只需填内容：`RequestConfig`（协议键、错误处理、`payloadCodec` 加密钩子）、`RouteInterceptorConfig`（登录校验）、`getBackend()`（组件取用 user/file 能力）。kit-pagination-page 的服务端分页契约固定为 `{data, currentPage, total, totalPage}`，适配器的 `page.parse` 负责把自家响应映射过来。

## go-frame 适配器对接约定

- 响应包裹 `{result, message, data, total}`：0 成功、**401 登录失效**、**403 权限不足**、500 业务错误。401 → 核心层清会话跳登录页（带 redirect）；403 → 仅提示。**勿把 401 处理改回 reload**（会 401→reload 死循环）。
- 权限判定权威在后端 `tokenkit.Principal`；前端镜像在 `backend/go-frame/principal.js`（`matchPrivilege`/`userHasPrivilege`/`checkPrivilege`，多角色并集 − `extend.privilegeExclude`，支持 `*` 与 `user:*` 通配），**与后端语义逐条对齐，两边改一处必须同步另一处**。数据形状：`user.roles[].privileges`。路由级鉴权用 `meta.authFunc`（配合 `checkPrivilege`）。
- 登出 `postUserLogout` 是 **POST /user/logout**，先请求成功（finally 里也清本地）再清 store——顺序反了会假登出。
- 服务端分页：后端 `JsonSuccessWithPage` 返回顶层 `{data, total}`；`parsePage(ret, currentPage, pageSize)`（`backend/go-frame/page.js`）映射成 kit-pagination-page 约定。
- 报文加密：后端挂载 `middleware.DecryptRequest/EncryptResponse` 的项目在启动时调 `payloadCryptoEnable({exclude: []})`（自 `"/web-frame/backend/go-frame"` 引入），它会向 `RequestConfig.payloadCodec` 注入 go-frame 信封协议（X-Enc-Key / X-Enc-Payload）；上传/下载自动跳过，服务端重启换钥自动重试一次。crypto-js/jsencrypt 动态 import 不进主包；协议互操作向量见 `backend/go-frame/payload-crypto.test.js`。
- 文件链路 `/common/upload`、`/common/download[/private]`、`/common/file/list|del`（`backend/go-frame/api-common.js`），私有下载靠 cookie。

## 新项目引导（subtree 引入 web-frame）

> 2026-11-07 已按本清单在空工程实测：`npm i → build → dev boot → 守卫重定向/页面渲染` 全通过；步骤 3 的最小依赖集即实测所用。

1. 脚手架：`npm create vite@latest my-app -- --template vue`，删除模板 src。
2. 引入 web-frame（上游仓库以实际地址为准）：

```bash
git remote add web-frame git@gitee.com:yingchaojie/web-frame.git
git subtree add --prefix=web-frame web-frame master --squash
```

3. 依赖（`npm i --force`，peer dep 冲突）。**最小可运行集（实测）**：
   - dependencies：`vue vue-router axios qs dayjs nprogress @vueuse/core antdv-next @antdv-next/icons @antdv-next/tailwind tailwindcss @tailwindcss/vite crypto-js jsencrypt`
   - devDependencies：`vite @vitejs/plugin-vue unplugin-vue-components @antdv-next/auto-import-resolver vite-plugin-svg-icons fast-glob`
   - 两个非显然项：**crypto-js/jsencrypt 必装**——虽只在开启报文加密后运行时使用，但适配器的动态 import 在构建期被静态解析，不装 build 直接失败；**fast-glob 必装**——`vite-plugin-svg-icons` 未声明它的传递依赖。
   - 按需追加：`vant @vant/auto-import-resolver`（移动端）、`echarts vue-echarts`（图表）、`tinymce @tinymce/tinymce-vue`（富文本）、`@form-create/antdv-next`（动态表单）、`@simonwep/pickr`（取色器）、`dhtmlx-gantt`（甘特图）、`vue-pdf-embed`（PDF）、`oxlint vitest jsdom`（质量工具，配置见 webkit-sample）。
4. 同步创建 `index.html`（`<div id="app">` + `<script type="module" src="/src/main.js">`）与 `src/App.vue`（`<router-view/>` 壳，中文 locale 可加 `a-config-provider`）；**`src/assets/icons/` 目录必须存在**（svg 插件扫描，可先放一个占位 svg）。
5. `vite.config.mjs`：

```js
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv} from "./web-frame/plugin/vite-helper"
import tailwindcss from '@tailwindcss/vite'
import {viteAddIcon} from "./web-frame/plugin/vite-add-icon"
import {viteAddAntD} from "./web-frame/plugin/vite-add-antd.js"

const plugins = [vue(), tailwindcss()]
viteAddIcon(plugins)   // svg 图标目录 src/assets/icons
viteAddAntD(plugins)   // antdv 按需自动引入

export default defineConfig({
  base: getEnv('VITE_ASSETS_BASE_URL'),
  server: {
    proxy: {"/api": {target: getEnv('VITE_PROXY_TARGET') || "http://127.0.0.1:10000",
      changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, "")}},
  },
  plugins,
})
```

6. `src/main.js`（模板见 webkit-sample `src/main.js`）：`createApp` → `setupWebkit(app, {env, backend, routes})` → `app.mount("#app")`。
7. `jsconfig.json` 配 `"paths": {"/web-frame/*": ["web-frame/*"]}`（IDE 跳转；Vite/vitest 原生支持 `/web-frame` 根绝对路径，vitest 已在配置中 alias）。
8. `.env` 最小集：`VITE_APP_NAME`（token 的 localStorage key 前缀）、`VITE_REQUEST_BASE_URL`（如 `/api`）、`VITE_ROUTE_MODE`（history/hash）、`VITE_TITLE`、`VITE_ASSETS_BASE_URL`；可选 `VITE_ROUTE_BASE_URL`、`VITE_TITLE_SIMPLE`、`VITE_TITLE_APP`、`VITE_OSS_PREFIX`、`VITE_WEB_TINYMCE_KEY`、`VITE_SCHEMA`。全表见 webkit-sample 根目录 `.env`。
9. src 目录约定：`src/router/index.js`（路由表，布局组件取 `/web-frame/components-layout/*`；**`authDisable` 只写在叶子页面上**，勿挂父路由）、`src/api/`（业务接口，`import {request} from "/web-frame/request"`）、`src/views/`（页面）、`src/views-app/`（移动端）、`src/assets/icons/`（svg）。

## 老项目升级（web-frame 更新后）

```bash
git fetch web-frame
git subtree pull --prefix=web-frame web-frame master --squash   # 三方合并，本地定制冲突会显式暴露
```

- 升级后跑 `npm run build && npm run test` 验证；`git log --oneline web-frame/` 可看本次带入的上游提交。
- **本地不要直接改 `web-frame/`**——业务定制以适配器（`backend/<name>/`）或上层封装实现；确需改框架时在上游仓库（web-frame 仓库或 webkit-sample）改并提交，项目里用 `git subtree pull` 同步，冲突由 git 三方合并处理。
- 上游发布流程（在 webkit-sample，web-frame 的开发仓库）：改 `web-frame/` → 提交 → `git subtree push --prefix=web-frame web-frame master`（或维护一个 split 分支后推送）。

## 开发约定

- **import 规范**：src → web-frame 一律 `/web-frame/...` 根绝对路径（Vite/vitest 原生支持）；web-frame 内部一律相对路径（保证独立成仓后自洽）。
- **Bundle 纪律**：重库（tinymce/dhtmlx-gantt/echarts/form-create）禁止全局注册，只在用到的页面局部 import（如 `import {ECharts as VChart} from "/web-frame/plugin/echarts"`）；antdv 组件靠 unplugin 自动按需，不要 `app.use(antd)`。首屏体积以 **dist/index.html 的 script + modulepreload 的 eager chunk 合计**为准（当前 ~250KB gzip）——单看 index chunk 会被 chunk 重分布误导（antdv 内部模块在共享 chunk 间流动）。
- 组件成对模式：每个 Kit 组件一个 `.vue` + 同名 `.js`（install 插件）；轻量组件可进 `components` 默认注册集，重组件不可。
- barrel 纪律：`utils/index.js`、`store/index.js` 只收轻量通用件；重库/平台专属（echarts-helper、loading-app(Vant)、confirm）走深路径引入，避免 barrel 拖包。
- 登录态路由：`meta.authDisable` 免登录；`meta.authFunc` 权限函数；保留路由名 `RouteName.login/loginApp/index/indexApp`。**注意：vue-router 4+ 会把父路由 meta 合并进子路由**——勿把 `authDisable: true` 挂在布局父路由上（子页面会全部继承为免登录；webkit-sample demo 的 `/` 布局路由即存在此问题，新项目应只给 login 等页面单独声明）。
- 测试：`npm run test`（vitest，`web-frame/**/*.test.js`，纯函数优先：分页解析、权限镜像、加密协议互操作向量）；lint：`npm run lint`（oxlint，0 error 才算过）。
- 改 `web-frame/` 后更新 `web-frame/VERSION`（YYYY-MM-DD 日期戳）。
