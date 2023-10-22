# webkit-sample

The sample usage for Vue3+Vite+TailwindCSS3 project.

App部分采用uniapp，参考uniapp-sample.

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

## service

## components

# TODO

## TODO List

- [ ] axios

[//]: # (- [ ] element-plus: 自动导入icon)
- [ ] element: Message/MessageBox单独使用时，style未自动导入; 已经全局导入style
- [x] bug：form的validate在初始打开时，会提示error msg
- [ ] 考虑到tailwind会覆盖其他element ui？在index.css之后引入了element.css。vant也同样问题。
- [ ] 增加lodash示例页面

## bug fix

- 关于element auto import style引起的错误：因为在plugin/webkit中需要导入index.css，防止被tailwindcss的style覆盖，所以自动导入中取消了导入style。没有解决只是避免。
- 因为项目是js的，el是ts的，所以官网上有些导入会报错，比如zhCn
