<template>
    <slot />
</template>
<script setup lang="ts">
import defu from 'defu';
import { DatatableDefaultsSymbol, type DatatableProps } from '../../types/Datatable'
import { provide, useRuntimeConfig, type PropType } from '#imports'
const runtimeConfig = useRuntimeConfig().public.nuxt3Modules

const propsDefaults = defineProps({
    datatable: {
        type: Object as PropType<DatatableProps>,
        required: false,
        default: () => ({})
    }
})

const runtimeDefaults = Object.fromEntries(Object.entries(runtimeConfig).filter(([, options]) => typeof options === 'object'))

const mergedDefaults = defu(propsDefaults, runtimeDefaults)

// filter runtimeConfig to only include modules that has options
provide(DatatableDefaultsSymbol, mergedDefaults.datatable)


</script>