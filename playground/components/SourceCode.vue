<template>
    <v-sheet max-width="100%" color="#000" dir="ltr" rounded :max-height="`calc(100dvh - ${toolbarHeight + 32}px)`" class="mt-4 overflow-auto">
        <client-only>
            <VCodeBlock :code="rawSrcCode" highlightjs lang="html" theme="atom-one-dark" />
        </client-only>
    </v-sheet>
</template>
<script setup lang="ts">
import VCodeBlock from '@wdns/vue-code-block';
const { $getRouteBaseName } = useNuxtApp()
const rawSrcCode = ref('')
const toolbarHeight = ref(0)
const getSrcCode = async (path: string) => {

    return (await import(`@/pages/${path}.vue?raw`)).default
}

const route = useRoute()
watch(() => route.path, async () => {
    const baseName = $getRouteBaseName()
    if (!baseName) return
    rawSrcCode.value = await getSrcCode(baseName)
}, { immediate: true })


const layout = useLayout()
onMounted(() => {
    toolbarHeight.value = layout.mainRect.value.top
})
</script>