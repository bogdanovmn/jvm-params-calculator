<script>
    export default {
        props: {
            configs: {
                type: Array,
                required: true
            },
            activeId: {
                type: String,
                required: true
            }
        },
        emits: ['select'],
    }
</script>

<template>
    <div v-for="config of configs"
        :key="config.id"
        :class="{ selected : config.id === activeId }"
        class="config-item"
        @click="$emit('select', config.id)"
    >
        <h1>{{config.name}}</h1>
    </div>
</template>

<style scoped>
    .config-item {
        border: 1px solid gray;
        border-radius: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        padding: 5px 10px;
    }
    .config-item:hover {
        border: 1px solid #719488;
        background: #2e3d38;
    }
    .config-item.selected {
        border: 2px solid #0b845c;
        background-color: #10b981;
    }
    h1 { font-size: 1.1em; margin: 5px 0; }

    @media (prefers-color-scheme: light) {
        .config-item:hover {
            border: 1px solid #719488;
            background: #dbf8ee;
        }
        .config-item.selected {
            border: 2px solid #0b845c;
            background-color: #10b981;
        }
    }
</style>
