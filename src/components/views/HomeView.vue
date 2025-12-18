<script setup lang="ts">
import WordList from '../words/WordList.vue'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
    <template v-if="!userStore.isAdmin">
        <div class="authorization-error">
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