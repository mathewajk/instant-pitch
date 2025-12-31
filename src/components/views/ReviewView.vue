<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect, watch, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import ReviewQuestion from '../review/ReviewQuestion.vue';
import ReviewResults from '../review/ReviewResults.vue';
import { useWordStore } from '@/stores/word';
import { useSentenceStore } from '@/stores/sentence';
import type { Word } from '@/stores/word';
import type { Sentence, SentenceWord } from '@/stores/sentence';
import type {
  AnswerOption,
  QuestionType,
  SentenceQuestionType,
  PitchQuestionType,
  ReadingQuestionType,
  KanjiQuestionType,
} from '@/components/review/types';

const wordStore = useWordStore();
const sentenceStore = useSentenceStore();

type Question = PitchQuestionType | ReadingQuestionType | KanjiQuestionType | SentenceQuestionType;

type ReviewState = {
  questions: Question[];
  currentIndex: number;
  answers: { word?: Word; sentenceId?: string; type: QuestionType; correct: boolean }[];
};

const reviewState = ref<ReviewState | null>(null);
const questionRef = ref<InstanceType<typeof ReviewQuestion> | null>(null);
const isLoading = ref(true);

const currentQuestion = computed(() =>
  reviewState.value?.questions[reviewState.value.currentIndex] || null
);

const isComplete = computed(() =>
  reviewState.value !== null &&
  reviewState.value.currentIndex >= reviewState.value.questions.length
);

const correctAnswers = computed(() =>
  reviewState.value?.answers.filter(a => a.correct).length || 0
);

const incorrectWords = computed(() => {
  const map = new Map<string, Word>();
  reviewState.value?.answers
    .filter(a => !a.correct && a.word)
    .forEach(a => {
      if (a.word && !map.has(a.word.id)) {
        map.set(a.word.id, a.word);
      }
    });
  return Array.from(map.values());
});

const incorrectSentences = computed(() => {
  const map = new Map<string, { id: string; text: string }>();
  reviewState.value?.answers
    .filter(a => !a.correct && a.sentenceId)
    .forEach(a => {
      const sentence = allSentencesMap.value.get(a.sentenceId!);
      if (sentence && !map.has(sentence.id)) {
        map.set(sentence.id, { id: sentence.id, text: sentence.text });
      }
    });
  return Array.from(map.values());
});

const { data: sentenceData, isLoading: sentencesLoading } = sentenceStore.getAllSentencesWithWords();
const allSentencesMap = computed(() => {
  const map = new Map<string, Sentence>();
  (sentenceData.value?.sentences as Sentence[] | undefined)?.forEach(s => map.set(s.id, s));
  return map;
});

// Generate answer options for a word (pitch question)
const generatePitchOptions = (word: Word): AnswerOption[] => {
  const moraeCount = wordStore.getMorae(word.yomi).length;
  const correctPitch = word.pitch;

  // Generate all possible pitches (0 to moraeCount inclusive)
  const possiblePitches = Array.from({ length: moraeCount + 1 }, (_, i) => i);

  const targetOptions = Math.min(4, possiblePitches.length);
  const incorrectCount = targetOptions - 1; // subtract 1 for the correct answer

  const incorrectPitches = possiblePitches.filter(p => p !== correctPitch);
  const shuffledIncorrect = [...incorrectPitches].sort(() => Math.random() - 0.5);
  const selectedIncorrect = shuffledIncorrect.slice(0, incorrectCount);

  const options: AnswerOption[] = [
    { word: { ...word }, correct: true }
  ];

  selectedIncorrect.forEach(pitch => {
    options.push({ word: { ...word, pitch }, correct: false });
  });

  return options.sort(() => Math.random() - 0.5);
};

// Build word questions (pitch, reading, kanji) and shuffle
const buildWordQuestions = (words: Word[]): Question[] => {
  const questions: Question[] = [];

  words.forEach(word => {
    const hasPitch = typeof word.pitch === 'number' && !Number.isNaN(word.pitch);
    if (hasPitch) {
      questions.push({ type: 'pitch', word, answerOptions: generatePitchOptions(word) } as PitchQuestionType);
    }
    questions.push({ type: 'reading', word } as ReadingQuestionType);
    questions.push({ type: 'kanji', word } as KanjiQuestionType);
  });

  return questions.sort(() => Math.random() - 0.5);
};

