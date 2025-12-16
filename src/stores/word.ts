import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type Word = {
  tango: string,
  kana: string,
  pitch: number,
  source: string,
  definition_ja: string,
  definition_en: string,
}

export type { Word };

export const useWordStore = defineStore('word', () => {
  const getMorae = (kana: string) => {
    let chars = kana.split('');
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
  const isOdaka = (word: Word) => !isAtamadaka(word) && word.pitch === getMorae(word.kana).length;

  return { getMorae, isHeiban, isAtamadaka, isNakadaka, isOdaka }
})
