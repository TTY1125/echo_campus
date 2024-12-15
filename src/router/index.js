import { createMemoryHistory, createRouter } from 'vue-router'

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
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;