export default {
  name: 'Java 21: Serial GC',
  memoryCalc: (vals) => {
    const total = vals.maxHeap 
      + vals.maxMetaspace 
      + vals.reservedCodeCache 
      + vals.maxDirectMemory
      + (vals.threadStackSize * vals.threadCount / 1024);
    return vals.containerMemoryBufferPercent > 0
      ? total + (total * vals.containerMemoryBufferPercent / 100)
      : total;
  },
  parameters: [
    'maxHeap',
    { key: 'maxEden', 
      label: 'Max Eden', 
      type: 'slider',
      unit: 'M', 
      slider: { min: 16, max: (vals) => vals.maxHeap * 0.7, step: 8 },
      formatJvm: (v) => `-Xmn<i>${v}</i>m` 
    },
    'reservedCodeCache',
    'maxDirectMemory',
    'maxMetaspace',
    'compressedClassSpace',
    'threadStackSize',
    'threadCount',
    'containerMemoryBufferPercent',
    { type: 'static', formatJvm: () => '-XX:+UseSerialGC' },
    { type: 'static', formatJvm: () => '-XX:+ExitOnOutOfMemoryError', optional: true },
    { type: 'static', formatJvm: () => '-XX:+UseCodeCacheFlushing', optional: true },
    { type: 'static', formatJvm: () => '-XX:+PrintFlagsFinal', optional: true },
    { type: 'static', formatJvm: () => '-verbose:sizes', optional: true },
    'nioCachedBuffer',
  ],
  presets: [
    { id: 1, 
      name: 'dev', 
      values: {
        maxHeap: 512,
        maxEden: 256, 
        reservedCodeCache: 64,
        maxDirectMemory: 64, 
        maxMetaspace: 128, 
        compressedClassSpace: 16,
        threadStackSize: 512, 
        threadCount: 20,
        containerMemoryBufferPercent: 0,
      }
    },
    { id: 2, 
      name: 'prod', 
      values: {
        maxHeap: 2048,
        maxEden: 512, 
        reservedCodeCache: 64,
        maxDirectMemory: 64, 
        maxMetaspace: 128, 
        compressedClassSpace: 16,
        threadStackSize: 512, 
        threadCount: 30,
        containerMemoryBufferPercent: 0,
      }
    },
  ],
}
