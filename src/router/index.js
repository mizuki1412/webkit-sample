import {RouteName} from "/web-frame/router"

export const routes = [
  // web
  {
    path: "/login",
    name: RouteName.login,
    component: () => import("../views/login.vue"),
  },
  {
    path: "/login-joke",
    name: "login-joke",
    component: () => import("../views/login-joke.vue"),
    meta: {
      authDisable: true,
    },
  },
  {
    path: "/",
    name: RouteName.index,
    redirect: {name: "page1"},
    // 本仓库封装的布局：文本侧栏 + 标签页（keep-alive）
    // 注意勿配 authDisable：vue-router 4+ 父路由 meta 合并进子路由，
    // 挂在布局路由上会让全部子页面跳过登录拦截（web-frame AGENTS 点名问题）。
    // 免登录页面只在叶子路由单独声明（见 /login-joke）。
    component: () => import("../layouts/layout-admin.vue"),
    meta: {
      menu: true,
    },
    children: [
      {
        path: "/page1",
        name: "page1",
        component: () => import("../views/page1/page1.vue"),
        meta: {
          menuTitle: "子页面1",
          menuIcon: "fee",
        },
      },
      {
        path: "/modal",
        name: "modal",
        component: () => import("../views/dialog/modal.vue"),
        meta: {
          menuTitle: "弹出框",
          menuIcon: "fee",
        },
      },
      // 无component的路由代表menu的分组信息
      {
        path: "/_sub_table",
        name: "_sub_table",
        meta: {
          menuTitle: "表格",
          menuIcon: "fee",
        },
      },
      {
        path: "/table/normal",
        name: "table_normal",
        component: () => import("../views/tables/table-normal.vue"),
        meta: {
          menuTitle: "一般表格",
          menuBelong: "_sub_table",
        },
      },
      {
        path: "/table/server",
        name: "table_server",
        component: () => import("../views/tables/table-server.vue"),
        meta: {
          menuTitle: "服务端分页",
          menuBelong: "_sub_table",
        },
      },
      {
        path: "/_sub_demo",
        name: "_sub_demo",
        meta: {
          menuTitle: "Demo模板",
          menuIcon: "fee",
        },
      },
      {
        path: "/code/table",
        name: "code_table",
        component: () => import("../views/code_demo/init_table_vue.vue"),
        meta: {
          menuTitle: "table page",
          menuBelong: "_sub_demo",
        },
      },
      {
        path: "/pagination",
        name: "pagination",
        component: () => import("../views/pagination/pagination-page.vue"),
        meta: {
          menuTitle: "分页页面",
          menuIcon: "fee",
        },
      },
      {
        path: "/rich-text",
        name: "rich-text",
        component: () => import("../views/rich-text/rich-text.vue"),
        meta: {
          menuTitle: "富文本编辑",
          menuIcon: "fee",
        },
      },
      
      // {
      //   path: "/fabric",
      //   name: "fabric",
      //   component: () => import("../views/fabric/fabric.vue"),
      //   meta: {
      //     menuTitle: "fabric测试",
      //     menuIcon: "fee",
      //   },
      // },
      
    ],
  },
]
