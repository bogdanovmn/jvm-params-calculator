export default {
  maxHeap: {
    label: 'Max heap', 
    type: 'slider',
    unit: 'M', 
    slider: { min: (vals, preset) => preset.maxHeap / 2, max: (vals, preset) => preset.maxHeap * 3, step: 8 },
    formatJvm: (v) => `-Xmx<i>${v}</i>m`,
  },
  reservedCodeCache: {
    label: 'Reserved code cache', 
    type: 'slider',
    unit: 'M', 
    slider: { min: 16, max: 512, step: 8 },
    formatJvm: (v) => `-XX:ReservedCodeCacheSize=<i>${v}</i>M` 
  },
  maxDirectMemory: {
    label: 'Max direct memory', 
    type: 'slider',
    unit: 'M', 
    slider: { min: 16, max: 512, step: 16 },
    formatJvm: (v) => `-XX:MaxDirectMemorySize=<i>${v}</i>m`,
  },
  maxMetaspace: {
    label: 'Max metaspace',
    type: 'slider',
    unit: 'M', 
    slider: { min: 32, max: 512, step: 8 },
    formatJvm: (v) => `-XX:MaxMetaspaceSize=<i>${v}</i>m`
  },
  compressedClassSpace: {
    label: 'Compressed class space',
    type: 'slider',
    unit: 'M', 
    slider: { min: 8, max: (vals) => vals.maxMetaspace / 2, step: 4 },
    formatJvm: (v) => `-XX:CompressedClassSpaceSize=<i>${v}</i>m`
  },
  threadStackSize: {
    label: 'Thread stack size', 
    type: 'slider',
    unit: 'K', 
    slider: { min: 128, max: 1024, step: 8 },
    formatJvm: (v) => `-Xss<i>${v}</i>k`,
  },
  threadCount: {
    label: 'Thread count', 
    type: 'slider',
    unit: '', 
    slider: { min: 10, max: 500, step: 5 },
    formatJvm: () => null,
  },
  nioCachedBuffer: {
    type: 'static',
    formatJvm: () => '-Djdk.nio.maxCachedBufferSize=262144',
    optional: true
  },
  containerMemoryBufferPercent: {
    label: 'Container memory buffer size', 
    type: 'slider',
    unit: '%', slider: { min: 0, max: 15, step: 1 },
    formatJvm: () => null,
  },
}
