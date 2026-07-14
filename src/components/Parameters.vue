<script>
    import Slider from '@vueform/slider'

    export default {
        components: { Slider },
        props: {
            config: { type: Object, required: true },
            preset: { type: Object, required: true }
        },
        emits: ['update:values'],
        data() {
            return {
                memoryValueFormat: { 
                    suffix:  " M", 
                    decimals: 0
                },
                memoryValueFormatK: {
                    suffix: " K",
                    decimals: 0
                },
                memoryValueFormatPercent: {
                    suffix: " %",
                    decimals: 0
                },
                countValueFormat: {
                    suffix: "",
                    decimals: 0
                },
                values: { ...this.preset.values },
            }
        },
        computed: {
            sliderParams() {
                return this.config.parameters.filter(p => p.type === 'slider')
            }
        },
        methods: {
            getSliderMin(param) {
                return typeof param.slider.min === 'function'
                    ? param.slider.min(this.values, this.preset.values)
                    : param.slider.min
            },
            getSliderMax(param) {
                return typeof param.slider.max === 'function'
                    ? param.slider.max(this.values, this.preset.values)
                    : param.slider.max
            },
            getFormat(param) {
                switch (param.unit) {
                    case 'K': return this.memoryValueFormatK;
                    case 'M' : return this.memoryValueFormat;
                    case '%' : return this.memoryValueFormatPercent;
                    default: return this.countValueFormat;
                }
            },
            sendUpdate() {
                this.$emit('update:values', { ...this.values })
            }
        },
        watch: { 
            preset(newPreset) {
                this.values = { ...newPreset.values }
                this.sendUpdate()
            }
        }
    }
</script>

<template>
    <h1>JVM parameters</h1>
    <p v-for="param in sliderParams" :key="param.key">
        <i>{{param.label}}</i>
        <Slider v-model="values[param.key]" 
            :min="getSliderMin(param)"
            :max="getSliderMax(param)"
            :step="param.slider.step"
            :format="getFormat(param)"
            :showTooltip="'always'"
            tooltipPosition="bottom"
            :lazy="false"
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
