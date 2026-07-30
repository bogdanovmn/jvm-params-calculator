<script>
    export default {
        props: {
            presets: {
                type: Array,
                required: true
            },
            activeId: {
                type: Number,
                required: true
            }
        },
        emits: ['select'],
    }
</script>

<template>
    <div class="presets-row">
        <div v-for="preset of presets"
            :key="preset.id"
            :class="{ selected : preset.id === activeId }"
            class="preset-tab"
            @click="$emit('select', preset.id)"
        >
            {{preset.name}}
        </div>
    </div>
</template>

<style scoped>
    .presets-row {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .preset-tab {
        border: 1px solid gray;
        border-radius: 15px;
        cursor: pointer;
        padding: 5px 10px;
    }
    .preset-tab:hover {
        border: 1px solid #719488;
        background: #2e3d38;
    }
    .preset-tab.selected {
        border: 2px solid #0b845c;
        background-color: #10b981;
    }

    @media (prefers-color-scheme: light) {
        .preset-tab:hover {
            border: 1px solid #719488;
            background: #dbf8ee;
        }
        .preset-tab.selected {
            border: 2px solid #0b845c;
            background-color: #10b981;
        }
    }
</style>
