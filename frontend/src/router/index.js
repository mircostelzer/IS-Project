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
      path: '/emergencies',
      name: 'emergencies',
      component: () => import('../views/ViewEmergencies.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'error404',
      component: () => import('../views/ViewError404.vue'),
    }
  ],
})

export default router
