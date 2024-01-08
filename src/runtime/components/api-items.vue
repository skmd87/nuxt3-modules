<template>
    <slot v-bind="$bind" />
</template>
<script setup lang="ts">
import dot from 'dot-object'
import { VSelect } from 'vuetify/components'
import { useApi } from '../composables/useApi';
import { t } from '../../helpers'
import { watch, reactive, useFetch, toRaw, } from '#imports';
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
        ssr: false,
        apiOptions: () => ({})
    }
)
const $bind = reactive<InstanceType<typeof VSelect>['$props']>({
    items: [],
    loading: false,
    error: false,
    errorMessages: [],
})

// const getData = async () => {
//     console.log('getData')
//     $bind.loading = true
//     if (!p.url) return
    const { data, error } = await useFetch(p.url, { ...p.apiOptions, server: p.ssr })/* .then(({ data, error }) => {
        console.log("🚀 ~ file: api-items.vue:47 ~ useFetch ~ data, error:", data, p.itemsKey, data._rawValue, dot.pick(p.itemsKey, toRaw(data.value)))

        if (error.value) {
            $bind.error = true
            $bind.errorMessages = [t('api-items.request-error')]
            $bind.appendIcon = 'mdi-reload'
            $bind['onClick:append'] = () => getData()
        } else /* if (data.value) * {
            if (p.itemsKey) {
                $bind.items = dot.pick(p.itemsKey, data.value) as any[]
            } else {
                $bind.items = data.value as any[]
            }
            console.log("🚀 ~ file: api-items.vue:57 ~ useFetch ~ $bind.items:", $bind.items)

            // reset error
            $bind.error = false
            $bind.errorMessages = []
            $bind.appendIcon = undefined
            $bind['onClick:appendInner'] = undefined
        }
        $bind.loading = false
        return { data, error }
    }) */
console.log("final", data, p.itemsKey, data.value, dot.pick(p.itemsKey, toRaw(data.value)))
    setTimeout(() => {
        console.log("final2", data, p.itemsKey, data.value, dot.pick(p.itemsKey, toRaw(data.value)))
    }, 1000);

// }

// watch(() => [p.url, p.apiOptions?.query], () => getData(), { immediate: true })
// defineExpose({
//     $bind,
//     refresh: getData
// })
</script>