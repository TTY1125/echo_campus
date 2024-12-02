import { createMemoryHistory, createRouter } from 'vue-router'

import App from '@/components/index/Index.vue'

const routes = [
  { path: '/', component: App },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;