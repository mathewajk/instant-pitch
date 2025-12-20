import { createWebHistory, createRouter } from 'vue-router'

import ListView from '../components/views/ListView.vue'
import DetailView from '../components/views/DetailView.vue'
import LoginView from '../components/views/LoginView.vue'

import { useUserStore } from '@/stores/user';

const routes = [
  { name: 'Home', path: '/', component: ListView },
  { name: 'Details', path: '/word/:tango', component: DetailView },
  { name: 'Login', path: '/login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  
  if (userStore.isLoading) {
    return;
  }
  
  if (!userStore.isSignedIn && to.name !== 'Login') {
    return { name: 'Login' }
  }
  
  if (userStore.isSignedIn && to.name === 'Login') {
    return { name: 'Home' }
  }
})

export default router