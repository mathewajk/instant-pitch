<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="sentence-details card">
    <h2>Sentence</h2>
    <p class="text">{{ text }}</p>
  </div>
</template>

<style scoped lang="less">
.sentence-details {
  padding: 1rem;

  .text {
    font-size: 1.4rem;
    line-height: 1.6;
    margin: 0.5rem 0 0;
    white-space: pre-wrap;
  }
}
</style>

