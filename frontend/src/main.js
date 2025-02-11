import './assets/main.css'

import router from './router'
import { createApp } from 'vue'
import { loadUserFromCookies } from './states/loggedUser';

import App from './App.vue'
import InstantSearch from 'vue-instantsearch/vue3/es';

const app = createApp(App)
app.use(router)
app.use(InstantSearch);

loadUserFromCookies()
app.mount('#app')
