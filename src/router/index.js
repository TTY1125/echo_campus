import { createWebHistory, createRouter } from 'vue-router'

import App from '@/components/index/Index.vue'

const routes = [
  {
    path: '/',
    component: App
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: () => import("@/components/articleDetail/ArticleDetail.vue"),
  },
  {
    path: "/user/:id",
    name: "user",
    component: () => import("@/components/userInfo/UserHomePage.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/components/userInfo/EditUserInfo.vue"),
  },
  {
    path: "/write",
    name: "write",
    component: () => import("@/components/write/WriteArticle.vue"),
  },
  {
    path: "/label",
    name: "label",
    component: () => import("@/components/label/LabelIndex.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/components/admin/AdminIndex.vue"),
  },
  {
    path: "/userManage",
    name: "userManage",
    component: () => import("@/components/admin/UserManage.vue"),
  },
  {
    path: "/reportManage",
    name: "reportManage",
    component: () => import("@/components/admin/ReportManage.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(() => {
  window.scrollTo(0, 0); // 滚动到页面顶部
});

export default router;