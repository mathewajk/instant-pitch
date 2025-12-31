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
          <div class="nav-links">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/review">Review</RouterLink>
          </div>
          <div class="user-actions">
            <div class="user-info">Signed in as <strong>{{ userStore.user?.email }}</strong>.</div>
            <button @click="handleSignOut">Sign out</button>
          </div>
      </div>
      <div v-else class="header">
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/review">Review</RouterLink>
        </div>
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

  .nav-links {
    display: flex;
    gap: 1rem;
    align-items: center;

    a {
      text-decoration: none;
      color: var(--text-dark);
      font-weight: 600;
    }

    a:hover {
      text-decoration: underline;
    }
  }

  .user-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  button {
    background-color: var(--button-dark);
    color: var(--text-dark);
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: var(--button-dark-hover);
  }
}

.grid-container {
  height: 100%;
  width: 100%;
  
  display: grid;
  grid-template-rows: 4em auto;
  overflow: hidden;
}
</style>