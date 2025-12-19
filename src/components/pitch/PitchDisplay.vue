<script setup lang="ts">
import PitchMora from './PitchMora.vue'
import { useWordStore } from '@/stores/word';

const { getMorae } = useWordStore();

defineProps<{
    yomi: string,
    pitch: number
}>()
</script>

<template>
    <div class="pitch-display" :data-pitch="pitch">
        <template v-for="mora, i in getMorae(yomi)" :key="mora">
            <template v-if="i === 0">
                <PitchMora v-if="pitch === 1" :pitch="'peak'" :characters="mora?.length" :mora="mora" />
                <PitchMora v-else :pitch="'start'" :characters="mora?.length" :mora="mora" />
            </template>
            <template v-else>
                <PitchMora v-if="(pitch == 0 || i < pitch - 1)" :pitch="'high'" :characters="mora?.length" :mora="mora" />
                <PitchMora v-else-if="i === pitch - 1" :pitch="'peak'" :characters="mora?.length" :mora="mora" />
                <PitchMora v-else :pitch="'low'" :characters="mora?.length" :mora="mora" />
            </template>
        </template>
    </div>
</template>

<style scoped>
.pitch-display {
    position: relative;
    display: block;
    margin-bottom: 1em;
    font-family: 'Noto Sans', Arial, sans-serif;
}

.mora {
    position: relative;
    margin: 0.1em;
}

.mora::before, .mora::after {
    content: "";
    position: absolute;
    top: -0.1em;
}

.mora::before {
    height: 0.2em;
    left: -0.2em;
    width: 1.2em;
}

.mora[data-pitch="low"]::before, .mora[data-pitch="start"]::before {
    height: 0.2em;
    left: -0.2em;
    width: 1.4em;
    top: 1.5em;
    background-color: #330D00;
}

.mora[data-pitch="start"]::after {
    height: 1.75em;
    width: 0.2em;
    right: -0.2em;
    background-color: #330D00;
}

.mora[data-characters="2"]::before {
    height: 0.2em;
    width: 2.4em;
}

.mora[data-pitch="high"]::before {
    background-color: #330D00;
}

.mora[data-pitch="peak"]::before, .mora[data-pitch="peak"]::after {
    background-color: orangered;
}

.mora[data-pitch="peak"]::after {
    height: 1.75em;
    width: 0.2em;
    left: 1em;
}

.mora[data-pitch="peak"][data-characters="2"]::after {
    left: 2em;
}

.mora[data-pitch="peak"] {
    color: orangered;
}

@media (prefers-color-scheme: dark) {
    .mora[data-pitch="high"]::before, .mora[data-pitch="start"]::after, 
    .mora[data-pitch="low"]::before, .mora[data-pitch="start"]::before {
        @apply bg-gray-200;
    } 

    button .mora[data-pitch="high"]::before, button .mora[data-pitch="start"]::after, 
    button .mora[data-pitch="low"]::before, button .mora[data-pitch="start"]::before {
        background-color: #330D00;
    } 
}
</style>

