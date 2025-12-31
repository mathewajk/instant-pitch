<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSentenceStore } from '@/stores/sentence';
import { useWordStore } from '@/stores/word';
import { useUserStore } from '@/stores/user';
import { id as makeId } from '@instantdb/core';
import type { Word } from '@/stores/word';

type ParsedWord = {
  id: string;
  tango: string;
  yomi: string;
  gloss: string;
};

const sentenceStore = useSentenceStore();
const wordStore = useWordStore();
const userStore = useUserStore();
const router = useRouter();

const rawSentence = ref('');
const sentenceSource = ref('');
const sentenceText = ref('');
const step = ref<'sentence' | 'words'>('sentence');
const parsedWords = ref<ParsedWord[]>([]);
const error = ref('');

const { data: allWordsData } = wordStore.getAllWords();

const sanitize = (val: string, stripAll = false) => {
  if (!val) return '';
  return stripAll ? val.replace(/\s+/g, '') : val.trim();
};

const parseWithBrackets = (text: string) => {
  const matches = [...text.matchAll(/{(.*?)}/g)];
  if (!matches.length) return null;
  const words = matches
    .map((m, index) => sanitize(m[1] || '', true))
    .filter(Boolean)
    .map((w, index) => ({
      id: makeId(),
      tango: w,
      yomi: '',
      gloss: '',
    }));
  const cleaned = text.replace(/{\s*/g, '').replace(/\s*}/g, '');
  return { words, text: cleaned };
};

const parseSentence = () => {
  error.value = '';
  const trimmed = sanitize(rawSentence.value);
  if (!trimmed) {
    error.value = 'Sentence is required.';
    return;
  }

  let words: ParsedWord[] = [];
  let textForDb = '';
  const bracketResult = parseWithBrackets(trimmed);
  if (bracketResult) {
    words = bracketResult.words;
    textForDb = sanitize(bracketResult.text, true);
  } else {
    // fallback: split by whitespace; if none, treat whole as one word
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    const effective = tokens.length ? tokens : [trimmed];
    words = effective.map((w) => ({
      id: makeId(),
      tango: sanitize(w, true),
      yomi: '',
      gloss: '',
    }));
    textForDb = sanitize(trimmed.replace(/\s+/g, ''), true);
  }

  parsedWords.value = words;
  sentenceText.value = textForDb;
  step.value = 'words';
};

const addWordAfter = (index: number) => {
  parsedWords.value.splice(index + 1, 0, {
    id: makeId(),
    tango: '',
    yomi: '',
    gloss: '',
  });
};

const removeWord = (index: number) => {
  parsedWords.value.splice(index, 1);
};

const existingWords = computed(() => (allWordsData?.value?.words as Word[]) || []);

const submitSentence = async () => {
  const cleanedWords = parsedWords.value
    .map((w) => ({
      ...w,
      tango: sanitize(w.tango, true),
      yomi: sanitize(w.yomi, true),
      gloss: sanitize(w.gloss, false),
    }))
    .filter((w) => w.tango && w.yomi);

  if (!sentenceText.value || !cleanedWords.length) {
    error.value = 'Sentence and at least one word are required.';
    return;
  }

  const sentenceId = await sentenceStore.createSentenceWithWords(
    sentenceText.value,
    cleanedWords,
    existingWords.value,
    sanitize(sentenceSource.value, false),
  );
  router.push(`/sentence/${sentenceId}`);
};
</script>

<template>
  <div class="sentence-form card">
    <h2>Add Sentence</h2>
    <p class="hint">Admins only. All whitespace is stripped on save. Use {{ "{" }}word{{ "}" }} to mark words.</p>

    <div v-if="error" class="error">{{ error }}</div>

    <template v-if="step === 'sentence'">
      <form @submit.prevent="parseSentence">
        <label for="sentence">Sentence</label>
        <textarea
          id="sentence"
          v-model="rawSentence"
          rows="3"
          placeholder="吾輩は猫である or {吾輩}{は}{猫}{で}{ある}"
        />
        <label for="source">Source (optional)</label>
        <input
          id="source"
          type="text"
          v-model="sentenceSource"
          placeholder="Source"
        />
        <div class="actions">
          <button type="submit">Next</button>
        </div>
      </form>
    </template>

    <template v-else>
      <div class="words-grid">
        <div v-for="(word, index) in parsedWords" :key="word.id" class="word-row">
          <div class="field">
            <label>Word {{ index + 1 }}</label>
            <input type="text" v-model="word.tango" placeholder="単語" />
          </div>
          <div class="field">
            <label>Reading</label>
            <input type="text" v-model="word.yomi" placeholder="よみ" />
          </div>
          <div class="field">
            <label>Gloss</label>
            <input type="text" v-model="word.gloss" placeholder="Gloss" />
          </div>
          <div class="row-actions">
            <button type="button" @click="addWordAfter(index)">Add after</button>
            <button type="button" @click="removeWord(index)" :disabled="parsedWords.length === 1">Remove</button>
          </div>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="secondary" @click="step = 'sentence'">Back</button>
        <button type="button" @click="submitSentence" :disabled="parsedWords.length === 0">Save Sentence</button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.sentence-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .hint {
    color: #666;
    font-size: 0.9rem;
  }

  .error {
    color: #c0392b;
    font-weight: 600;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    textarea {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      padding: 0.75rem;
      font-size: 1rem;
    }
  }

  .words-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .word-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr) 160px;
    gap: 0.75rem;
    align-items: end;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      input {
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        padding: 0.5rem;
      }
    }

    .row-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  button {
    background-color: var(--button-dark, #333);
    color: var(--text-dark, #fff);
    border: none;
    border-radius: 0.5rem;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--button-dark-hover, #555);
    }

    &.secondary {
      background-color: #777;
    }

    &:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
  }
}
</style>

