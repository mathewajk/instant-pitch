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
        <template v-for="(mora, i) in getMorae(yomi)" :key="i">
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
        <span class="sr-only"> - Pitch accent: {{ pitch }}</span>
    </div>
</template>

<style scoped lang="less">
.pitch-display {
    position: relative;
    display: block;
    margin-bottom: 1em;
    font-size: 1.2em;

    .mora {
        position: relative;
        margin: 0.1em;
        color: var(--mora-low);

        &::before, &::after {
            content: "";
            position: absolute;
            top: -0.1em;
        }

        &::before {
            height: 0.2em;
            left: -0.2em;
            width: 1.2em;
        }

        &[data-pitch="low"]::before, &[data-pitch="start"]::before {
            height: 0.2em;
            left: -0.2em;
            width: 1.4em;
            top: 1.5em;
            background-color: var(--mora-low);
        }

        &[data-pitch="start"]::after {
            height: 1.75em;
            width: 0.2em;
            right: -0.2em;
            background-color: var(--mora-low);
        }

        &[data-characters="2"]::before {
            height: 0.2em;
            width: 2.4em;
        }

        &[data-pitch="high"]::before {
            background-color: var(--mora-low);
        }

        &[data-pitch="peak"]::before, &[data-pitch="peak"]::after {
            background-color: var(--mora-peak);
        }

        &[data-pitch="peak"]::after {
            height: 1.75em;
            width: 0.2em;
            left: 1em;
        }

        &[data-pitch="peak"][data-characters="2"]::after {
            left: 2em;
        }

        &[data-pitch="peak"] {
            color: var(--mora-peak);
        }
    }
}
</style>

