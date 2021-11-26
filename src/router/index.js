
export const routes = [
  {
    path: "/full",
    name:"full",
    component: () => import('../views/page2/page3.vue'),
  },
  {
    path: '/',
    name: 'index',
    redirect:{name:"page1"},
    component: () => import('../views/main.vue'),
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
