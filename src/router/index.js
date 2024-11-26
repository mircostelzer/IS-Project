import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ViewHome.vue'),
    },
    {
      path: '/emergenze',
      name: 'emergenze',
      component: () => import('../views/ViewEmergenze.vue'),
    },
  ],
})

export default router
