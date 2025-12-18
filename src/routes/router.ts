import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../components/views/HomeView.vue'
import WordDetails from '../components/views/WordDetails.vue'
import UserLogin from '../components/views/UserLogin.vue'

import { useUserStore } from '@/stores/user';

const routes = [
  { name: 'Home', path: '/', component: HomeView },
  { name: 'WordDetails', path: '/word/:tango', component: WordDetails },
  { name: 'Login', path: '/login', component: UserLogin },
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