import type { Word } from '@/stores/word';

export type QuestionType = 'pitch' | 'reading' | 'kanji' | 'sentence';

export type AnswerOption = { word: Word; correct: boolean };

export type BaseQuestion = {
  word: Word;
  type: QuestionType;
  answerOptions?: AnswerOption[];
};

export type PitchQuestionType = {
  word: Word;
  type: 'pitch';
  answerOptions: AnswerOption[];
};

export type ReadingQuestionType = {
  word: Word;
  type: 'reading';
};

export type KanjiQuestionType = {
  word: Word;
  type: 'kanji';
};

export type SentenceClozeWord = {
  position: number;
  word_id: string;
  tango: string;
  yomi: string;
  gloss?: string;
};

export type SentenceQuestionType = {
  sentence_id: string;
  sentence_text: string;
  type: 'sentence';
  blankIndex: number;
  words: SentenceClozeWord[];
};


