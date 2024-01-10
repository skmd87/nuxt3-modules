<template>
    <nuxt-notifications v-bind="computedProps">
        <template #body="{ item }">

            <v-card elevation="4" :color="item.type" class="ma-1">
                <v-card-title class="d-flex">
                    <slot name="title" v-bind="{ item }">
                        <div>{{ item.title }}</div>
                    </slot>
                    <v-spacer />
                    <slot name="close" v-bind="{ item, notify }"> <v-btn size="small" variant="text" icon="mdi-close"
                            @click="notify.close(item.id)"></v-btn></slot>
                </v-card-title>
                <v-card-text>
                    <slot name="text" v-bind="{ item }">{{ item.text }}</slot>
                </v-card-text>
            </v-card>

        </template>
    </nuxt-notifications>
</template>

<script lang="ts" setup>
import { useNotification } from '@kyvg/vue3-notification'
import { useRtl } from 'vuetify/lib/framework.mjs';
import { computed, type PropType } from '#imports'

const p = defineProps({
    group: {
        type: String,
        default: undefined
    },
    animationName: {
        type: String,
        default: undefined
    },
    speed: {
        type: Number,
        default: 200
    },
    max: {
        type: Number,
        default: 10
    },
    cooldown: {
        type: Number,
        default: 1
    },
    width: {
        type: [Number, String],
        default: 400
    },
    classes: {
        type: String,
        default: ''
    },
    closeOnClick: {
        type: Boolean,
        default: true
    },
    reverse: {
        type: Boolean,
        default: false
    },
    pauseOnHover: {
        type: Boolean,
        default: true
    },
    delay: {
        type: Number,
        default: 0
    },
    ignoreDuplicates: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        default: 10 * 1000
    },
    position: {
        type: String as PropType<'top start' | 'top end' | 'bottom start' | 'bottom end' | 'center start' | 'center end' | 'center center' | 'top center' | 'bottom center'>,
        default: 'bottom end',
    },
})

const { isRtl } = useRtl()

const computedProps = computed(() => {
    return {
        ...p,
        position: p.position.replace('start', isRtl.value ? 'right' : 'left').replace('end', isRtl.value ? 'left' : 'right')
    }
})

const { notify } = useNotification()
</script>