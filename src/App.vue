<script setup>
    import Presets from './components/Presets.vue'
    import Parameters from './components/Parameters.vue'
    import CalculationResult from './components/CalculationResult.vue'
    import {presetsConfig} from './presetsConfig.js'
</script>

<script>
    export default {
        data() {
            return {
                presets: presetsConfig,
                inputValues: {}
            }
        },
        computed: {
            selectedPresetType() {
                return this.presets.find((p) => p.selected);
            },
            selectedPreset() {
                return this.selectedPresetType
                    .options.find((o) => o.selected);
            },
            resultValues() {
                var values = {
                    ...this.selectedPreset.params,
                    ...this.inputValues
                };
                return values;
            }
        },
        methods: {
            onParametersUpdate(values) {
                this.inputValues = values;
            },
            onPresetSelect(presedId) {
                this.inputValues = {}
                this.selectedPresetType.options.forEach(element => {
                    element.selected = element.id == presedId
                });
            }
        }
    }
</script>

<template>
    <div id="menu">
        <p class="group-title">{{selectedPresetType.name}}</p>
        <Presets :data="selectedPresetType.options"
            @update:preset="onPresetSelect" 
        />
    </div>
    <div id="workbench">
        <div id="parameters">
            <Parameters :preset="selectedPreset"
                @update:values="onParametersUpdate"
            />
        </div>
        <CalculationResult :inputValues="resultValues"/>
    </div>
</template>

<style scoped>
    #menu { float: left; width: 20%; margin-right: 30px; }
    #workbench { float: right; width: 70%;}
    #parameters { margin-bottom: 50px; }

    p.group-title { font-size: 150%; color: #10b981; }
</style>