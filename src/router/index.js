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
    //component: () => import("@/components/index/ArticleDetailIndex"),
  },
  {
    path: "/user/:id",
    name: "user",
    component: () => import("@/components/userInfo/userHomePage.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/components/userInfo/editUserInfo.vue"),
  },
  {
    path: "/write",
    name: "write",
    component: () => import("@/components/write/WriteArticle.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;