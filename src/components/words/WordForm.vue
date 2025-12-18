<script setup lang="ts">
import { ref } from 'vue';
import { id } from '@instantdb/core';
import { VueFinalModal } from 'vue-final-modal'

import { useWordStore } from '@/stores/word';
import type { Word } from '@/stores/word';
const store = useWordStore();

const emptyWord = {
  id: id(),
  tango: '',
  yomi: '',
  pitch: 0,
  source: '',
  definition_jp: '',
  definition_en: '',
  context: ''
};

const newWord = ref<Word>(emptyWord);
const formErrors = ref<{ field: string, message: string }[]>([]);

const validateForm = () => {
  formErrors.value = [];
  if (newWord.value.tango.length === 0) {
    formErrors.value.push({ field: 'tango', message: 'Word (kanji) is required' });
  }
  if (newWord.value.yomi.length === 0) {
    formErrors.value.push({ field: 'yomi', message: 'Word (kana) is required' });
  }
  if (newWord.value.pitch > 0 && newWord.value.pitch > newWord.value.yomi.length) {
    formErrors.value.push({ field: 'pitch', message: 'Pitch value cannot exceed length' });
  }
}

const getErrorMessage = (field: string) => {
  return formErrors.value.find(error => error.field === field)?.message;
}

const handleSubmit = () => {
  validateForm();
  if (formErrors.value.length > 0) {
    return;
  }
  store.createWord({
    id: id(),
    tango: newWord.value.tango,
    yomi: newWord.value.yomi,
    pitch: newWord.value.pitch,
    source: newWord.value.source,
    definition_jp: newWord.value.definition_jp,
    definition_en: newWord.value.definition_en,
    context: newWord.value.context
  });
  
  // Reset form
  newWord.value = {...emptyWord}
};

</script>

<template>
  <VueFinalModal class="modal-container"
      content-class="modal-content card"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade">
  <a href="#" class="modal-close-button" @click="$emit('close')">
    <img src="/src/assets/icons/xmark.svg" alt="Close" />
  </a>
  <form @submit.prevent="handleSubmit">
    <h1>Add Word</h1>
    <div class="form-container">
      <div class="form-row">
        <div class="form-group">
          <label for="tango" class="required">Word (kanji)</label>
          <input type="text" v-model="newWord.tango" placeholder="犬" />
          <div class="form-error" v-if="getErrorMessage('tango')">
            {{ getErrorMessage('tango') }}
          </div>
        </div>
        <div class="form-group">
          <label for="yomi" class="required">Word (kana)</label>
          <input type="text" v-model="newWord.yomi" placeholder="いぬ" />
          <div class="form-error" v-if="getErrorMessage('yomi')">
            {{ getErrorMessage('yomi') }}
          </div>
        </div>
        <div class="form-group">
          <label for="pitch" class="required">Pitch</label>
          <input type="number" v-model="newWord.pitch" placeholder="e.g. 2" />
          <div class="form-error" v-if="getErrorMessage('pitch')">
            {{ getErrorMessage('pitch') }}
          </div>
        </div>
        <div class="form-group">
          <label for="source">Source</label>
            <input type="text" v-model="newWord.source" placeholder="e.g. 'FFXIV'"/>
            <div class="form-error" v-if="getErrorMessage('source')">
            {{ getErrorMessage('source') }}
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="definition_ja">Definition (JA)</label>
        <textarea v-model="newWord.definition_jp" rows="3"/>
        <div class="form-error" v-if="getErrorMessage('definition_jp')">
          {{ getErrorMessage('definition_jp') }}
        </div>
      </div>
      <div class="form-group">
        <label for="definition_en">Definition (EN)</label>
        <textarea type="text" v-model="newWord.definition_en" rows="3"/>
        <div class="form-error" v-if="getErrorMessage('definition_en')">
          {{ getErrorMessage('definition_en') }}
        </div>
      </div>
      <div class="form-group">
        <label for="context">Context</label>
        <textarea v-model="newWord.context" rows="3"/>
        <div class="form-error" v-if="getErrorMessage('context')">
          {{ getErrorMessage('context') }}
        </div>
      </div>
      <div class="form-group">
        <button type="submit">Add</button>
      </div>
    </div>
  </form>
  </VueFinalModal>
</template>

<style scoped>
.modal-close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1em 1em;
  background-color: transparent;
}

.modal-close-button:hover {
  cursor: pointer;
}

.modal-close-button img {
  width: 1.5em;
  height: 1.5em;
  filter: brightness(0) invert(0.25);
  transition: filter 0.2s;
}
.modal-close-button:hover img {
  transition: filter 0.2s;
  filter: brightness(1) invert(0);
} 

button {
  background-color: var(--button-dark);
  color: var(--text-dark);
  padding: 1em 2em;
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--button-dark-hover);
  cursor: pointer;
  transition: background-color 0.2s;
}

form {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  padding: 0em 2em 1em 2em;
}

.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  justify-content: center;
  padding: 0.5em;
}

.form-group > label {
  font-weight: bold;
}

.form-group > input {
  height: 2em;
  border-radius: 0.5em;
  border: 1px solid #ccc;
  padding: 0.5em;
}

.form-group > input[type="text"] {
  width: 10em;
}
.form-group > input[type="number"] {
  width: 5em;
}

.form-group > textarea {
  width: 100%;
  border-radius: 0.5em;
  border: 1px solid #ccc;
  padding: 0.5em;
}

.form-error {
  color: red;
  font-size: 0.8em;
  margin: 0;
}

.required::after {
  content: '*';
  color: red;
  margin-left: 0.25em;
}

.form-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1em;
}

.form-row > .form-group {
  flex: 1;
}

</style>

