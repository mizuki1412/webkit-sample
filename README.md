# webkit-sample

The sample usage of webkit1412.

# usage

将webkit1412的lib库内嵌入项目中，考虑到element-plus的自动导入问题、项目定制化需求。

lib目录将和webkit1412/lib同步。

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

- [ ] element-plus: auto import 在v-loading时有bug。
- [ ] element-plus: 自动导入icon
- [ ] route的props在layout中的应用
- [ ] vant和element在不同场景下切换 router
- [ ] element-plus bug: 1.3.0-beta2, 导致el-select 绑定问题
