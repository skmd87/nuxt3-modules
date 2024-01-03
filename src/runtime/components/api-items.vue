<template>
    <slot v-bind="$bind" />
</template>
<script setup lang="ts">
import { shallowReactive, type PropType, watch, h, onMounted, } from '#imports';
import { useApi } from '../composables/useApi';
import dot from 'dot-object'
import { VSelect } from 'vuetify/components'
import { t } from '../../helpers'
const p = defineProps({
    url: {
        type: [String, Function] as PropType<Parameters<typeof useApi>[0]>,
        required: true
    },
    options: {
        type: Object as PropType<Parameters<typeof useApi>[1]>,
        default: () => ({})
    },
    itemsKey: {
        type: String,
        default: ''
    },
    ssr: {
        type: Boolean,
        default: false
    }
})

const $bind = shallowReactive<InstanceType<typeof VSelect>['$props']>({
    items: [],
    loading: false,
    error: false,
    errorMessages: [],
})

const getData = () => {
    $bind.loading = true
    useApi(p.url, { ...p.options, server: p.ssr }).then(({ data, error }) => {
        if (error.value) {
            $bind.error = true
            $bind.errorMessages = [t('api-items.request-error')]
            $bind.appendIcon = 'mdi-reload'
            $bind['onClick:append'] = () => getData()
        } else if (data.value) {
            if (p.itemsKey) {
                // $bind.items = data.value[p.itemsKey as keyof typeof data.value] as any[]
                $bind.items = dot.pick(p.itemsKey, data.value);
            } else {
                $bind.items = data.value as any[]
            }
            //reset error
            $bind.error = false
            $bind.errorMessages = []
            $bind.appendIcon = undefined
            $bind['onClick:appendInner'] = undefined
        }
        $bind.loading = false
    })
}
watch(() => p.url, () => getData(), { immediate: true })
onMounted(getData)
</script>