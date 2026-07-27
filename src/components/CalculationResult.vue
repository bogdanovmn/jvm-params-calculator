<script>
    import Slider from '@vueform/slider'

    export default {
        components: { Slider },
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
        <div class="buffer-card" v-if="bufferParam">
            <p class="buffer-title">Container memory limit</p>
            <p class="container-limit">{{containerLimit}} Mb</p>
            <p class="buffer-slider-label"><i>{{bufferParam.label}}</i></p>
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
        </div>
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

    .buffer-card {
        border: 1px solid rgba(251, 146, 60, 0.15);
        border-radius: 12px;
        padding: 16px 20px;
        padding-top: 10px;
        margin-bottom: 30px;
        background: rgba(251, 146, 60, 0.04);
    }
    .buffer-card p:last-child {
        margin-bottom: 0;
    }
    .buffer-title {
        font-size: 1.15em;
        font-weight: 600;
        color: rgba(251, 146, 60, 0.6);
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 0px solid rgba(251, 146, 60, 0.08);
        font-family: sans-serif;
        text-align: center;
    }
    .container-limit {
        text-align: center;
        font-size: 1.6em;
        font-weight: 700;
        color: #fb923c;
        margin-top: 0;
        margin-bottom: 20px;
        font-family: sans-serif;
    }
    .buffer-slider-label {
        margin-bottom: 8px;
    }
    .buffer-slider-label i { color: rgb(102 104 103); font-style: normal; }
    .buffer-card :deep(.slider-connect) {
        background: #fb923c;
    }
    .buffer-card :deep(.slider-tooltip) {
        background: #fb923c;
        border-color: #fb923c;
    }
    .buffer-card :deep(.slider-handle) {
        border-color: #fb923c;
    }

    @media (prefers-color-scheme: light) {
        span.optional { color: rgb(191, 188, 188); }
        div.button:hover { border: 1px solid #719488; background: #dbf8ee; }
        .buffer-card {
            border-color: rgba(234, 88, 12, 0.15);
            background: rgba(234, 88, 12, 0.04);
        }
        .buffer-title {
            color: rgba(234, 88, 12, 0.6);
            border-bottom-color: rgba(234, 88, 12, 0.08);
        }
        .container-limit {
            color: #ea580c;
        }
        .buffer-slider-label i { color: rgb(191, 188, 188); }
        .buffer-card :deep(.slider-connect) {
            background: #ea580c;
        }
        .buffer-card :deep(.slider-tooltip) {
            background: #ea580c;
            border-color: #ea580c;
        }
        .buffer-card :deep(.slider-handle) {
            border-color: #ea580c;
        }
    }
</style>
