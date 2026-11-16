# design/ —— UI 原图 → HTML demo → 移植进框架

不做全局设计语言。流程只有两步指令（本仓库工作区技能，位于 `.zcode/skills/`）：

```
design/assets/          UI 原图（设计稿 / 截图；NOTES.md 可选：取舍偏好）
   │  /ui2demo（读图 → 单文件 HTML demo）
   ▼
design/demo/<页名>/index.html    Tailwind + 纯静态，浏览器直接审查（需联网加载 Tailwind CDN）
   │  人审通过 → /demo2src（移植进 src/views/）
   ▼
src/views/...           布局壳用 Tailwind 原样搬；demo 里复刻的控件映射成 antdv 组件，
                        保持 antdv 默认样式；示意数据接 src/api/
```

## 目录契约

| 目录       | 内容                                   | 谁写      |
| ---------- | -------------------------------------- | --------- |
| `assets/`  | 用户投放的 UI 原图                     | 人        |
| `demo/`    | 每页一个子目录，单文件 `index.html`    | /ui2demo  |

## 约定

- demo 是审查产物与移植底稿，不是最终代码：无构建、无 JS 逻辑，class 全用 Tailwind 词汇
  （项目用 Tailwind 4，可原样搬进 vue）。
- **antdv 组件保持默认样式**：不加全局 css 覆盖、不动 antd 主题 token；页面级视觉只落在
  Tailwind class 与页面 `<style scoped>` 上。
- 复刻自己项目的设计稿或提取自己产品的视觉规则；**不要复制他人受版权保护的界面**。
