<template>
    <slot v-bind="$bind" />
</template>
<script setup lang="ts">
import { on } from 'events';
import dot from 'dot-object'
import { VSelect } from 'vuetify/components'
import { useApi } from '../composables/useApi';
import { t } from '../../helpers'
import { shallowReactive, watch, nextTick, useHydration, onMounted, } from '#imports';
export type ApiItemsProps = {
    /**
     * The URL to fetch data from.
     */
    url: Parameters<typeof useApi>[0]
    /**
    * Additional options for the API request.
    */
    apiOptions?: Parameters<typeof useApi>[1]
    /**
    * The key to access the items in the API response.
    */
    itemsKey?: string
    /**
    * Indicates whether server-side rendering should be enabled.
    */
    ssr?: boolean
}
const p = withDefaults(defineProps<ApiItemsProps>(),
    {
        itemsKey: '',
        apiOptions: () => ({}),
        ssr: false
    }
)
const $bind = shallowReactive<InstanceType<typeof VSelect>['$props']>({
    items: [],
    loading: false,
    error: false,
    errorMessages: [],
})

const { execute, refresh, data, error } = useApi(p.url, { ...p.apiOptions, server: false, lazy: true })/* .then(async ({ data, error }) => {
        console.log('data', data.value, 'error', error.value)
        // if (!p.ssr) {
        await nextTick();
        // }
        console.log('data', data.value, 'error', error.value)

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
            // reset error
            $bind.error = false
            $bind.errorMessages = []
            $bind.appendIcon = undefined
            $bind['onClick:appendInner'] = undefined
        }
        $bind.loading = false
    }) */
// const getData = () => {
//     $bind.loading = true
//     if (!p.url) return

// }

if (error.value) {
    $bind.error = true
    $bind.errorMessages = [t('api-items.request-error')]
    $bind.appendIcon = 'mdi-reload'
    $bind['onClick:append'] = refresh
} else if (data.value) {
    if (p.itemsKey) {
        // $bind.items = data.value[p.itemsKey as keyof typeof data.value] as any[]
        $bind.items = dot.pick(p.itemsKey, data.value);
    } else {
        $bind.items = data.value as any[]
    }
    // reset error
    $bind.error = false
    $bind.errorMessages = []
    $bind.appendIcon = undefined
    $bind['onClick:appendInner'] = undefined
}
$bind.loading = false

onMounted(() => {
    execute()
})
defineExpose({
    $bind,
    refresh
})
</script>