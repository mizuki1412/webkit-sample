# router

## menu

### 一级二级菜单

因为menu结构信息是和router信息绑定的，所以二级菜单所属的一级菜单也会存在于router中，只是这个route没有component

### router meta 自定义字段

定义于RouteMetaKey：

- authFunc：访问权限判断函数，return bool。***在路由拦截时执行***
- authDisable： 禁用登录拦截。***在路由拦截时执行***
- menu：bool，只用于主路由的meta，表示此主路由将用于menu数据（注：以下的key都是作用于主路由内的子路由）。***menu相关***
- menuIcon：图标name，应用于KitIcon组件。***menu相关***
- menuTitle：string，在main.vue中使用。***menu相关***
- menuBelong：string，一级菜单的name，用于标识此为二级菜单。***menu相关***
- menuEx：bool, 表改路由信息不纳入menu。***menu相关***

// todo
 未在menu中的子页面处理
