import { ref } from 'vue';
import { defineStore } from 'pinia';
import { init, id } from '@dorilama/instantdb-vue';
import type { InstaQLParams, InstaQLResult } from '@dorilama/instantdb-vue';
import schema from '../instant.schema.ts';
import type { Word } from './word';

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;

const sentencesQuery = { sentences: {} } satisfies InstaQLParams<typeof schema>;
type SentencesResult = InstaQLResult<typeof schema, typeof sentencesQuery>;
export type Sentence = SentencesResult['sentences'][number];

const sentenceWordsQuery = { sentencewords: {} } satisfies InstaQLParams<typeof schema>;
type SentenceWordsResult = InstaQLResult<typeof schema, typeof sentenceWordsQuery>;
export type SentenceWord = SentenceWordsResult['sentencewords'][number];

type SentenceWordInput = {
  tango: string;
  yomi: string;
  gloss?: string;
};

export const useSentenceStore = defineStore('sentence', () => {
  const db = init({ appId: APP_ID, schema });
  const tx = db.tx as any;
  const loading = ref(false);

  const startLoading = () => { loading.value = true; };
  const stopLoading = () => { loading.value = false; };

  const subscribe = (query: { sentences?: any, sentencewords?: any, words?: any }) => {
    return db.useQuery(query);
  };

  const getAllSentences = () => {
    const allQuery = { sentences: { $: { order: { serverCreatedAt: 'desc' } } } };
    return subscribe(allQuery);
  };

  const getSentenceWithWords = (sentenceId: string) => {
    const query = {
      sentences: { $: { limit: 1, where: { id: sentenceId } } },
      sentencewords: { $: { where: { sentence_id: sentenceId }, order: { position: 'asc' } } },
      words: { $: { } },
    };
    return subscribe(query);
  };

  const sanitizeField = (v: any, stripAll = false) => {
    if (typeof v !== 'string') return '';
    return stripAll ? v.replace(/\s+/g, '') : v.trim();
  };

  /**
   * Create sentence and sentencewords. If a tango+yomi combination already exists, reuse it; otherwise create a new word with pitch 0.
   */
  const createSentenceWithWords = async (sentenceText: string, words: SentenceWordInput[], existingWords: Word[] = [], source?: string) => {
    const txs: any[] = [];
    const sentenceId = id();
    const cleanText = sanitizeField(sentenceText, true);

    txs.push(tx.sentences[sentenceId].create({
      text: cleanText,
      created_at: new Date().toISOString(),
      source: sanitizeField(source || '', false),
    }));

    const wordMap = new Map<string, Word>();
    existingWords.forEach(w => wordMap.set(`${w.tango}::${w.yomi}`, w));

    words.forEach((w, index) => {
      const tango = sanitizeField(w.tango, true);
      const yomi = sanitizeField(w.yomi, true);
      const gloss = sanitizeField(w.gloss || '', false);
      if (!tango || !yomi) return;

      const key = `${tango}::${yomi}`;
      let wordId = wordMap.get(key)?.id;
      if (!wordId) {
        wordId = id();
        const newWord: Partial<Word> = {
          id: wordId,
          tango,
          yomi,
          source: '',
          definition_ja: '',
          definition_en: '',
          context: '',
        };
        txs.push(tx.words[wordId].create(newWord as any));
        wordMap.set(key, newWord as Word);
      }

      const swId = id();
      const finalWordId = wordId as string;
      txs.push(tx.sentencewords[swId].create({
        sentence_id: sentenceId,
        word_id: finalWordId,
        position: index,
        gloss,
      }));
    });

    await db.transact(txs);
    return sentenceId;
  };

  return { subscribe, getAllSentences, getSentenceWithWords, createSentenceWithWords, startLoading, stopLoading, loading };
});

