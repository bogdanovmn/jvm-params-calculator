export default {
  name: 'Java 21: G1 GC',
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
    'reservedCodeCache',
    'maxDirectMemory',
    'maxMetaspace',
    'compressedClassSpace',
    'threadStackSize',
    'threadCount',
    'containerMemoryBufferPercent',
    { type: 'static', formatJvm: () => '-XX:+UseG1GC' },
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
