# webkit-sample

The sample usage for Vue3/Vite2/Tailwind project.

# usage

将webkit1412的lib库内嵌入项目中，考虑到element-plus的自动导入问题、项目定制化需求。

# env

- VITE_ROUTE_BASE_URL: 用于router的前缀。
- VITE_ASSETS_BASE_URL: 静态资源引入的前缀，同vite的base。
- VITE_OSS_PREFIX: 使用oss的文件存储和获取时的前缀地址。


# 模块

## request

## router

## route menu

将一组route指定为menu信息，menu是专用于后台管理界面框架。

对应的页面demo为`src/views/main.vue`

## service

## components

# TODO

## TODO List

- [x] element-plus: auto import 在v-loading时有bug。
- [ ] element-plus: 自动导入icon
- [ ] element: Message/MessageBox单独使用时，style未自动导入
- [ ] element modal drag 如果高度长时有bug
- [x] route的props在layout中的应用
- [x] vant和element在不同场景下切换 router
- [x] element-plus bug: 1.3.0-beta1, el-select绑定问题/dialog内部popper z-index bug
- ？？[ ] elp bug: kit-modal中，datepicker不能显示； build后
- [ ] consola临时依赖，https://github.com/vbenjs/vite-plugin-style-import/issues/66
- [ ] tinymce: https://www.tiny.cloud/get-tiny/language-packages/
- [ ] 增加补充示例页面
- [ ] bug：form的validate在初始打开时，会提示error msg
- [x] table的服务端分页模式。
- [ ] el-select bug: 多选时，不能自由取消
- [ ] 考虑到tailwind会覆盖其他element ui？在index.css之后引入了element.css。vant也同样问题。
- [ ] feature: web和app的component分开，编译分开
- [ ] el的全局配置中的中文问题，目前写在app.vue
- [ ] 增加lodash示例页面
- [ ] feature: 全局的loading、confirm

## bug fix

- 关于element auto import style引起的错误：因为在plugin/webkit中需要导入index.css，防止被tailwindcss的style覆盖，所以自动导入中取消了导入style。没有解决只是避免。
- 因为项目是js的，el是ts的，所有官网上有些导入会报错，比如zhCn
