export const presetsConfig = [
    {
        id: 1,
        name: "OpenJ9: gencon",
        selected: true,
        options: [
            {
                id: 1,
                name: "dev",
                selected: false,
                params: {
                    maxHeap: 384,
                    maxNursery: 96,
                    maxJitCodeCache: 48,
                    maxJitDataCache: 32,
                    maxDirectMemory: 32,
                    maxClassStorage: 160
                }
            },
            {
                id: 2,
                name: "prod - small",
                selected: true,
                params: {
                    maxHeap: 768,
                    maxNursery: 192,
                    maxJitCodeCache: 96,
                    maxJitDataCache: 48,
                    maxDirectMemory: 256,
                    maxClassStorage: 160
                }
            },
            {
                id: 3,
                name: "prod - middle",
                selected: false,
                params: {
                    maxHeap: 2048,
                    maxNursery: 512,
                    maxJitCodeCache: 96,
                    maxJitDataCache: 48,
                    maxDirectMemory: 256,
                    maxClassStorage: 160
                }
            },
            {
                id: 4,
                name: "prod - big",
                selected: false,
                params: {
                    maxHeap: 4096,
                    maxNursery: 512,
                    maxJitCodeCache: 96,
                    maxJitDataCache: 48,
                    maxDirectMemory: 256,
                    maxClassStorage: 160
                }
            }
        ]
    }
]