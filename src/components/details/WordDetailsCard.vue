<script setup lang="ts">
import PitchDisplay from '../pitch/PitchDisplay.vue';
import { ref } from 'vue';
import type { Word } from '@/stores/word';

defineProps<{
    activeWord: Word | null;
}>();

const showEnglish = ref(false);
</script>

<template>
    <div v-if="activeWord" id="word-details-container" :data-tango="activeWord?.tango">
        <div class="headword-container">
            <h1>{{ activeWord.tango }}</h1>
            <PitchDisplay v-if="activeWord" :yomi="activeWord.yomi" :pitch="activeWord.pitch" />
        </div>
        <div id="word-details">
            <div class="definition-ja">{{ activeWord.definition_ja }}</div>
            <div v-if="showEnglish" class="definition-en">{{ activeWord.definition_en }}</div>
            <div v-else class="card-toggle" @click="showEnglish = true">Show translation</div>
            <div class="context">{{ activeWord.context }}</div>
            <div class="source">Source: {{ activeWord.source }}</div>
        </div>
    </div>
</template>

<style scoped lang="less">
#word-details-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 2em;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    @media (max-width: 1024px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2em;
    }

    .pitch-display {
        margin-bottom: 0;
        font-size: 2em;
    }

    #word-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2em;
    }
    
    .headword-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
        border-right: 1px solid #ccc;
        align-items: center;

        justify-content: center;

        @media (min-width: 1024px) {
            height: 100%;
        }
        
        @media (max-width: 1024px) {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #ccc;
            padding-bottom: 2em;
        }

        h1 {
            margin: 0;
            font-size: 6rem;
            line-height: 1;
            overflow-wrap: break-word;
            hyphens: auto;
        }
    }
}

#word-details .context {
    border-left: 2px solid #ccc;
    padding-left: 1em;
    color: #666;
}

#word-details .source {
    color: #666;
    font-size: 0.8em;
}

#word-details .definition-ja {
    font-size: 1.2em;
}

#word-details .card-toggle {
    text-decoration: underline;
}

#word-details .card-toggle:hover {
    cursor: pointer;
}
</style>

