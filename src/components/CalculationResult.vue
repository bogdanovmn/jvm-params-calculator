<script>
    import Slider from '@vueform/slider'
    import Card from './Card.vue'

    export default {
        components: { Slider, Card },
        props: {
            config: {
                type: Object,
                required: true
            },
            values: {
                type: Object,
                required: true
            },
            preset: {
                type: Object,
                required: true
            },
        },
        emits: ['update:bufferValue'],

        data() {
            return {
                bufferValue: this.values.containerMemoryBufferPercent ?? 0,
                memoryValueFormatPercent: {
                    suffix: " %",
                    decimals: 0
                },
            }
        },

        computed: {
            bufferParam() {
                return this.config.parameters.find(p => p.key === 'containerMemoryBufferPercent')
            },
            containerLimit() {
                return Math.round(this.config.memoryCalc(this.values));
            },
            bufferSliderMin() {
                return typeof this.bufferParam.slider.min === 'function'
                    ? this.bufferParam.slider.min(this.values, this.preset.values)
                    : this.bufferParam.slider.min
            },
            bufferSliderMax() {
                return typeof this.bufferParam.slider.max === 'function'
                    ? this.bufferParam.slider.max(this.values, this.preset.values)
                    : this.bufferParam.slider.max
            },
            jvmOptions() {
                return this.config.parameters
                    .filter(p => p.formatJvm)
                    .map(p => {
                        let val = null
                        if (p.type === 'derived') {
                            val = p.derive(this.values)
                        } else if (p.type !== 'static') {
                            val = this.values[p.key]
                        }
                        const text = p.formatJvm(val)
                        return text ? { text, optional: p.optional || false } : null
                    })
                    .filter(Boolean)
            }
        },
        methods: {
            copyToClipboard() {
                const paramsInline = this.jvmOptions
                    .map(o => o.text.replace(/<[^>]*>/g, ''))
                    .join(' ')
                this.$refs.clipboardBuffer.value = paramsInline
                this.$refs.clipboardBuffer.select()
                document.execCommand("copy")
            },
            onBufferChange(val) {
                this.$emit('update:bufferValue', val)
            },
        },
        watch: {
            values: {
                handler(newVals) {
                    this.bufferValue = newVals.containerMemoryBufferPercent ?? 0
                },
                deep: true
            }
        }
    }
</script>
<template>
    <div>
        <h1>Calculation result</h1>
        <Card v-if="bufferParam" type="result" title="Container memory limit">
            <p class="container-limit">{{containerLimit}} Mb</p>
            <i>{{bufferParam.label}}</i>
            <Slider v-model="bufferValue"
                :min="bufferSliderMin"
                :max="bufferSliderMax"
                :step="bufferParam.slider.step"
                :format="memoryValueFormatPercent"
                :showTooltip="'always'"
                tooltipPosition="bottom"
                :lazy="false"
                @change="onBufferChange"
                :key="preset.id + '-buffer'"
            />
        </Card>
        <p>
            <b>JVM options</b>:
            <span ref="jvmParams">
                <template v-for="(opt, idx) in jvmOptions" :key="idx">
                    <br/><span :class="{ optional: opt.optional }" v-html="opt.text"></span>
                </template>
            </span>
        </p>
        <p>
            <div class="button" @click="copyToClipboard">Copy as a string</div>
        </p>
    </div>
    <textarea class="hidden" ref="clipboardBuffer"/>
</template>

<style src="@vueform/slider/themes/default.css">
</style>

<style scoped>
    p { text-align: left; font-family: monospace;}
    :deep(i) { color: #10b981; font-style: normal;}
    span.optional { color: rgb(102 104 103); }
    div.button { border: 1px solid gray; width: 200px; text-align: center; padding: 5px 10px; border-radius: 15px; cursor: pointer; }
    div.button:hover { border: 1px solid #719488; background: #2e3d38; }
    .hidden { margin-left: -99999px}

    .container-limit {
        text-align: center;
        font-size: 1.6em;
        font-weight: 700;
        color: #fb923c;
        margin-top: 0;
        margin-bottom: 20px;
        font-family: sans-serif;
    }
    i { color: rgb(102 104 103); font-style: normal; }
    :deep(.slider-connect) {
        background: #fb923c;
    }
    :deep(.slider-tooltip) {
        background: #fb923c;
        border-color: #fb923c;
    }
    :deep(.slider-handle) {
        border-color: #fb923c;
    }

    @media (prefers-color-scheme: light) {
        span.optional { color: rgb(191, 188, 188); }
        div.button:hover { border: 1px solid #719488; background: #dbf8ee; }
        .container-limit {
            color: #ea580c;
        }
        .buffer-slider-label i { color: rgb(191, 188, 188); }
        :deep(.slider-connect) {
            background: #ea580c;
        }
        :deep(.slider-tooltip) {
            background: #ea580c;
            border-color: #ea580c;
        }
        :deep(.slider-handle) {
            border-color: #ea580c;
        }
    }
</style>
