<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSentenceStore } from '@/stores/sentence';
import { useWordStore } from '@/stores/word';
import SentenceDetailsCard from '@/components/sentences/SentenceDetailsCard.vue';
import WordCard from '@/components/cards/WordCard.vue';
import type { Word } from '@/stores/word';

const route = useRoute();
const sentenceStore = useSentenceStore();
const wordStore = useWordStore();

const sentenceId = route.params.id as string;

const { data, isLoading } = sentenceStore.getSentenceWithWords(sentenceId);
const { data: allWordsData } = wordStore.getAllWords();

const sentence = computed(() => data.value?.sentences?.[0] || null);
const sentenceWords = computed(() => data.value?.sentencewords || []);

const wordMap = computed(() => {
  const map = new Map<string, Word>();
  (allWordsData.value?.words as Word[] | undefined)?.forEach((w) => map.set(w.id, w));
  return map;
});

const orderedWords = computed(() =>
  sentenceWords.value
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((sw) => ({
      word: wordMap.value.get(sw.word_id),
      gloss: sw.gloss,
    }))
    .filter((item) => !!item.word) as { word: Word; gloss?: string }[]
);
</script>

<template>
  <div class="sentence-detail">
    <div v-if="isLoading" class="loading">Loading…</div>
    <template v-else-if="!sentence">
      <p>Sentence not found.</p>
    </template>
    <template v-else>
      <SentenceDetailsCard :text="sentence.text || ''" />
      <div class="words-section">
        <h3>Words</h3>
        <div v-if="orderedWords.length === 0">No words found for this sentence.</div>
        <div class="words-grid">
          <div class="word-wrapper" v-for="item in orderedWords" :key="item.word.id">
            <WordCard :word="item.word" />
            <div v-if="item.gloss" class="gloss">Gloss: {{ item.gloss }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.sentence-detail {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.words-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.words-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.word-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.gloss {
  font-size: 0.95rem;
  color: #555;
}
</style>

