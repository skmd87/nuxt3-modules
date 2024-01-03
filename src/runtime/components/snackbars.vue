<template>
    <v-snackbar v-if="currentItem" :key="currentItem._id" class="snackbar-wrapper" close-on-back timer v-bind="currentItem"
        :model-value="true" @update:model-value="modelUpdateHandler">
        <div v-if="queue.length > 1" class="snackbar-badge">
            {{ queue.length }}
        </div>
        <template #actions>
            <v-btn v-for="btn, b in currentItem.btns" :key="b" v-bind="{ ...btn, onClick: undefined }"
                @click="btn.onClick({ close: () => removeItem(currentItem._id as string) })" />
        </template>
    </v-snackbar>
</template>
<script setup lang="ts">
import { VSnackbar } from 'vuetify/components'
import defu from 'defu'
import { useEvent } from '../composables/useEvent'
import type { SnackbarItem, SnackbarBtn } from '../../types/Snackbar'
import { ref, watch, computed } from '#imports'
import type { PropType } from '#imports'
const { on } = useEvent()

const p = defineProps({
    multiLine: {
        type: Boolean as PropType<VSnackbar['$props']['multiLine']>,
        default: true
    },
    timeout: {
        type: Number,
        default: 6000
    },
    location: {
        type: String as PropType<VSnackbar['$props']['location']>,
        default: ''
    }

})

const queue = ref<SnackbarItem[]>([])

const currentItem = computed(() => queue.value[0])

function modelUpdateHandler(value: boolean) {
    if (!value) {
        removeItem(currentItem.value._id as string)
    }
}

function removeItem(id: string) {
    const index = queue.value.findIndex(item => item._id === id)
    if (index === -1) { return }
    queue.value.splice(index, 1)
}

on('snackbar', (item) => {
    item = defu(item, p) as SnackbarItem
    if (item._id === undefined) { item._id = Math.random().toString(36).substr(2, 9) }

    if (item.btns === undefined) { item.btns = [] }

    item.btns = item.btns.map((btn) => {
        return defu(btn, {
            // text: 'Close',

        }) as SnackbarBtn
    })
    // if not exists
    if (!queue.value.find(i => i._id === item._id)) { queue.value.push(item) }
})

</script>
<style lang="scss">
@use 'sass:math';

.snackbar-wrapper {
    $badge-size: 22px;

    .snackbar-badge {
        position: absolute;
        border-radius: 100%;
        top: -1 * math.div($badge-size * 3, 7);
        right: -1 * math.div($badge-size * 3, 7);
        width: $badge-size;
        height: $badge-size;
        background-color: rgb(var(--v-theme-primary));
        color: rgb(var(--v-theme-on-primary));
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .v-snackbar__wrapper {
        overflow: visible !important;
    }
}
</style>
