<script setup lang="ts">
import type { Word } from '@/stores/word';

defineProps<{
    direction: 'previous' | 'next';
    word: Word | null;
}>();

const emit = defineEmits<{
    click: [];
}>();

const handleClick = () => {
    emit('click');
};
</script>

<template>
    <div v-if="word" class="card-navigation" :class="direction === 'previous' ? 'previous-word' : 'next-word'">
        <span class="sr-only">{{ direction === 'previous' ? 'Previous' : 'Next' }} word: {{ word.tango }}</span>
        <button @click="handleClick">{{ word.tango }}</button>
    </div>
    <div v-else class="card-navigation-placeholder"></div>
</template>

<style scoped lang="less">
.card-navigation {
    flex: 0;
    
    button {
        position: relative;
        height: fit-content;
        width: max-content;

        color: var(--text-dark);
        font-size: 1.2em;
        text-decoration: underline;
        
        background-color: var(--button-dark);
        border-radius: 10px;
        transition: background-color 0.3s ease;

        &::after, &::before {
            height: 20px;
            width: 20px;
            position: absolute;
            transition: background-color 0.3s ease;
        }

        &:hover {
            background-color: var(--button-dark-hover);
            &::after, &::before {
                transition: background-color 0.3s ease;
            }
        }
    }

    &.next-word {
        button {
            padding: 1em 1.5em 1em 1em;
            
            &::after {
                content: url('/src/assets/icons/chevron-right.svg');
                margin-left: 0.5em;
                top: 1.1em;
                right: 0.5em;
            }
        }
    }

    &.previous-word {
        button {
            padding: 1em 1em 1em 1.5em;
            
            &::before {
                content: url('/src/assets/icons/chevron-left.svg');
                margin-right: 0.5em;
                top: 1.1em;
                left: 0.5em;
            }
        }
    }
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
</style>

