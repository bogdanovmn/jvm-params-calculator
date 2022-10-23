<script>
    import Slider from '@vueform/slider'

    export default {
        components: { Slider },
        props: {
            preset: { type: Object, required: true }
        },
        data() {
            return {
                memoryValueFormat: { 
                    suffix:  " M", 
                    decimals: 0
                },
                input: {
                    maxHeap: this.preset.params.maxHeap,
                    maxNursery: this.preset.params.maxNursery,
                    maxDirectMemory: this.preset.params.maxDirectMemory,
                    maxJitCodeCache: this.preset.params.maxJitCodeCache,
                    maxJitDataCache: this.preset.params.maxJitDataCache,
                    maxClassStorage: this.preset.params.maxClassStorage,
                },
                slider: {
                    heap: {
                        min: this.preset.params.maxHeap / 2,
                        max: this.preset.params.maxHeap * 3
                    }
                }
            }
        },
        methods: {
            sendUpdate() {
                this.$emit("update:values", this.input)
            }
        },
        watch: { 
            preset(newPreset) {
                console.log(`changing preset: ${newPreset.name}`);
                var maxHeap = newPreset.params.maxHeap;
                this.input.maxHeap = maxHeap;
                this.input.maxNursery = newPreset.params.maxNursery;
                this.input.maxDirectMemory = this.preset.params.maxDirectMemory;
                this.input.maxJitCodeCache = this.preset.params.maxJitCodeCache;
                this.input.maxJitDataCache = this.preset.params.maxJitDataCache;
                this.input.maxClassStorage = this.preset.params.maxClassStorage;
                console.log(`heap = ${this.input.maxHeap} nursery = ${this.input.maxNursery}`);
                this.slider.heap = {
                    min: maxHeap / 2,
                    max: maxHeap * 3
                }
            }
        }
    }
</script>

<template>
    <h1>JVM parameters</h1>
    <p>
        <i>Max</i> heap
        <Slider v-model="input.maxHeap" 
            :min="slider.heap.min" 
            :max="slider.heap.max" 
            :step="16"
            :format="memoryValueFormat"
            :showTooltip="'always'"
            tooltipPosition="bottom"
            :lazy="false"
            @change="sendUpdate"
        />
    </p>
    <p>
        <i>Max</i> nursery
        <Slider v-model="input.maxNursery"
            :min="16"
            :max="input.maxHeap * 0.5"
            :step="8" 
            :format="memoryValueFormat"
            :lazy="false"
            :showTooltip="'always'"
            tooltipPosition="bottom"
            @change="sendUpdate"
        />
    </p>
    <p>
        <i>Max</i> direct memory <i>(non-heap)</i>
        <Slider v-model="input.maxDirectMemory"
            :min="16"
            :max="slider.heap.max"
            :step="16" 
            :format="memoryValueFormat"
            :lazy="false"
            :showTooltip="'always'"
            tooltipPosition="bottom"
            @change="sendUpdate"
        />
    </p>
    <p>
        <i>Max</i> JIT code cache <i>(non-heap)</i>
        <Slider v-model="input.maxJitCodeCache"
            :min="16"
            :max="384"
            :step="8" 
            :format="memoryValueFormat"
            :lazy="false"
            :showTooltip="'always'"
            tooltipPosition="bottom"
            @change="sendUpdate"
        />
    </p>
    <p>
        <i>Max</i> JIT data cache <i>(non-heap)</i>
        <Slider v-model="input.maxJitDataCache"
            :min="16"
            :max="256"
            :step="8" 
            :format="memoryValueFormat"
            :lazy="false"
            :showTooltip="'always'"
            tooltipPosition="bottom"
            @change="sendUpdate"
        />
    </p>
    <p>
        <i>Max</i> class storage <i>(non-heap)</i>
        <Slider v-model="input.maxClassStorage"
            :min="16"
            :max="256"
            :step="8" 
            :format="memoryValueFormat"
            :lazy="false"
            :showTooltip="'always'"
            tooltipPosition="bottom"
            @change="sendUpdate"
        />
    </p>
</template>

<style src="@vueform/slider/themes/default.css">
</style>

<style scoped>
    p { margin-bottom: 40px; }
    i { color: rgb(102 104 103); font-style: normal; }

    @media (prefers-color-scheme: light) {
        i { color: rgb(191, 188, 188); }
    }
</style>
