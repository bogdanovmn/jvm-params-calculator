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
                return this.config.parameters.filter(p => p.type === 'slider' && p.key !== 'containerMemoryBufferPercent')
            },
            groupedSliders() {
                const groups = []
                const seen = new Set()
                for (const param of this.sliderParams) {
                    const group = param.group || null
                    if (group && !seen.has(group)) {
                        seen.add(group)
                        groups.push({ title: group, items: this.sliderParams.filter(p => p.group === group) })
                    } else if (!group) {
                        groups.push({ title: null, items: [param] })
                    }
                }
                return groups
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
    <template v-for="(group, gi) in groupedSliders" :key="gi">
        <div v-if="group.title" class="param-group-box">
            <p class="group-title">{{ group.title }}</p>
            <p v-for="param in group.items" :key="param.key">
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
                    :key="preset.id + '-' + param.key"
                />
            </p>
        </div>
        <p v-else v-for="param in group.items" :key="param.key">
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
                :key="preset.id + '-' + param.key"
            />
        </p>
    </template>
</template>

<style src="@vueform/slider/themes/default.css">
</style>

<style scoped>
    p { margin-bottom: 40px; }
    i { color: rgb(102 104 103); font-style: normal; }
    .param-group-box {
        border: 1px solid rgba(110, 231, 183, 0.12);
        border-radius: 12px;
        padding: 16px 20px;
        padding-top: 10px;
        margin-bottom: 30px;
        background: rgba(110, 231, 183, 0.03);
    }
    .param-group-box p:last-child {
        margin-bottom: 0;
    }
    .group-title {
        font-size: 1.15em;
        font-weight: 600;
        color: rgba(110, 231, 183, 0.6);
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 0px solid rgba(110, 231, 183, 0.08);
    }

    @media (prefers-color-scheme: light) {
        i { color: rgb(191, 188, 188); }
        .param-group-box {
            border-color: rgba(5, 150, 105, 0.12);
            background: rgba(5, 150, 105, 0.03);
        }
        .group-title {
            color: rgba(5, 150, 105, 0.6);
            border-bottom-color: rgba(5, 150, 105, 0.08);
        }
    }
</style>
