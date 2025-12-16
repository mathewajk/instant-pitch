<script setup lang="ts">
import { useWordStore } from '@/stores/word';
import { ref } from 'vue';

const filterByPitch = ref("all");

const { isHeiban, isAtamadaka, isNakadaka, isOdaka } = useWordStore();

const options = {
  all: {
    filter: () => true,
    key: "all",
    label: "Select..."
  },
  heiban: {
    filter: isHeiban,
    key: "heiban",
    label: "平板型"
  },
  atamadaka: {
    filter: isAtamadaka,
    key: "atamadaka",
    label: "頭高型"
  },
  nakadaka: {
    filter: isNakadaka,
    key: "nakadaka",
    label: "中高型"
  },
  odaka: {
    filter: isOdaka,
    key: "odaka",
    label: "尾高型"
  }
}

const emit = defineEmits<{
    (e: 'change', value: Function): void
}>()

</script>

<template>
    <div class="pitch-filter-container">
        <label for="pitch-filter">Filter by pitch:</label>
        <select id="pitch-filter" v-model="filterByPitch" @change="emit('change', options[filterByPitch as keyof typeof options].filter)">
            <option v-for="option in options" :key="option.key" :value="option.key">{{ option.label }}</option>
        </select>
    </div>
</template>

<style scoped>
.pitch-filter-container {
    display: flex;
    flex-direction: row;
    gap: 1em;
    align-self: flex-end;
}
</style>

