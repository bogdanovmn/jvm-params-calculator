<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'normal',
                validator: (v) => ['normal', 'result', 'invisible'].includes(v)
            },
            title: {
                type: String,
                default: null
            }
        }
    }
</script>

<template>
    <div :class="['card', `card-${type}`]">
        <p v-if="title" class="card-title">{{ title }}</p>
        <slot />
    </div>
</template>

<style scoped>
    .card {
        border-radius: 12px;
        padding: 16px 20px;
        padding-top: 10px;
        margin-bottom: 30px;
    }
    .card :deep(> :last-child) {
        margin-bottom: 0;
    }
    .card-title {
        font-size: 1.15em;
        font-weight: 600;
        margin-bottom: 16px;
        text-align: left;
    }

    .card-normal {
        border: 1px solid rgba(110, 231, 183, 0.12);
        background: rgba(110, 231, 183, 0.03);
    }
    .card-normal .card-title {
        color: rgba(110, 231, 183, 0.6);
    }

    .card-result {
        border: 1px solid rgba(251, 146, 60, 0.15);
        background: rgba(251, 146, 60, 0.04);
    }
    .card-result .card-title {
        color: rgba(251, 146, 60, 0.6);
    }

    .card-invisible {
        border: none;
        background: none;
        padding-left: 0;
        padding-right: 0;
    }

    @media (prefers-color-scheme: light) {
        .card-normal {
            border-color: rgba(5, 150, 105, 0.12);
            background: rgba(5, 150, 105, 0.03);
        }
        .card-normal .card-title {
            color: rgba(5, 150, 105, 0.6);
        }
        .card-result {
            border-color: rgba(234, 88, 12, 0.15);
            background: rgba(234, 88, 12, 0.04);
        }
        .card-result .card-title {
            color: rgba(234, 88, 12, 0.6);
        }
    }
</style>
