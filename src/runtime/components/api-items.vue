<template>
    <slot v-bind="$bind" />
</template>
<script setup lang="ts">
import dot from 'dot-object'
import { useApi } from '../composables/useApi';
import { t } from '../../helpers'
import { computed } from '#imports';
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

const apiOptions = computed(() => {
    return {
        ...p.apiOptions,
        server: p.ssr,
        lazy: !p.ssr,
    }
})

const { data, error, pending, refresh } = useApi(p.url, apiOptions.value)
console.log("🚀 ~ data, error, pending, refresh:", data, error, pending, refresh)


const $bind = computed<{
    items: any[]
    loading: boolean
    error: boolean
    errorMessages: string[]
    appendIcon?: string
    'onClick:append'?: () => void
}>(() => {
    const items = computed<any[]>(() => {
        if (p.itemsKey && typeof data?.value === 'object') {
            // $bind.items = data.value[p.itemsKey as keyof typeof data.value] as any[]
            const extractedItems = dot.pick(p.itemsKey, data?.value);
            if (Array.isArray(extractedItems)) {
                return extractedItems
            }
        }

        if (Array.isArray(data?.value)) {
            return data.value
        }

        return []
    })

    const errorMessages = []
    if (error?.value) {
        errorMessages.push(t('api-items.request-error'))
    }

    return {
        items: items.value,
        loading: pending?.value,
        error: !!error?.value,
        errorMessages,
        data: data?.value,
    }
})



defineExpose({
    $bind,
    refresh
})
</script>