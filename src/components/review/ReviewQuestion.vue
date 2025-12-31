<script setup lang="ts">
import { computed, ref } from 'vue';
import PitchQuestion from '@/components/review/PitchQuestion.vue';
import ReadingQuestion from '@/components/review/ReadingQuestion.vue';
import KanjiQuestion from '@/components/review/KanjiQuestion.vue';
import SentenceQuestion from '@/components/review/SentenceQuestion.vue';
import type {
  QuestionType,
  PitchQuestionType,
  ReadingQuestionType,
  KanjiQuestionType,
  SentenceQuestionType,
} from './types';

type AnyQuestion = PitchQuestionType | ReadingQuestionType | KanjiQuestionType | SentenceQuestionType;

const props = defineProps<{
  question: AnyQuestion;
}>();

const emit = defineEmits<{
  answer: [payload: { correct: boolean }];
  next: [];
}>();

const questionComponentRef = ref<any>(null);

const isPitch = computed(() => props.question.type === 'pitch');
const isReading = computed(() => props.question.type === 'reading');
const isKanji = computed(() => props.question.type === 'kanji');
const isSentence = computed(() => props.question.type === 'sentence');

const handleAnswer = (payload: { correct: boolean }) => {
  emit('answer', payload);
};

const handleNext = () => {
  emit('next');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (questionComponentRef.value?.handleKeydown) {
    questionComponentRef.value.handleKeydown(event);
  }
};

defineExpose({ handleKeydown });
</script>

<template>
  <div class="review-question" tabindex="0" @keydown="handleKeydown">
    <PitchQuestion
      v-if="isPitch"
      ref="questionComponentRef"
      :question="question as PitchQuestionType"
      @answer="handleAnswer"
      @next="handleNext"
    />
    <ReadingQuestion
      v-else-if="isReading"
      ref="questionComponentRef"
      :question="question as ReadingQuestionType"
      @answer="handleAnswer"
      @next="handleNext"
    />
    <KanjiQuestion
      v-else-if="isKanji"
      ref="questionComponentRef"
      :question="question as KanjiQuestionType"
      @answer="handleAnswer"
      @next="handleNext"
    />
    <SentenceQuestion
      v-else-if="isSentence"
      ref="questionComponentRef"
      :question="question as SentenceQuestionType"
      @answer="handleAnswer"
      @next="handleNext"
    />
  </div>
</template>

<style scoped lang="less">
.review-question {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

