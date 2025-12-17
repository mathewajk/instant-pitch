<script setup lang="ts">
import { ref } from 'vue';
import { id } from '@instantdb/core';
import { useWordStore } from '@/stores/word';

const store = useWordStore();

const tango = ref('');
const yomi = ref('');
const pitch = ref(0);
const source = ref('');
const definition_ja = ref('');
const definition_en = ref('');
const context = ref('');

const handleSubmit = () => {
  store.createWord({
    id: id(),
    tango: tango.value,
    yomi: yomi.value,
    pitch: pitch.value,
    source: source.value,
    definition_jp: definition_ja.value,
    definition_en: definition_en.value,
    context: context.value
  });
  
  // Reset form
  tango.value = '';
  yomi.value = '';
  pitch.value = 0;
  source.value = '';
  definition_ja.value = '';
  definition_en.value = '';
  context.value = '';
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <p>Add a word:</p>
    <div class="form-group">
      <label for="tango">Tango</label>
      <input type="text" v-model="tango" required placeholder="犬" />
    </div>
    <div class="form-group">
      <label for="yomi">Yomi</label>
      <input type="text" v-model="yomi" required placeholder="いぬ" />
    </div>
    <div class="form-group">
      <label for="pitch">Pitch</label>
      <input type="number" v-model="pitch" required placeholder="e.g. 2" />
    </div>
    <div class="form-group">
      <label for="source">Source</label>
      <input type="text" v-model="source" />
    </div>
    <div class="form-group">
      <label for="definition_ja">Definition (JA)</label>
      <input type="text" v-model="definition_ja" />
    </div>
    <div class="form-group">
      <label for="definition_en">Definition (EN)</label>
      <input type="text" v-model="definition_en" />
    </div>
    <div class="form-group">
      <label for="context">Context</label>
      <input type="text" v-model="context" />
    </div>
    <div class="form-group">
      <button type="submit">Add</button>
    </div>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  width: 100px;
  justify-content: center;
}

.form-group > label {
  font-size: 0.8em;
  font-weight: bold;
  position: absolute;
  bottom: -1.5em;
  transform: translateY(-50%);
}

.form-group > input {
  height: 2rem;
  border-radius: 0.5em;
  border: 1px solid #ccc;
  padding: 0.5em;
}
</style>

