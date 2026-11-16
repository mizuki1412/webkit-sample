---
name: demo2src
description: 把 design/demo/ 审查通过的 HTML demo 移植进项目页面（src/views/）：布局壳用 Tailwind 原样搬，demo 里复刻的控件映射为 antdv 组件并保持其默认样式，接路由与 api。当用户说 "demo2src"、"移植页面"、"把 demo 落地"、"实现这个页面" 时使用。
---

# demo2src —— demo → src 页面移植（阶段 2/2）

**基线原则：antdv 组件保持默认样式。** 不加全局 css 覆盖、不动 antd 主题 token；
页面级视觉只落在 Tailwind class 与页面 `<style scoped>` 上。

## 0. 输入

1. `design/demo/<页名>/index.html`（/ui2demo 产物）。
2. 目标视图：用户指定 `src/views/<目录>/<页面>.vue`；未指定则按 demo 名建议并向用户确认。
3. 读 `AGENTS.md`（路由 / keep-alive / api 约定）。

## 1. 移植映射

逐块把 demo HTML 搬进 Vue 模板：

| demo 里的东西 | 移植成 |
| --- | --- |
| 布局壳/栅格/间距/卡片/背景（Tailwind class） | 原样保留 class |
| 复刻的按钮/输入/表格/表单/分页/弹窗等 antd 同款控件 | 换成 antdv 组件（a-button / a-table / a-form / …），**不写覆盖其样式的 css** |
| antd 没有的自定义块（图表卡、状态徽标、特殊排布…） | Tailwind class，必要时页面 `<style scoped>` 复刻 |
| 图标 | `<KitIcon>`（web-frame 公共图标先复制到 `src/assets/icons/`） |
| 写死的示意数据 | 接 `src/api/`（页面不裸发 axios；分页走 parsePage 约定） |

## 2. 接线

- 路由：`src/router/index.js` 注册；**组件名必须等于路由名**（文件名推断不一致的视图用
  `defineOptions({ name: 路由名 })` 声明），否则标签页 keep-alive 缓存匹配不上。
- 重库（echarts / quill）在用到它的页面局部 import，避免进首屏主包。
- 登录、权限、响应信封等框架约定见 `web-frame/AGENTS.md`。

## 3. 门禁

```bash
npm run lint    # 0 error 才算过
npm run test
```

起 dev server 浏览器过一眼页面，与 demo 对照；关签/切签验证 keep-alive。

## 边界

- 不改全局：不碰 tailwind 入口、`src/after.css`、`App.vue`、`web-frame/`。
- 不引入设计语言层：没有 tokens / theme / adapter，没有全局 antd 覆盖；一切样式页面内解决。
