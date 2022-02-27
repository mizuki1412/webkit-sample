# webkit-sample

The sample usage for Vue3/Vite2/Tailwind project.

# usage

将webkit1412的lib库内嵌入项目中，考虑到element-plus的自动导入问题、项目定制化需求。

# env

- BASE_URL: 该参数同步于vite的base，用于router的前缀。如果是静态文件的前缀，需要设置vite的base。（可通过build --base=xx设置）

# 模块

## request

## router

## route menu

将一组route指定为menu信息，menu是专用于后台管理界面框架。

对应的页面demo为`src/views/main.vue`

## service

## components

# TODO

- [x] element-plus: auto import 在v-loading时有bug。
- [ ] element-plus: 自动导入icon
- [ ] element: Message/MessageBox单独使用时，style未自动导入
- [ ] element modal drag 如果高度长时有bug
- [x] route的props在layout中的应用
- [x] vant和element在不同场景下切换 router
- [x] element-plus bug: 1.3.0-beta1, el-select绑定问题/dialog内部popper z-index bug
- [ ] consola临时依赖，https://github.com/vbenjs/vite-plugin-style-import/issues/66
- [ ] tinymce: https://www.tiny.cloud/get-tiny/language-packages/
- [ ] 增加补充示例页面
- [ ] bug：form的validate在初始打开时，会提示error msg
- [ ] table的服务端分页模式。
- [ ] el-select bug: 多选时，不能自由取消
- [ ] 考虑到tailwind会覆盖其他element ui？在index.css之后引入了element.css。还是自动引入css的问题。
