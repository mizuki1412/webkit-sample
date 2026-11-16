# design/demo/ —— 审查 demo（/ui2demo 指令生成）

每张原图一个子目录：`<页名>/index.html`（单文件、Tailwind CDN、纯静态、无构建无 JS）。

**审查方式：浏览器直接打开 `index.html`**（需联网加载 Tailwind CDN），对照原图检查还原度。

审查通过后下指令「移植页面」（/demo2src）把 demo 元素落进 `src/views/`。
