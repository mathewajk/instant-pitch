<script setup lang="ts">
import WordList from '../words/WordList.vue'
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleSignOut = async () => {
  await userStore.signOut();
  router.push('/login');
}
</script>

<template>
    <template v-if="!userStore.isAdmin">
        <div class="authorization-error">
            <p>{{ userStore.isAdmin }}</p>
            <p>Sorry, you are not authorized to access this content.</p>
        </div>
    </template>
    <WordList v-else />
</template>

<style scoped>
.authorization-error {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
  height: 100%;
}
</style>