# WebKit Sample — Agent Guide

go-frame 后端的新项目工程模板（新项目以此为工程基础起步，同时充当 web-frame 框架的示例与测试载体）。**框架层是独立 git 仓库 web-frame，以内嵌独立仓库方式放在项目根下的 `web-frame/`（父仓库 .gitignore，各项目各自 clone 一份），其分层规则、适配器契约、go-frame 对接约定、新项目引导/升级工作流见 `web-frame/AGENTS.md`**——改框架、接新后端、起新项目先读它；本文件只记本仓库自身的事项。

## Stack

Vue 3 + Vite 8 (Rolldown) + Tailwind CSS 4 + antdv-next (+ Vant for mobile views)；框架层 web-frame 为内嵌独立仓库（vite 零特殊配置）

## Setup

```bash
git clone git@gitee.com:yingchaojie/web-frame.git web-frame   # 框架仓库嵌套在项目内（父仓库已 ignore）
npm i --force    # required: force install due to peer dep conflicts
```

## Dev & Build

```bash
npm run dev      # npx vite --mode dev       → loads .env + .env.dev
npm run build    # npx vite build --mode pro → loads .env + .env.pro
npm run lint     # oxlint（0 error 才算过）
npm run test     # vitest run（sample 自有测试；框架单测在 web-frame/ 下 npm test）
```

Vite 8 (not v5), config at `vite.config.mjs`; vitest config at `vitest.config.mjs`。

## Architecture

- **Entry**: `src/main.js` → `setupWebkit(app, {env, backend: goFrameBackend, routes})`（web-frame 标准装配入口）
- **App shell**: `src/App.vue` — wraps `<router-view>` in antdv's `a-config-provider` + `a-app`（中文 locale 在此设置）
- **Router**: `src/router/index.js` 定义路由表，布局组件取 `src/layouts/layout-admin.vue`（独立实现：品牌卡侧栏 + 顶栏标签页；消费 web-frame 的 storePageMenu 与 user-center）。demo 页面需 go-frame 登录后访问——布局路由不配 `authDisable`（vue-router 父路由 meta 会被子路由继承，挂了就全部页面免登录；免登录页只在叶子单独声明，如 login-joke）。
- **标签页保活**：`layout-admin.vue` 的标签栏对已入签页面做 keep-alive（切签不重建、关签销毁缓存）；入签页面的**组件名必须等于路由名**（文件名推断不一致的视图用 `defineOptions({ name: 路由名 })` 声明，如 table-normal.vue → `table_normal`），否则 keep-alive include 匹配不上、缓存失效。该约定由 `src/router/routes.test.js` 回归测试固化。
- **Business api**: `src/api/`（示范见 `test.js`：实体 CRUD 五件套 + 每端点具名函数 + 契约注释；查询 GET+`showMsg:false`，写操作默认 showMsg，数组参数显式 JSON），页面不裸发 axios
- **Views**: admin 视图 `src/views/`，移动端视图 `src/views-app/`（Vant；模板预留，未接路由）

## web-frame 内嵌仓库注意事项

- **升级框架**：`cd web-frame && git pull`；**改框架**：直接在 `web-frame/` 里改（独立仓库，commit 后 push），见其 AGENTS.md。
- **不要把 `web-frame/` 提交进本仓库**（已 .gitignore）；给框架新增第三方依赖时同步装进框架仓库 devDeps（其单测环境用）。
- `web-frame/tailwind.css` 的 `@source "./"` 不可删：框架目录被 .gitignore，tailwind v4 自动检测会跳过它，靠该登记扫描框架 class。

## Backend (go-frame)

- 后端为 `go-frame`（默认 `rest.port=10000`、`rest.base` 空）；dev 代理 `/api → VITE_PROXY_TARGET || http://127.0.0.1:10000`。生产走同源 nginx 反代（若后端配了 `rest.base` 则反代目标为 `/server`）。
- 响应信封/401/403 语义、登出顺序、parsePage 分页、payloadCryptoEnable 报文加密、权限镜像同步——全部见 `web-frame/AGENTS.md` 的「go-frame 适配器对接约定」。
- 本模板默认未开启报文加密；需要时在 `src/main.js` 调 `payloadCryptoEnable()`（自 `/web-frame/backend/go-frame` 引入）。

