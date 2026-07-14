<script setup>
    import ConfigSelector from './components/ConfigSelector.vue'
    import Presets from './components/Presets.vue'
    import Parameters from './components/Parameters.vue'
    import CalculationResult from './components/CalculationResult.vue'
    import {configs} from './configs.js'
</script>

<script>
    export default {
        data() {
            return {
                configs: configs,
                activeConfigId: configs[0].id,
                activePresetId: configs[0].presets[0].id,
                inputValues: {}
            }
        },
        computed: {
            activeConfig() {
                return this.configs.find(c => c.id === this.activeConfigId)
            },
            activePreset() {
                return this.activeConfig.presets.find(p => p.id === this.activePresetId)
            },
            resultValues() {
                return { ...this.activePreset.values, ...this.inputValues }
            }
        },
        methods: {
            onConfigSelect(id) {
                this.activeConfigId = id
                this.activePresetId = this.activeConfig.presets[0].id
                this.inputValues = {}
            },
            onPresetSelect(id) {
                this.activePresetId = id
                this.inputValues = {}
            },
            onParametersUpdate(values) {
                const { containerMemoryBufferPercent, ...rest } = values
                this.inputValues = this.inputValues.containerMemoryBufferPercent !== undefined
                    ? { ...rest, containerMemoryBufferPercent: this.inputValues.containerMemoryBufferPercent }
                    : values
            },
            onBufferValueUpdate(val) {
                this.inputValues = { ...this.inputValues, containerMemoryBufferPercent: val }
            }
        }
    }
</script>

<template>
    <div id="sidebar">
        <p class="section-title">JVM type</p>
        <ConfigSelector :configs="configs" :activeId="activeConfigId"
            @select="onConfigSelect" />
    </div>
    <div id="workbench">
        <Presets :presets="activeConfig.presets" :activeId="activePresetId"
            @select="onPresetSelect" />
        <div id="parameters">
            <Parameters :config="activeConfig" :preset="activePreset"
                @update:values="onParametersUpdate" />
        </div>
        <CalculationResult :config="activeConfig" :values="resultValues" :preset="activePreset"
            @update:bufferValue="onBufferValueUpdate"/>
    </div>
</template>

<style scoped>
    #sidebar { float: left; width: 20%; margin-right: 30px; }
    #workbench { float: right; width: 70%;}
    #parameters { margin-bottom: 50px; }

    p.section-title { font-size: 150%; color: #10b981; }
</style>
