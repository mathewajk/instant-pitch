import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { init, id, type InstaQLEntity } from '@instantdb/core';
import schema from '../instant.schema.ts';

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;

type Word = InstaQLEntity<typeof schema, "words">;
export type { Word };

export const useWordStore = defineStore('word', () => {

    const db = init({ appId: APP_ID, schema });
  
    const error = ref('')
    const words = ref(<Word[]>[])
    const loading = ref(false);

    const startLoading = () => {
      loading.value = true;
    }

    const stopLoading = () => {
      loading.value = false;
    }

    const subscribeWords = (query: { words: any }) => {
      db.subscribeQuery(query, (resp) => {
        if (resp.error) {
          stopLoading();
          error.value = resp.error.message;
        }
        if (resp.data) {
          stopLoading();
          words.value = resp.data.words as Word[];
          console.log(words.value);
        }
      });
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

  const isHeiban = (word: Word) => word.pitch === 0;
  const isAtamadaka = (word: Word) => word.pitch === 1;
  const isNakadaka = (word: Word) => !isHeiban(word) && !isAtamadaka(word) && !isOdaka(word);
  const isOdaka = (word: Word) => !isAtamadaka(word) && word.pitch === getMorae(word.yomi).length;

  return { getMorae, isHeiban, isAtamadaka, isNakadaka, isOdaka, subscribeWords, createWord, startLoading, stopLoading, words, error, loading}
})
