<script>
    export default {
        props: {
            data: {
                type: Object,
                requried: true
            }
        },
        
        data() {
            return {
                currentPresetId: 2
            }
        },

        methods: {
            sendPresetSelected(id) {
                this.currentPresetId = id;
                this.$emit("update:preset", this.currentPresetId)
            }
        }
    }
</script>

<template>
    <div v-for="preset of data" 
        :id="preset.id"
        :class="{ selected : preset.id == this.currentPresetId }"
        @click="sendPresetSelected(preset.id)"
    >
        <h1>{{preset.name}}</h1>
        <p>Heap: <b>{{preset.params.maxHeap}}</b>Mb</p>
    </div>
</template>

<style scoped>
    div { border: 1px solid gray; border-radius: 15px; margin-bottom: 15px; cursor: pointer; }
    div:hover { border: 1px solid #719488; background: #2e3d38; }
    div.selected { border: 2px solid #0b845c; background-color: #10b981}
    h1 { font-size: 150%; }

    @media (prefers-color-scheme: light) {
        div:hover { border: 1px solid #719488; background: #dbf8ee; }
        div.selected { border: 2px solid #0b845c; background-color: #10b981}
    }
</style>