import {RouteName} from "../../lib/router"

export const routes = [
  // app
  // {
  //   path: "/app/login",
  //   name: RouteName.loginApp,
  //   component: () => import("../views-app/login.vue"),
  //   meta: {
  //     authDisable: true,
  //   },
  // },
  // {
  //   path: "/app",
  //   name: RouteName.indexApp,
  //   component: () => import("../../lib/components-layout/kit-layout-app.vue"),
  //   meta: {
  //     menuApp: true,
  //     authDisable: true,
  //   },
  //   props: true,
  //   children: [
  //     {
  //       path: "/app/index",
  //       name: "app:index-page",
  //       component: () => import("../views-app/demo-app1.vue"),
  //       meta: {
  //         menuTitle: "一",
  //         menuIcon: "common-index",
  //         menuAppIndex: true,
  //       },
  //     },
  //     {
  //       path: "/app/page2",
  //       name: "app:page2",
  //       component: () => import("../views-app/demo-app2.vue"),
  //       meta: {
  //         menuTitle: "二",
  //         menuIcon: "common-index",
  //         menuAppIndex: true,
  //       },
  //     },
  //     {
  //       path: "/app/page3",
  //       name: "app:page3",
  //       component: () => import("../views-app/demo-app3.vue"),
  //       meta: {
  //         menuTitle: "三",
  //         menuIcon: "common-index",
  //         menuAppIndex: true,
  //       },
  //     },
  //   ],
  // },
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
    component: () => import("../../lib/components-layout/kit-layout-admin.vue"),
    meta: {
      menu: true,
      authDisable: true,
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
      
      {
        path: "/gantt",
        name: "gantt",
        component: () => import("../views/gantt/gantt.vue"),
        meta: {
          menuTitle: "甘特图测试",
          menuIcon: "fee",
        },
      },
      {
        path: "/pdf",
        name: "pdf",
        component: () => import("../views/pdf/pdf.vue"),
        meta: {
          menuTitle: "pdf",
          menuIcon: "fee",
        },
      },
    ],
  },
]
