import {RouteName} from "../../lib/router";

export const routes = [
  {
    path: "/full",
    name:"full",
    component: () => import('../views/page2/page3.vue'),
  },
  // app
  {
    path: "/app/login",
    name: RouteName.loginApp,
    component: () => import('../views-app/login.vue'),
    meta:{
      authDisable: true
    }
  },
  {
    path: "/app",
    name: RouteName.indexApp,
    component: () => import('../../lib/components-layout/kit-layout-app.vue'),
    meta:{
      menuApp:true,
      authDisable: true
    },
    props:true,
    children: [
      {
        path: '/app/index',
        name: 'app:index-page',
        component: () => import('../views-app/demo-app1.vue'),
        meta:{
          menuTitle: "一",
          menuIcon: 'common-index',
          menuAppIndex:true
        }
      },
      {
        path: '/app/page2',
        name: 'app:page2',
        component: () => import('../views-app/demo-app2.vue'),
        meta:{
          menuTitle: "二",
          menuIcon: 'common-index',
          menuAppIndex:true
        }
      },
      {
        path: '/app/page3',
        name: 'app:page3',
        component: () => import('../views-app/demo-app3.vue'),
        meta:{
          menuTitle: "三",
          menuIcon: 'common-index',
          menuAppIndex:true
        }
      },
    ]
  },
  // web
  {
    path: '/',
    name: 'index',
    redirect:{name:"page1"},
    component: () => import('../../lib/components-layout/kit-layout-admin.vue'),
    meta:{
      menu: true
    },
    children:[
      {
        path: '/page1',
        name: 'page1',
        component: () => import('../views/page1/page1.vue'),
        meta:{
          menuTitle: "子页面1",
          menuIcon: 'fee',
          authDisable: true
        }
      },
      // 无component的路由代表menu的分组信息
      {
        path: '/_sub_page2',
        name: 'page2',
        meta:{
          menuTitle: "子页面组",
          menuIcon: 'fee',
        }
      },
      {
        path: "/page2/p1",
        name:"page2_p1",
        component: () => import('../views/page2/page3.vue'),
        meta:{
          menuTitle: "子页面2p1",
          menuBelong: "page2",
          authDisable: true
        },
      },
      {
        path: '/page3',
        name: 'page3',
        component: () => import('../views/page2/page2.vue'),
        meta:{
          menuTitle: "子页面3",
          menuIcon: 'fee',
          authDisable: true
        },
      },
      {
        path: '/page4',
        name: 'page4',
        component: () => import('../views/page2/page2.vue'),
        meta:{
          menuTitle: "子页面4",
          menuIcon: 'fee',
          authDisable: true
        },
      },
      {
        path: '/page5',
        name: 'page5',
        component: () => import('../views/page2/page2.vue'),
        meta:{
          menuTitle: "子页面5",
          menuIcon: 'fee',
          authDisable: true
        },
      },
    ]
  }
]
