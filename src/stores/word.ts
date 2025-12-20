import { ref } from 'vue'
import { defineStore } from 'pinia'

import { init } from "@dorilama/instantdb-vue";
import type { InstaQLParams, InstaQLResult } from "@dorilama/instantdb-vue";
import schema from '../instant.schema.ts';

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;

const wordsQuery = { words: { } } satisfies InstaQLParams<typeof schema>;
type WordsResult = InstaQLResult<typeof schema, typeof wordsQuery>;
export type Word = WordsResult["words"][number];

export const useWordStore = defineStore('word', () => {

  const db = init({ appId: APP_ID, schema });
  const loading = ref(false);

  const startLoading = () => {
    loading.value = true;
  }

  const stopLoading = () => {
    loading.value = false;
  }

  const subscribe = (query: { words: any }) => {
    return db.useQuery(query);
  }

  const createWord = (word: Word) => {
    // @ts-ignore
    db.transact(db.tx.words[word.id].create(word));
  }

  const getMorae = (yomi: string) => {
    let chars = yomi.split('');
    let morae = [];
    let currentMora = chars.shift() as string;

    for(let i in chars) {
        if(['ゃ','ゅ','ょ'].includes(chars[i] as string)) {
            currentMora += chars[i];
        } else {
            morae.push(currentMora);
            currentMora = chars[i] as string;
        }
    }
    morae.push(currentMora);
    return morae;
  }

  const activeWord = ref<Word | null>(null);
  const previousWord = ref<Word | null>(null);
  const nextWord = ref<Word | null>(null);

  const getActiveWord = (tango: string) => {
    const activeWordQuery = { words: { $: { limit: 1, where: { tango: tango } } } };
    return subscribe(activeWordQuery);
  }

  const getAllWords = () => {
    const allWordsQuery = { words: { $: { order: { tango: 'asc' } } } };
    return subscribe(allWordsQuery);
  }

  const sortWords = (words: Word[]) => {
    return [...words].sort((a, b) => {
      if (a.yomi !== b.yomi) {
        return a.yomi.localeCompare(b.yomi);
      }
      return a.tango.localeCompare(b.tango);
    });
  }

  const findPreviousWord = (words: Word[], currentWord: Word): Word | null => {
    if (!words || words.length === 0 || !currentWord) return null;
    
    const sortedWords = sortWords(words);
    const currentIndex = sortedWords.findIndex(w => w.tango === currentWord.tango);
    
    if (currentIndex === -1) return null;
    if (currentIndex === 0) return null; // No previous word
    
    const previousWord = sortedWords[currentIndex - 1];
    return previousWord || null;
  }

  const findNextWord = (words: Word[], currentWord: Word): Word | null => {
    if (!words || words.length === 0 || !currentWord) return null;
    
    const sortedWords = sortWords(words);
    const currentIndex = sortedWords.findIndex(w => w.tango === currentWord.tango);
    
    if (currentIndex === -1) return null;
    if (currentIndex === sortedWords.length - 1) return null; // No next word
    
    const nextWord = sortedWords[currentIndex + 1];
    return nextWord || null;
  }

  const isHeiban = (word: Word) => word.pitch === 0;
  const isAtamadaka = (word: Word) => word.pitch === 1;
  const isNakadaka = (word: Word) => !isHeiban(word) && !isAtamadaka(word) && !isOdaka(word);
  const isOdaka = (word: Word) => !isAtamadaka(word) && word.pitch === getMorae(word.yomi).length;

  return { getMorae, isHeiban, isAtamadaka, isNakadaka, isOdaka, subscribe, createWord, startLoading, stopLoading, getActiveWord, getAllWords, findPreviousWord, findNextWord, loading, activeWord, previousWord, nextWord}
})
