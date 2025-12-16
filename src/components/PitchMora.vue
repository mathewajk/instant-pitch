<script setup lang="ts">
defineProps<{
    pitch: string,
    characters: number | undefined,
    mora: string | undefined,
}>()
</script>

<template>
    <span class="mora" :data-pitch="pitch" :data-characters="characters">
        {{ mora }}
    </span>
</template>