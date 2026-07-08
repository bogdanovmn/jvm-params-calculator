export default {
  maxHeap: {
    label: 'Max heap', type: 'slider',
    unit: 'M', slider: { min: 128, max: 16384, step: 16 },
    formatJvm: (v) => `-Xmx${v}m`,
  },
  maxDirectMemory: {
    label: 'Max direct memory', type: 'slider',
    unit: 'M', slider: { min: 16, max: 512, step: 16 },
    formatJvm: (v) => `-XX:MaxDirectMemorySize=${v}m`,
  },
  threadStackSize: {
    label: 'Thread stack size', type: 'slider',
    unit: 'K', slider: { min: 256, max: 1024, step: 64 },
    formatJvm: (v) => `-Xss${v}k`,
  },
  threadCount: {
    label: 'Thread count', type: 'slider',
    unit: '', slider: { min: 10, max: 500, step: 10 },
    formatJvm: () => null,
  },
  nioCachedBuffer: {
    type: 'static',
    formatJvm: () => '-Djdk.nio.maxCachedBufferSize=262144',
  },
}
