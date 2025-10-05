# webkit-sample

The sample usage for Vue3+Vite+TailwindCSS/DaisyUI project.

App部分采用uniapp，参考uniapp-sample.

`npm i --force`

依赖说明：
- fast-glob 是 vite-plugin-svg-icons需要的

# 环境变量说明

`.env`文件是公共环境变量，`.env.dev`开发环境，`.env.pro`生产环境。（自定义环境可以在vite build --mode指定）

- VITE_ROUTE_BASE_URL: 用于router的前缀。
- VITE_ROUTE_MODE: 路由模式设置（history/hash）
- VITE_ASSETS_BASE_URL: 静态资源引入的前缀，同vite的base。
- VITE_OSS_PREFIX: 使用oss的文件存储和获取时的前缀地址。
- VITE_REQUEST_BASE_URL: 默认的后端api前缀
- VITE_APP_NAME: 
- VITE_TITLE: 标题
- VITE_TITLE_APP
- VITE_TITLE_SIMPLE: 用于后台菜单顶部缩进时的标题

# 模块

## request

- 默认设置了request请求的前缀
- RequestConfig.errShowFunc 重载函数，错误信息展示
- RequestConfig.errDataHandleFunc 重载函数，错误信息拦截处理
- RequestConfig.defaultContentType 默认请求的body content type，控制是form还是json
- RequestConfig.defaultCode: 默认的api响应码

## router

### interceptor

- routeBaseBefore: 路由前的拦截
- routeBaseAfter: 路由后的拦截
- RouteInterceptorConfig.checkUserLogin: 校验用户登录

### menu

将一组route指定为menu信息，menu是专用于后台管理界面的菜单。

#### 一级二级菜单

因为menu结构信息是和router信息绑定的，所以二级菜单所属的一级菜单也会存在于router中，只是这个route没有component

#### router meta 自定义字段

定义于RouteMetaKey：

- authFunc：访问权限判断函数，return bool。***在路由拦截时执行***
- authDisable： 禁用登录拦截。***在路由拦截时执行***
- menu：bool，只用于主路由的meta，表示此主路由将用于menu数据（注：以下的key都是作用于主路由内的子路由）。***menu相关***
- menuIcon：图标name，应用于KitIcon组件。***menu相关***
- menuTitle：string，在main.vue中使用。***menu相关***
- menuBelong：string，一级菜单的name，用于标识此为二级菜单。***menu相关***
- menuEx：bool, 表改路由信息不纳入menu。***menu相关***

## store

- configKit: 对env配置的装载和处理
- currentRoute: 当前路由信息
- errorMsgChannel: 当前错误信息
- globalMessage: 全局信息（原想用在全局信息提醒）
- userInfo: 用户信息

## service

### echarts-helper

对echarts option的一些封装

### loading

应用antdv的v-loading，对请求转圈的封装。

### search

对搜索框的数据逻辑封装。

## components

### KitIcon

用了 vite-plugin-svg-icons，雪碧图技术，方便通过一个组件统一导入svg，同时可以动态的通过变更参数来变化图标。

[vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader): 这个是每个svg单独导入，有些场景不太灵活。

- lib/plugin/vite-add-icon, vite接入组件，默认图标目录：src/assets/icons
- kit-icon.js 注册雪碧图

### KitRollTitle

滚动标题

## KitRichText

基于tinymce6

汉化包需要下载后放在public/tinymce中。
[汉化包下载](https://www.tiny.cloud/get-tiny/language-packages/)

[配置文档](https://www.tiny.cloud/docs/tinymce/6/)

[配置文档-plugins](https://www.tiny.cloud/docs/tinymce/latest/plugins/)

[配置文档-toolbar列表](https://www.tiny.cloud/docs/tinymce/latest/available-toolbar-buttons/)

# 其他说明

- lib/assets/icons 只是为了公用的svg，使用时需要复制到src中

## 关于UI框架的定制化

可以在index.css中的设置css变量来定制化控制。

# 工具库

- [vueuse](https://vueuse.org/)
- [lodash](https://www.lodashjs.com/)

# TODO

## TODO List

- [ ] daisyui 有问题 更新 https://v5.daisyui.com/docs/v5-beta/
- tailwindcss4 改默认的layer方式加载。
- [ ] TinyMCE license