const buildSentenceQuestions = (
  sentences: Sentence[],
  sentencewords: SentenceWord[],
  words: Word[]
): SentenceQuestionType[] => {
  const questions: SentenceQuestionType[] = [];
  const wordMap = new Map<string, Word>();
  words.forEach(w => wordMap.set(w.id, w));

  const sentencesWithWords = sentences.filter(s =>
    sentencewords.some(sw => sw.sentence_id === s.id)
  );

  const shuffledSentences = [...sentencesWithWords].sort(() => Math.random() - 0.5).slice(0, 2);

  shuffledSentences.forEach(sentence => {
    const sws = sentencewords
      .filter(sw => sw.sentence_id === sentence.id)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const tokens = sws
      .map(sw => {
        const w = wordMap.get(sw.word_id);
        if (!w) return null;
        return {
          position: sw.position ?? 0,
          word_id: sw.word_id,
          tango: w.tango,
          yomi: w.yomi,
          gloss: sw.gloss,
        };
      })
      .filter(Boolean) as SentenceQuestionType['words'];

    tokens.forEach((_, idx) => {
      questions.push({
        type: 'sentence',
        sentence_id: sentence.id,
        sentence_text: sentence.text,
        blankIndex: idx,
        words: tokens,
      });
    });
  });

  return questions;
};

// Initialize review session
const initializeReview = (words: Word[], sentences: Sentence[], sentencewords: SentenceWord[]) => {
  if (words.length === 0 && sentences.length === 0) {
    isLoading.value = false;
    return;
  }

  const shuffledWords = [...words].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, Math.min(5, shuffledWords.length));
  const wordQuestions = buildWordQuestions(selectedWords);

  const sentenceQuestions = buildSentenceQuestions(
    sentences,
    sentencewords,
    words
  );

  const allQuestions = [...wordQuestions, ...sentenceQuestions].sort(() => Math.random() - 0.5);

  reviewState.value = {
    questions: allQuestions,
    currentIndex: 0,
    answers: [],
  };

  isLoading.value = false;

  // Focus for keyboard input
  nextTick(() => {
    const questionEl = document.querySelector('.review-question') as HTMLElement;
    if (questionEl) {
      questionEl.focus();
    }
  });
};

// Handle answer
const handleAnswer = (payload: { correct: boolean; sentence_id?: string }) => {
  if (!reviewState.value || !currentQuestion.value) return;

  const alreadyAnswered = reviewState.value.answers.length > reviewState.value.currentIndex;
  if (alreadyAnswered) return;

  if (currentQuestion.value.type === 'sentence') {
    reviewState.value.answers.push({
      sentenceId: payload.sentence_id || (currentQuestion.value as any).sentence_id,
      type: currentQuestion.value.type,
      correct: payload.correct,
    });
  } else {
    reviewState.value.answers.push({
      word: (currentQuestion.value as any).word,
      type: currentQuestion.value.type,
      correct: payload.correct,
    });
  }
};

// Move to next question
const handleNext = () => {
  if (!reviewState.value) return;

  reviewState.value.currentIndex += 1;

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
  const { data: newWordsData } = wordStore.getAllWords();
  const { data: newSentenceData } = sentenceStore.getAllSentencesWithWords();

  const readyInit = () => {
    const words = (newWordsData.value?.words as Word[] | undefined) || [];
    const sentences = (newSentenceData.value?.sentences as Sentence[] | undefined) || [];
    const sws = (newSentenceData.value?.sentencewords as SentenceWord[] | undefined) || [];
    initializeReview(words, sentences, sws);
  };

  if (newWordsData.value?.words && newSentenceData.value?.sentences) {
    readyInit();
  } else {
    const unwatch = watch(
      () => [newWordsData.value?.words, newSentenceData.value?.sentences],
      (vals) => {
        const [w, s] = vals;
        if (w && s) {
          readyInit();
          unwatch();
        }
      }
    );
  }
};

// Keyboard handler for global shortcuts
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (isComplete.value || !questionRef.value) return;
  questionRef.value.handleKeydown(event);
};

const { data: wordsData, isLoading: wordsLoading } = wordStore.getAllWords();

const sentencesList = computed(() => (sentenceData.value?.sentences as Sentence[] | undefined) || []);
const sentenceWordsList = computed(() => (sentenceData.value?.sentencewords as SentenceWord[] | undefined) || []);
const wordsList = computed(() => (wordsData.value?.words as Word[] | undefined) || []);

// Load words and sentences and initialize
onMounted(() => {
  watchEffect(() => {
    const ready =
      !wordsLoading.value &&
      !sentencesLoading.value &&
      wordsList.value &&
      sentencesList.value;

    if (!ready) {
      isLoading.value = wordsLoading.value || sentencesLoading.value;
      return;
    }

    initializeReview(wordsList.value || [], sentencesList.value || [], sentenceWordsList.value || []);
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
    
    <div v-else-if="reviewState === null || reviewState.questions.length === 0" class="no-words">
      <h1>No words available for review</h1>
      <RouterLink to="/" class="action-button">Return to Word List</RouterLink>
    </div>
    
    <ReviewQuestion
      v-else-if="!isComplete && currentQuestion"
      ref="questionRef"
      :question="currentQuestion"
      @answer="handleAnswer"
      @next="handleNext"
    />
    
    <ReviewResults
      v-else-if="isComplete"
      :total-questions="reviewState.questions.length"
      :correct-answers="correctAnswers"
      :incorrect-words="incorrectWords"
      :incorrect-sentences="incorrectSentences"
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

