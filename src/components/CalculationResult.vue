<script>
    export default {
        props: {
            config: {
                type: Object,
                required: true
            },
            values: {
                type: Object,
                required: true
            },
        },

        computed: {
            containerLimit() {
                return this.config.memoryCalc(this.values)
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
            }
        }
    }
</script>
<template>
    <div>
        <h1>Calculation result</h1>
        <p><b>Container memory limit</b>: <i><b>{{containerLimit}}</b> Mb</i></p>
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

<style scoped>
    p { text-align: left; font-family: monospace;}
    :deep(i) { color: #10b981; font-style: normal;}
    span.optional { color: rgb(102 104 103); }
    div.button { border: 1px solid gray; width: 200px; text-align: center; padding: 5px 10px; border-radius: 15px; cursor: pointer; }
    div.button:hover { border: 1px solid #719488; background: #2e3d38; }
    .hidden { margin-left: -99999px}

    @media (prefers-color-scheme: light) {
        span.optional { color: rgb(191, 188, 188); }
        div.button:hover { border: 1px solid #719488; background: #dbf8ee; }
    }
</style>
