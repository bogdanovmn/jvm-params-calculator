<script>
    export default {
        props: {
            inputValues: {
                type: Object,
                required: true
            },
        },

        data() {
            return {
                containerMemory: null,
            }
        },
        computed: {
            maxTenured() {
                return this.inputValues.maxHeap - this.inputValues.maxNursery
            },
            containerLimit() {
                return this.inputValues.maxHeap
                    + this.inputValues.maxJitCodeCache
                    + this.inputValues.maxJitDataCache
                    + this.inputValues.maxDirectMemory
                    + this.inputValues.maxClassStorage;
            }
        },
        methods: {
            copyToClipboard() {
                var paramsInline = this.$refs.jvmParams.innerText.replaceAll("\n", " ");
                this.$refs.clipboardBuffer.value = paramsInline;
                this.$refs.clipboardBuffer.select();
                document.execCommand("copy");
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
                <br/>-Xmx<i>{{inputValues.maxHeap}}</i>m
                <br/>-Xmnx<i>{{inputValues.maxNursery}}</i>m
                <br/>-Xmox<i>{{maxTenured}}</i>m
                <br/>-Xcodecachetotal<i>{{inputValues.maxJitCodeCache}}</i>m
                <br/>-Xjit:datatotal=<i>{{inputValues.maxJitDataCache * 1024}}</i>
                <br/>-XX:MaxDirectMemorySize=<i>{{inputValues.maxDirectMemory}}</i>m
                <br/>-Djdk.nio.maxCachedBufferSize=262144
                <br/>‑Xenableexplicitgc
                <br/><span class="not-necessary">-XX:+PrintFlagsFinal</span>
                <br/><span class="not-necessary">-verbose:sizes</span>
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
    i { color: #10b981; font-style: normal;}
    span.not-necessary { color: rgb(102 104 103); }
    div.button { border: 1px solid gray; width: 200px; text-align: center; padding: 5px 10px; border-radius: 15px; cursor: pointer; }
    div.button:hover { border: 1px solid #719488; background: #2e3d38; }
    .hidden { margin-left: -99999px}

    @media (prefers-color-scheme: light) {
        span.not-necessary { color: rgb(191, 188, 188); }
        div.button:hover { border: 1px solid #719488; background: #dbf8ee; }
    }
</style>