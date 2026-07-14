export default {
  name: 'OpenJ9: gencon',
  memoryCalc: (vals) => {
    const total = vals.maxHeap 
      + vals.maxJitCodeCache 
      + vals.maxJitDataCache 
      + vals.maxDirectMemory
      + vals.maxClassStorage
      + (vals.threadStackSize * vals.threadCount / 1024);
    return vals.containerMemoryBufferPercent > 0
      ? total + (total * vals.containerMemoryBufferPercent / 100)
      : total;
  },
  parameters: [
    'maxHeap',
    { key: 'maxNursery', label: 'Max nursery', type: 'slider',
      unit: 'M', slider: { min: 16, max: (vals, preset) => preset.maxHeap * 0.5, step: 8 },
      formatJvm: (v) => `-Xmnx<i>${v}</i>m` },
    { key: 'maxTenured', label: 'Max tenured', type: 'derived',
      derive: (vals) => vals.maxHeap - vals.maxNursery,
      formatJvm: (v) => `-Xmox<i>${v}</i>m` },
    { key: 'maxJitCodeCache', label: 'JIT code cache', type: 'slider',
      unit: 'M', slider: { min: 16, max: 384, step: 8 },
      formatJvm: (v) => `-Xcodecachetotal<i>${v}</i>m` },
    { key: 'maxJitDataCache', label: 'JIT data cache', type: 'slider',
      unit: 'M', slider: { min: 16, max: 256, step: 8 },
      formatJvm: (v) => `-Xjit:datatotal=<i>${v * 1024}</i>` },
    'maxDirectMemory',
    { key: 'maxClassStorage', label: 'Class storage', type: 'slider',
      unit: 'M', slider: { min: 16, max: 256, step: 8 },
      formatJvm: () => null },
    'threadStackSize',
    'threadCount',
    'containerMemoryBufferPercent',
    { type: 'static', formatJvm: () => '-Djdk.nio.maxCachedBufferSize=262144' },
    { type: 'static', formatJvm: () => '-Xenableexplicitgc' },
    { type: 'static', formatJvm: () => '-XX:+PrintFlagsFinal', optional: true },
    { type: 'static', formatJvm: () => '-verbose:sizes', optional: true },
  ],
  presets: [
    { id: 1, name: 'dev', values: { maxHeap: 384, maxNursery: 96, maxJitCodeCache: 48, maxJitDataCache: 32, maxDirectMemory: 32, maxClassStorage: 160, threadStackSize: 512, threadCount: 30, containerMemoryBufferPercent: 0, } },
    { id: 2, name: 'prod - small', values: { maxHeap: 768, maxNursery: 192, maxJitCodeCache: 96, maxJitDataCache: 48, maxDirectMemory: 256, maxClassStorage: 160, threadStackSize: 512, threadCount: 3, containerMemoryBufferPercent: 0, } },
    { id: 3, name: 'prod - middle', values: { maxHeap: 2048, maxNursery: 512, maxJitCodeCache: 96, maxJitDataCache: 48, maxDirectMemory: 256, maxClassStorage: 160, threadStackSize: 512, threadCount: 3, containerMemoryBufferPercent: 0, } },
    { id: 4, name: 'prod - big', values: { maxHeap: 4096, maxNursery: 512, maxJitCodeCache: 96, maxJitDataCache: 48, maxDirectMemory: 256, maxClassStorage: 160, threadStackSize: 512, threadCount: 3, containerMemoryBufferPercent: 0, } },
  ],
}
