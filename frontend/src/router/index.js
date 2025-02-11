import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ViewHome.vue'),
    },
    {
      path: '/storico',
      name: 'storico',
      component: () => import('../views/emergencies/ViewStorico.vue'),
    },
    {
      path: '/dettagli',
      name: 'dettagli',
      component: () => import('../views/emergencies/ViewDettagli.vue'),
    },
    {
      path: '/accedi',
      name: 'accedi',
      component: () => import('../views/user/ViewAccedi.vue'),
    },
    {
      path: '/registrati',
      name: 'registrati',
      component: () => import('../views/user/ViewRegistrati.vue'),
    },
    {
      path: '/profilo',
      name: 'profilo',
      component: () => import('../views/user/ViewProfilo.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/ViewDashboard.vue'),
    },
    {
      path: '/invia_segnalazione',
      name: 'invia_segnalazione',
      component: () => import('../views/user/ViewSegnalazione.vue'),
    },
    {
      path: '/conferma_segnalazione',
      name: 'conferma_segnalazione',
      component: () => import('../views/dashboard/ViewEditSegnalazione.vue'),
    },
    {
      path: '/pubblica_comunicazione',
      name: 'pubblica_comunicazione',
      component: () => import('../views/dashboard/ViewComunicazione.vue'),
    },
    {
      path: '/modifica_comunicazione',
      name: 'modifica_comunicazione',
      component: () => import('../views/dashboard/ViewEditComunicazione.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error404',
      component: () => import('../views/ViewError404.vue'),
    }
  ],
})

export default router