## Sample 专属约定

- `src/after.css`：tailwind 之上的覆盖样式，在 `src/main.js` 于 tailwind 之后引入。
- 富文本为 Quill（web-frame `kit-rich-text.vue`）；`vite-plugin-svg-icons` 扫 `src/assets/icons/`，图标组件用 `<KitIcon>`（web-frame/assets/icons/common 有公共 svg，用时复制过来）。
- 重库（quill/echarts）在用到它的页面局部 import，避免整库进首屏主包——Bundle 纪律详见 web-frame/AGENTS.md。
- Tests: vitest（`src/**/*.test.js`；现有 `src/router/routes.test.js` 固化 keep-alive 约定；框架测试随 web-frame 仓库）；lint: oxlint（`.oxlintrc.json`）；无 typecheck — Prettier (`semi: false`)。

## 页面工程经验沉淀（2026-11-18）

跨项目通用的联调踩坑沉淀；写页面时直接遵守：

- **请求与 api 层**
  - `request` 返回 axios response，**信封在 `.data`**：`const ret = (await apiX()).data` 再读 `ret.data/ret.total`。
  - 数组参数：go-frame 适配器已设 `qsOptions={arrayFormat:"repeat"}`，form/GET 数组直接可绑；复杂结构/保险起见仍显式 JSON（`src/api/test.js` 有示范）。
  - api 层模式照 `src/api/test.js`。
- **列表页统一模式**：`filter` reactive + `const run = fn => useLoading(loading, fn)()`（**不要**解构 `{run}`）+ 服务端分页 `kit-pagination-page :from-server="true" :page-server-handle` 返回 `parsePage(ret, page, pageSize)`，`onMounted` 里 `pageRef.refresh(1)`（组件不会自动首载）。useLoading 的 loading 必须是 **ref**（reactive 对象字段会被解包成布尔，包裹静默失效）。
- **antdv-next 三个坑**
  - Modal 在 onMounted 同步置 `open` 会 portal 渲染不出（连外壳都没有）→ 自动开弹窗一律 `setTimeout(fn, 50)`；按钮点击打开不受影响。
  - `a-table @change="fn(a, $event)"` 只会拿到第一个参数（分页对象），filters 丢失 → 写 `@change="(...args) => fn(...args)"`。
  - 横向滚动只能写 `:scroll="{x:N}"` **对象**（字符串属性 `scroll-x="1100"` 不生效）；`scroll.x` 必须 ≥ 定宽列合计；每表只留一列自适应（其余定宽含 ellipsis），表头宽 ≈ 字数×14 + padding(small 16/middle 32)，带排序/筛选图标再加 ~20。
- **浏览器环境坑**
  - 模板里调用的辅助函数必须在 script setup 定义——未定义时 setup 抛错、**整页空白但别的路由正常**，vite 编译与 oxlint 均不报，只能靠运行时定位。
  - 宽度自适应不要用 ResizeObserver（内嵌浏览器/后台标签页帧不跑时连初始 observe 都不派发）→ `onMounted` 同步 `getBoundingClientRect` + window resize 监听。

## UI 落地流程（design/ 原图 → demo → 移植）

- **不做全局设计语言**，无 token / 皮肤层；**antdv 组件保持默认样式**（不加全局 css 覆盖、不动 antd 主题 token）。
- 两个阶段指令（本仓库工作区技能 `.zcode/skills/`）：UI 原图放 `design/assets/` → **`/ui2demo`**（读图产出 `design/demo/<页名>/index.html`：单文件 + Tailwind CDN、纯静态，浏览器对照原图审查）→ 人审通过 → **`/demo2src`**（移植进 `src/views/`：布局壳 Tailwind class 原样搬，antd 同款控件换成 antdv 组件，示意数据接 `src/api/`，注册路由 + keep-alive 组件名对齐）。目录契约见 `design/README.md`。
- 页面级视觉只落在 Tailwind class 与页面 `<style scoped>`；全局层（tailwind 入口、`src/after.css`、`App.vue`）不改。

## Prettier

```bash
# Only config: semi: false
npx prettier --write .
```
