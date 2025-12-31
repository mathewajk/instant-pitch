<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useSentenceStore } from '@/stores/sentence';

const sentenceStore = useSentenceStore();
const { data, isLoading } = sentenceStore.getAllSentences();

const sentences = computed(() => data.value?.sentences || []);
</script>

<template>
  <div class="sentence-list card">
    <div class="header">
      <h2>Sentences</h2>
      <span v-if="isLoading">Loading…</span>
    </div>
    <div v-if="!isLoading && sentences.length === 0" class="empty">No sentences yet.</div>
    <ul v-else class="list">
      <li v-for="sentence in sentences" :key="sentence.id">
        <RouterLink :to="`/sentence/${sentence.id}`">{{ sentence.text }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.sentence-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    a {
      color: var(--text-light, #222);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  }

  .empty {
    color: #666;
  }
}
</style>

