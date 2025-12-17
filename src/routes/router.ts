import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../components/HomeView.vue'
import WordDetails from '../components/WordDetails.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/word/:tango', component: WordDetails },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router