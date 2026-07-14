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
        <p class="buffer-slider" v-if="bufferParam">
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
        </p>
        <p class="resume"><b>Container memory limit</b>: <i><b>{{containerLimit}}</b> Mb</i></p>
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
    p.resume { margin: 50px 0 20px 0; }
    p.buffer-slider { margin-bottom: 40px; text-align: center; font-family: sans-serif; font-size: 0.95em; }
    p.buffer-slider i { color: rgb(102 104 103); font-style: normal; }
    :deep(i) { color: #10b981; font-style: normal;}
    span.optional { color: rgb(102 104 103); }
    div.button { border: 1px solid gray; width: 200px; text-align: center; padding: 5px 10px; border-radius: 15px; cursor: pointer; }
    div.button:hover { border: 1px solid #719488; background: #2e3d38; }
    .hidden { margin-left: -99999px}

    @media (prefers-color-scheme: light) {
        p.buffer-slider i { color: rgb(191, 188, 188); }

        span.optional { color: rgb(191, 188, 188); }
        div.button:hover { border: 1px solid #719488; background: #dbf8ee; }
    }
</style>
