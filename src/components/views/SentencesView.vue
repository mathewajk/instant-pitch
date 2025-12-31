<script setup lang="ts">
import SentenceList from '@/components/sentences/SentenceList.vue';
import SentenceForm from '@/components/sentences/SentenceForm.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div class="sentences-view">
    <div v-if="!userStore.isAdmin" class="authorization-error">
      <p>Sorry, you are not authorized to access this content.</p>
    </div>
    <div v-else class="content">
      <SentenceList />
      <SentenceForm />
    </div>
  </div>
</template>

<style scoped lang="less">
.sentences-view {
  width: 100%;
  height: 100%;
  padding: 1rem 2rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.authorization-error {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
  height: 100%;
}
</style>

