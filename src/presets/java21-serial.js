export default {
  name: 'Java 21: Serial GC',
  memoryCalc: (vals) =>
    vals.maxHeap + vals.maxMetaspace + vals.reservedCodeCache
    + vals.maxDirectMemory
    + (vals.threadStackSize * vals.threadCount / 1024),
  parameters: [
    'maxHeap',
    { key: 'maxEden', label: 'Max Eden', type: 'slider',
      unit: 'M', slider: { min: 16, max: (vals) => vals.maxHeap * 0.7, step: 16 },
      formatJvm: (v) => `-Xmn${v}m` },
    { key: 'reservedCodeCache', label: 'Reserved code cache', type: 'slider',
      unit: 'M', slider: { min: 16, max: 512, step: 8 },
      formatJvm: (v) => `-XX:ReservedCodeCacheSize=${v}M` },
    'maxDirectMemory',
    { key: 'maxMetaspace', label: 'Max metaspace', type: 'slider',
      unit: 'M', slider: { min: 64, max: 512, step: 16 },
      formatJvm: (v) => `-XX:MaxMetaspaceSize=${v}m` },
    { key: 'compressedClassSpace', label: 'Compressed class space', type: 'slider',
      unit: 'M', slider: { min: 8, max: (vals) => vals.maxMetaspace, step: 4 },
      formatJvm: (v) => `-XX:CompressedClassSpaceSize=${v}m` },
    'threadStackSize',
    'threadCount',
    { type: 'static', formatJvm: () => '-XX:+UseSerialGC' },
    { type: 'static', formatJvm: () => '-XX:+ExitOnOutOfMemoryError' },
    'nioCachedBuffer',
  ],
  presets: [
    { id: 1, name: 'default', values: {
      maxHeap: 368, maxEden: 256, reservedCodeCache: 64,
      maxDirectMemory: 64, maxMetaspace: 128, compressedClassSpace: 16,
      threadStackSize: 512, threadCount: 50,
    }},
  ],
}
