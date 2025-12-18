<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ModalsContainer } from 'vue-final-modal'

const userStore = useUserStore();
const router = useRouter();

const handleSignOut = async () => {
  await userStore.signOut();
  router.push('/login');
}

</script>

<template>
    <div class="grid-container">
      <div v-if="userStore.isSignedIn" class="header">
          <div class="user-info">Signed in as <strong>{{ userStore.user?.email }}</strong>.</div>
          <button @click="handleSignOut">Sign out</button>
      </div>
      <div v-else class="header">
        <div></div>
        <RouterLink to="/login"><button>Login</button></RouterLink>
      </div>
      <router-view />
    </div>
    <ModalsContainer />
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  color: var(--text-dark);
}

.grid-container {
  height: 100%;
  width: 100%;
  
  display: grid;
  grid-template-rows: 4em auto;
  overflow: hidden;
}
</style>