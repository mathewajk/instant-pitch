<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Word } from '@/stores/word';

const props = defineProps<{
  totalQuestions: number;
  correctAnswers: number;
  incorrectWords: Word[];
}>();

const emit = defineEmits<{
  startNew: [];
}>();

const percentage = computed(() => 
  Math.round((props.correctAnswers / props.totalQuestions) * 100)
);
</script>

<template>
  <div class="review-results">
    <div class="results-header">
      <h1>Review Complete!</h1>
      <div class="score">
        <div class="percentage">You answered {{ correctAnswers }} / {{ totalQuestions }} items correctly ({{ percentage }}%).</div>
      </div>
    </div>

    <div v-if="incorrectWords.length > 0" class="incorrect-words">
      <h2>Words to Review</h2>
      <div class="word-grid">
        <RouterLink
          v-for="word in incorrectWords"
          :key="word.id"
          :to="`/word/${word.tango}`"
          target="_blank"
          class="word-item"
        >
          <div class="word-tango">{{ word.tango }}</div>
        </RouterLink>
      </div>
    </div>

    <div class="actions">
      <button class="action-button" @click="$emit('startNew')">
        Start New Session
      </button>
      <RouterLink to="/" class="action-button link-button">
        Return to Word List
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="less">
.review-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2em;
  gap: 2em;
  text-align: center;

  .results-header {
    h1 {
      font-size: 3rem;
      margin: 0 0 1em 0;
    }

    .score {
      .percentage {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 0.5em;
      }

      .fraction {
        font-size: 1.5rem;
        color: #666;
      }
    }
  }

  .incorrect-words {
    width: 100%;
    max-width: 900px;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1em;
    }

    .word-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1em;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .word-item {
      padding: 1em;
      border: 1px solid #ccc;
      border-radius: 0.5em;
      background-color: #f9f9f9;
      text-decoration: none;
      color: inherit;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
      cursor: pointer;

      &:hover {
        border-color: var(--mora-peak, #ff6b6b);
        background-color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .word-tango {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        color: var(--text-light);
      }
    }
  }

  .perfect-score {
    font-size: 1.5rem;
    color: #4caf50;
  }

  .actions {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    justify-content: center;
  }

  .action-button {
    padding: 1em 2em;
    background-color: var(--button-dark, #333);
    color: white;
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
    font-size: 1.1em;
    transition: background-color 0.2s;
    text-decoration: none;
    display: inline-block;

    &:hover {
      background-color: var(--button-dark-hover, #555);
    }

    &.link-button {
      background-color: #666;

      &:hover {
        background-color: #777;
      }
    }
  }
}
</style>

