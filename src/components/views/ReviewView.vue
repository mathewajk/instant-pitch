<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect, watch, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import ReviewQuestion from '../review/ReviewQuestion.vue';
import ReviewResults from '../review/ReviewResults.vue';
import { useWordStore } from '@/stores/word';
import type { Word } from '@/stores/word';

const wordStore = useWordStore();

type AnswerOption = {
  word: Word;
  correct: boolean;
};

type ReviewState = {
  words: Word[];
  currentIndex: number;
  answers: { word: Word; correct: boolean }[];
  answerOptions: AnswerOption[][];
};

const reviewState = ref<ReviewState | null>(null);
const questionRef = ref<InstanceType<typeof ReviewQuestion> | null>(null);
const isLoading = ref(true);

const currentWord = computed(() => 
  reviewState.value?.words[reviewState.value.currentIndex] || null
);

const currentAnswerOptions = computed(() => 
  reviewState.value?.answerOptions[reviewState.value.currentIndex] || []
);

const isComplete = computed(() => 
  reviewState.value !== null && 
  reviewState.value.currentIndex >= reviewState.value.words.length
);

const correctAnswers = computed(() => 
  reviewState.value?.answers.filter(a => a.correct).length || 0
);

const incorrectWords = computed(() => 
  reviewState.value?.answers
    .filter(a => !a.correct)
    .map(a => a.word) || []
);

// Generate answer options for a word
const generateAnswerOptions = (word: Word, allWords: Word[]): AnswerOption[] => {
  const moraeCount = wordStore.getMorae(word.yomi).length;
  const correctPitch = word.pitch;
  
  // Generate all possible pitches (0 to moraeCount inclusive)
  const possiblePitches = Array.from({ length: moraeCount + 1 }, (_, i) => i);
  
  // If there are 4 or more possible pitches, we want 4 options (1 correct + 3 incorrect)
  // If there are fewer than 4 possible pitches, show all possible pitches
  const targetOptions = Math.min(4, possiblePitches.length);
  const incorrectCount = targetOptions - 1; // Subtract 1 for the correct answer
  
  // Remove the correct pitch
  const incorrectPitches = possiblePitches.filter(p => p !== correctPitch);
  
  // Shuffle and take the needed number of incorrect options
  const shuffledIncorrect = [...incorrectPitches].sort(() => Math.random() - 0.5);
  const selectedIncorrect = shuffledIncorrect.slice(0, incorrectCount);
  
  // Create answer options
  const options: AnswerOption[] = [
    { word: { ...word }, correct: true } // Correct answer
  ];
  
  // Add incorrect options by creating words with different pitches
  selectedIncorrect.forEach(pitch => {
    options.push({
      word: { ...word, pitch },
      correct: false
    });
  });
  
  // Shuffle the options
  return options.sort(() => Math.random() - 0.5);
};

// Initialize review session
const initializeReview = (words: Word[]) => {
  if (words.length === 0) {
    isLoading.value = false;
    return;
  }

  // Select 10 random words
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  const selectedWords = shuffled.slice(0, Math.min(10, shuffled.length));
  
  // Generate answer options for each word
  const answerOptions = selectedWords.map(word => 
    generateAnswerOptions(word, words)
  );
  
  reviewState.value = {
    words: selectedWords,
    currentIndex: 0,
    answers: [],
    answerOptions
  };
  
  isLoading.value = false;
  
  // Focus the question component for keyboard input
  nextTick(() => {
    const questionEl = document.querySelector('.review-question') as HTMLElement;
    if (questionEl) {
      questionEl.focus();
    }
  });
};

// Handle answer
const handleAnswer = (index: number) => {
  if (!reviewState.value || !currentWord.value) return;
  
  const selectedOption = currentAnswerOptions.value[index];
  const isCorrect = selectedOption.correct;
  
  reviewState.value.answers.push({
    word: currentWord.value,
    correct: isCorrect
  });
};

// Move to next question
const handleNext = () => {
  if (!reviewState.value) return;
  
  reviewState.value.currentIndex += 1;
  
  // Focus the question component for keyboard input
  nextTick(() => {
    const questionEl = document.querySelector('.review-question') as HTMLElement;
    if (questionEl) {
      questionEl.focus();
    }
  });
};

// Start new session
const handleStartNew = () => {
  isLoading.value = true;
  const { data } = wordStore.getAllWords();
  
  if (data.value?.words) {
    const words = data.value.words as Word[];
    initializeReview(words);
  } else {
    // Wait for data to load
    const unwatch = watch(() => data.value?.words, (words) => {
      if (words) {
        initializeReview(words as Word[]);
        unwatch();
      }
    });
  }
};

// Keyboard handler for global shortcuts
const handleGlobalKeydown = (event: KeyboardEvent) => {
  // Only handle if we're in question mode and question component is focused
  if (isComplete.value || !questionRef.value) return;
  
  // Delegate to question component
  questionRef.value.handleKeydown(event);
};

// Load words and initialize
onMounted(() => {
  const { data, isLoading: wordsLoading } = wordStore.getAllWords();
  
  watchEffect(() => {
    if (!wordsLoading.value && data.value?.words) {
      const words = data.value.words as Word[];
      if (words.length > 0) {
        initializeReview(words);
      } else {
        isLoading.value = false;
      }
    } else {
      isLoading.value = wordsLoading.value;
    }
  });
  
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<template>
  <div class="review-view">
    <div v-if="isLoading" class="loading">
      Loading words...
    </div>
    
    <div v-else-if="reviewState === null || reviewState.words.length === 0" class="no-words">
      <h1>No words available for review</h1>
      <RouterLink to="/" class="action-button">Return to Word List</RouterLink>
    </div>
    
    <ReviewQuestion
      v-else-if="!isComplete && currentWord"
      ref="questionRef"
      :word="currentWord"
      :answer-options="currentAnswerOptions"
      @answer="handleAnswer"
      @next="handleNext"
    />
    
    <ReviewResults
      v-else-if="isComplete"
      :total-questions="reviewState.words.length"
      :correct-answers="correctAnswers"
      :incorrect-words="incorrectWords"
      @start-new="handleStartNew"
    />
  </div>
</template>

<style scoped lang="less">
.review-view {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading,
.no-words {
  text-align: center;
  padding: 2em;

  h1 {
    font-size: 2rem;
    margin-bottom: 1em;
  }
}

.action-button {
  padding: 1em 2em;
  background-color: var(--button-dark, #333);
  color: white;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  font-size: 1.1em;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--button-dark-hover, #555);
  }
}
</style>

