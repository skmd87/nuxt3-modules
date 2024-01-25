<template>
    <api-items ref="apiItemsRef" v-bind="$bind.apiItems">
        <v-data-table-server ref="vDataTableRef" v-bind="$bind.datatable" v-on="$on.datatable">
            <template #top="{ }">
                <v-toolbar color="transparent" density="compact">
                    <v-text-field ref="searchRef" v-bind="$bind.toolbar.search" v-model="searchModel" />
                    <v-btn v-if="hasFilter" v-bind="$bind.toolbar.filter" />
                    <v-spacer />
                    <slot name="toolbar.column-Visibility" v-bind="$bind.toolbar.columnVisibility">
                        <v-btn v-bind="$bind.toolbar.columnVisibility">
                            <v-menu activator="parent" close-on-back :close-on-content-click="false">
                                <v-list v-model:selected="selectedHiddenColumns" density="compact" slim
                                    :items="$bind.toolbar.columnVisibility.items" select-strategy="classic">

                                    <template v-slot:append="{ isActive }">
                                        <v-list-item-action end>
                                            <v-switch class="ms-8" hide-details density="compact" color="primary"
                                                :model-value="isActive" />
                                        </v-list-item-action>
                                    </template>

                                </v-list>
                            </v-menu>
                            <v-icon>{{ $bind.toolbar.columnVisibility.icon }}</v-icon>
                        </v-btn>
                    </slot>
                    <v-btn v-bind="$bind.toolbar.fullscreen" />
                    <slot name="toolbar.refresh" v-bind="$bind.toolbar.refresh">
                        <v-btn v-bind="$bind.toolbar.refresh"></v-btn>
                    </slot>
                </v-toolbar>
            </template>
            <template v-for="(_, name) in ($slots as VDataTableServerSlots | {})" v-slot:[name]="slotData">
                <slot :name="name" v-bind="{ ...slotData }"></slot>
            </template>
            <template v-if="!$bind.datatable.items?.length" v-slot:loading>
                <v-skeleton-loader :type="`table-row@${$p.itemsPerPage}`"></v-skeleton-loader>
            </template>
        </v-data-table-server>
    </api-items>
    <v-navigation-drawer v-model="navigationDrawerModel" location="start" temporary>
        <template #prepend>
            <v-card-title> Filter</v-card-title>
        </template>
        <v-lazy>
            <v-card-text>
                <slot name="filter" v-bind="$bind.filter" />
            </v-card-text>
        </v-lazy>
        <template #append>
            <v-card-actions>
                <v-btn @click="resetFilter">Reset</v-btn>
                <v-spacer />
                <v-btn color="primary" @click="applyFilter">Apply</v-btn>

            </v-card-actions>
        </template>
    </v-navigation-drawer>
</template>
<script lang="ts">

</script>
<script lang="ts" setup>
import dot from 'dot-object'
import { VDataTableServer, VTextField, VBtn, VList } from 'vuetify/components';
import { useStorage, refDebounced, useFullscreen } from '@vueuse/core'
import { klona } from 'klona';
import defu from 'defu';
import { DatatableDefaultsSymbol } from '../../types/Datatable'
import ApiItems, { type ApiItemsProps } from './api-items.vue'
import { type PropType, computed, type ComputedRef, ref, reactive, watch, useSlots, inject } from '#imports';
import type { ComponentProps } from '~/src/types/helpers';

export type ApiOptions = ApiItemsProps['apiOptions']
export type Headers = VDataTableServer['$props']['headers']
export type CellProps = VDataTableServer['$props']['cellProps']
export type Color = VDataTableServer['$props']['color'] | undefined
export type CustomKeySort = VDataTableServer['$props']['customKeySort']
export type Density = VDataTableServer['$props']['density']
export type Expanded = VDataTableServer['$props']['expanded']
export type ExpandOnClick = VDataTableServer['$props']['expandOnClick']
export type FirstIcon = VDataTableServer['$props']['firstIcon']
export type FirstPageLabel = VDataTableServer['$props']['firstPageLabel']
export type FixedFooter = VDataTableServer['$props']['fixedFooter']
export type FixedHeader = VDataTableServer['$props']['fixedHeader']
export type GroupBy = VDataTableServer['$props']['groupBy']
export type Height = VDataTableServer['$props']['height']
export type HideNoData = VDataTableServer['$props']['hideNoData']
export type Hover = VDataTableServer['$props']['hover']
export type ItemSelectable = VDataTableServer['$props']['itemSelectable']
export type ItemsPerPage = VDataTableServer['$props']['itemsPerPage']
export type ItemsPerPageOptions = VDataTableServer['$props']['itemsPerPageOptions']
export type ItemsPerPageText = VDataTableServer['$props']['itemsPerPageText']
export type ItemValue = VDataTableServer['$props']['itemValue']
export type LastIcon = VDataTableServer['$props']['lastIcon']
export type LastPageLabel = VDataTableServer['$props']['lastPageLabel']
export type Loading = VDataTableServer['$props']['loading']
export type LoadingText = VDataTableServer['$props']['loadingText']
export type ModelValue = VDataTableServer['$props']['modelValue']
export type MultiSort = VDataTableServer['$props']['multiSort']
export type MustSort = VDataTableServer['$props']['mustSort']
export type NextIcon = VDataTableServer['$props']['nextIcon']
export type NextPageLabel = VDataTableServer['$props']['nextPageLabel']
export type NoDataText = VDataTableServer['$props']['noDataText']
export type Page = VDataTableServer['$props']['page']
export type PageText = VDataTableServer['$props']['pageText']
export type PrevIcon = VDataTableServer['$props']['prevIcon']
export type PrevPageLabel = VDataTableServer['$props']['prevPageLabel']
export type ReturnObject = VDataTableServer['$props']['returnObject']
export type RowProps = VDataTableServer['$props']['rowProps']
export type Search = VDataTableServer['$props']['search']
export type SelectStrategy = VDataTableServer['$props']['selectStrategy']
export type ShowCurrentPage = VDataTableServer['$props']['showCurrentPage']
export type ShowExpand = VDataTableServer['$props']['showExpand']
export type ShowSelect = VDataTableServer['$props']['showSelect']
export type SortAscIcon = VDataTableServer['$props']['sortAscIcon']
export type SortBy = VDataTableServer['$props']['sortBy']
export type SortDescIcon = VDataTableServer['$props']['sortDescIcon']
export type Sticky = VDataTableServer['$props']['sticky']
export type Theme = VDataTableServer['$props']['theme']
export type ValueComparator = VDataTableServer['$props']['valueComparator']
export type Width = VDataTableServer['$props']['width']

export type VDataTableServerSlots = VDataTableServer['$slots']
export type Model = Record<string, string | number>
export type RequestQuery = {
    [key: string]: string | number | boolean | undefined
}
export type ToolbarSlots = Readonly<{
    'toolbar.column-Visibility'(props: {
        items: any[]
    }): any
    'toolbar.refresh'(props: {
        loading: boolean
        icon: string
        onClick: () => void
    }): any
}>
export type FilterSlots = Readonly<{
    filter(props: {
        model: Model
    }): any
}>
export type Slots = VDataTableServerSlots & ToolbarSlots & FilterSlots

defineOptions({
    inheritAttrs: false
})

defineSlots<Slots>()

const d = inject(DatatableDefaultsSymbol)

const p = defineProps({
    url: {
        type: String as PropType<ApiItemsProps['url']>,
        required: true
    },

    apiOptions: {
        type: Object as PropType<ApiOptions>,
        required: false,
        default: () => ({})
    },

    itemsKey: {
        type: String as PropType<ApiItemsProps['itemsKey']>,
        required: false,
        default: ''
    },

    ssr: {
        type: Boolean as PropType<ApiItemsProps['ssr']>,
        required: false,
        default: false
    },

    items: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    },

    headers: {
        type: Array as PropType<Headers>,
        required: true
    },

    cellProps: {
        type: Object as PropType<CellProps>,
        required: false,
        default: () => ({})
    },
    color: {
        type: String,
        required: false,
        default: undefined
    },
    // customFilter: {
    //     type: Function as PropType<CustomFilter>,
    //     required: false,
    //     default: undefined
    // },
    // customKeyFilter: {
    //     type: Object as PropType<CustomKeyFilter>,
    //     required: false,
    //     default: undefined
    // },
    customKeySort: {
        type: Object as PropType<CustomKeySort>,
        required: false,
        default: undefined
    },
    density: {
        type: String as PropType<Density>,
        required: false,
        default: undefined
    },
    expanded: {
        type: Array as PropType<Expanded>,
        required: false,
        default: undefined
    },
    expandOnClick: {
        type: Boolean as PropType<ExpandOnClick>,
        required: false,
        default: undefined
    },
    // filterKeys: {
    //     type: Array as PropType<FilterKeys>,
    //     required: false,
    //     default: undefined
    // },
    // filterMode: {
    //     type: String as PropType<FilterMode>,
    //     required: false,
    //     default: undefined
    // },
    firstIcon: {
        type: String as PropType<FirstIcon>,
        required: false,
        default: undefined
    },
    firstPageLabel: {
        type: String as PropType<FirstPageLabel>,
        required: false,
        default: undefined
    },
    fixedFooter: {
        type: Boolean as PropType<FixedFooter>,
        required: false,
        default: undefined
    },
    fixedHeader: {
        type: Boolean as PropType<FixedHeader>,
        required: false,
        default: undefined
    },
    groupBy: {
        type: Array as PropType<GroupBy>,
        required: false,
        default: undefined
    },

    height: {
        type: [String, Number] as PropType<Height>,
        required: false,
        default: undefined
    },
    hideNoData: {
        type: Boolean as PropType<HideNoData>,
        required: false,
        default: undefined
    },
    hover: {
        type: Boolean as PropType<Hover>,
        required: false,
        default: undefined
    },
    itemSelectable: {
        type: [String, Boolean, Function] as PropType<ItemSelectable>,
        required: false,
        default: undefined
    },
    itemsPerPage: {
        type: [String, Number] as PropType<ItemsPerPage>,
        required: false,
        default: 10
    },
    itemsPerPageOptions: {
        type: Array as PropType<ItemsPerPageOptions>,
        required: false,
        default: () => [10, 20, 30]
    },
    itemsPerPageText: {
        type: String as PropType<ItemsPerPageText>,
        required: false,
        default: undefined
    },
    itemValue: {
        type: [String, Function] as PropType<ItemValue>,
        required: false,
        default: undefined
    },
    lastIcon: {
        type: String as PropType<LastIcon>,
        required: false,
        default: undefined
    },
    lastPageLabel: {
        type: String as PropType<LastPageLabel>,
        required: false,
        default: undefined
    },
    loading: {
        type: Boolean as PropType<Loading>,
        required: false,
        default: undefined
    },
    loadingText: {
        type: String as PropType<LoadingText>,
        required: false,
        default: undefined
    },
    modelValue: {
        type: [Array, Object] as PropType<ModelValue>,
        required: false,
        default: undefined
    },
    multiSort: {
        type: Boolean as PropType<MultiSort>,
        required: false,
        default: undefined
    },
    mustSort: {
        type: Boolean as PropType<MustSort>,
        required: false,
        default: undefined
    },
    nextIcon: {
        type: String as PropType<NextIcon>,
        required: false,
        default: undefined
    },
    nextPageLabel: {
        type: String as PropType<NextPageLabel>,
        required: false,
        default: undefined
    },
    noDataText: {
        type: String as PropType<NoDataText>,
        required: false,
        default: undefined
    },
    // noFilter: {
    //     type: Boolean as PropType<NoFilter>,
    //     required: false,
    //     default: undefined
    // },
    /*
    // DEPRECIATED: use pageKey instead and listen to update:page event
    */
    page: {
        type: Number as PropType<Page>,
        required: false,
        default: undefined
    },
    pageText: {
        type: String as PropType<PageText>,
        required: false,
        default: undefined
    },
    prevIcon: {
        type: String as PropType<PrevIcon>,
        required: false,
        default: undefined
    },
    prevPageLabel: {
        type: String as PropType<PrevPageLabel>,
        required: false,
        default: undefined
    },
    returnObject: {
        type: Boolean as PropType<ReturnObject>,
        required: false,
        default: undefined
    },
    rowProps: {
        type: Object as PropType<RowProps>,
        required: false,
        default: undefined
    },
    // search: {
    //     type: String as PropType<Search>,
    //     required: false,
    //     default: undefined
    // },
    selectStrategy: {
        type: String as PropType<SelectStrategy>,
        required: false,
        default: undefined
    },
    showCurrentPage: {
        type: Boolean as PropType<ShowCurrentPage>,
        required: false,
        default: undefined
    },
    showExpand: {
        type: Boolean as PropType<ShowExpand>,
        required: false,
        default: undefined
    },
    showSelect: {
        type: Boolean as PropType<ShowSelect>,
        required: false,
        default: undefined
    },
    sortAscIcon: {
        type: String as PropType<SortAscIcon>,
        required: false,
        default: undefined
    },
    sortBy: {
        type: [String, Array] as PropType<SortBy>,
        required: false,
        default: undefined
    },
    sortDescIcon: {
        type: String as PropType<SortDescIcon>,
        required: false,
        default: undefined
    },
    sticky: {
        type: Boolean as PropType<Sticky>,
        required: false,
        default: undefined
    },
    theme: {
        type: Object as PropType<Theme>,
        required: false,
        default: undefined
    },
    valueComparator: {
        type: Function as PropType<ValueComparator>,
        required: false,
        default: undefined
    },
    width: {
        type: [String, Number] as PropType<Width>,
        required: false,
        default: undefined
    },
    searchProps: {
        type: Object as PropType<VTextField['$props']>,
        required: false,
        default: () => ({})
    },
    tableStorageKey: {
        type: String,
        required: false,
        default: undefined
    },
    // total: {
    //     type: String,
    //     required: false,
    //     default: 'total'
    // },

    searchKey: {
        type: String,
        required: false,
        default: 'search'
    },
    itemsPerPageReqKey: {
        type: String,
        required: false,
        default: 'perPage'
    },
    itemsPerPageResKey: {
        type: String,
        required: false,
        default: 'pagination.perPage'
    },
    pageReqKey: {
        type: String,
        required: false,
        default: 'page'
    },
    pageResKey: {
        type: String,
        required: false,
        default: 'pagination.page'
    },
    totalReqKey: {
        type: String,
        required: false,
        default: 'total'
    },
    totalResKey: {
        type: String,
        required: false,
        default: 'pagination.total'
    },
    btnsColor: {
        type: String as PropType<Color>,
        required: false,
        default: 'grey-darken-2'
    },
})


const $p = reactive(defu(d, p))

const computedStorageKey = computed(() => {
    return `Nuxt3Modules.table.headers:${$p.tableStorageKey || $p.url || 'default'}`
})
const columnVisibilityStorageState = useStorage<string[]>(computedStorageKey.value, [])
const slots = useSlots()


const apiItemsRef = ref<typeof ApiItems | null>()
const vDataTableRef = ref<typeof VDataTableServer | null>()
const searchRef = ref<typeof VTextField | null>()

const searchModel = ref<string | null>(null)
// @ts-ignore
const debouncedSearchModel = refDebounced<string | null>(searchModel, 400)
// @ts-ignore
const { isFullscreen, toggle } = useFullscreen(vDataTableRef)
const navigationDrawerModel = ref<boolean>(false)
const selectedHiddenColumns = ref<string[]>([...columnVisibilityStorageState.value])


watch(() => selectedHiddenColumns.value, (value) => {
    columnVisibilityStorageState.value = value
}, { deep: true })

const hasFilter = computed(() => {
    return !!slots.filter
})

const appliedQuery = ref/* <RequestQuery & Model> */({
    [$p.pageReqKey as string]: $p.page || 1,
    [$p.itemsPerPageReqKey as string]: $p.itemsPerPage || 10,
    [$p.searchKey as string]: debouncedSearchModel
})


const showFilter = () => {
    navigationDrawerModel.value = true
}

const closeFilter = () => {
    navigationDrawerModel.value = false
}

const applyFilter = () => {
    for (const key in $bind.filter.model) {
        appliedQuery.value[key] = $bind.filter.model[key]
    }
    closeFilter()
}

const resetFilter = () => {
    for (const key in $bind.filter.model) {
        $bind.filter.model[key] = ''
        delete appliedQuery.value[key]
    }
    closeFilter()
}

const $bind = reactive<{
    apiItems: {
        url: ComputedRef<ApiItemsProps['url']>,
        apiOptions: ComputedRef<ApiItemsProps['apiOptions']>,
        itemsKey: ComputedRef<ApiItemsProps['itemsKey']>,
        ssr: ComputedRef<ApiItemsProps['ssr']>
    },
    datatable: {
        items: ComputedRef<VDataTableServer['$props']['items']>
        itemsLength: ComputedRef<VDataTableServer['$props']['itemsLength']>
        itemsPerPage: ComputedRef<VDataTableServer['$props']['itemsPerPage']>
        page: ComputedRef<VDataTableServer['$props']['page']>
        loading: ComputedRef<boolean>,
        headers: ComputedRef<Headers>
        // [keyof ComponentProps<typeof VDataTableServer>]: ComponentProps<typeof VDataTableServer>
    },
    toolbar: {
        search: ComponentProps<typeof VTextField>,
        columnVisibility: {
            items: ComputedRef<any[]>,
            hiddenColumns: ComputedRef<string[]>
            icon: string
            color: Color,
        },
        refresh: {
            loading: ComputedRef<boolean>,
            icon: VBtn['$props']['icon'],
            color: Color,
            onClick: () => void
        },
        filter: {
            icon: VBtn['$props']['icon']
            color: Color,
            onClick: () => void
        },
        fullscreen: {
            icon: ComputedRef<string>,
            color: Color,
            onClick: () => void
        }
    },
    filter: {
        model: Model
    },

}>({
    apiItems: {
        url: computed(() => {
            return $p.url
        }),
        apiOptions: computed(() => {
            const apiOptions = klona($p.apiOptions) || {}

            apiOptions.query = appliedQuery

            return apiOptions
        }),
        itemsKey: computed(() => {
            if (!$p.itemsKey) return undefined
            return $p.itemsKey
        }),
        ssr: computed(() => {
            if (!$p.ssr) return undefined
            return $p.ssr
        })
    },
    datatable: {
        ...$p,
        items: computed(() => {
            if ($p.url) {
                return apiItemsRef.value?.$bind.items
            }
            return $p.items
        }),
        loading: computed(() => {
            if ($p.url) {
                return apiItemsRef.value?.$bind.loading
            }
            return false
        }),
        headers: computed(() => {
            if (!selectedHiddenColumns.value.length) {
                return $p.headers as Headers
            }
            return $p.headers?.filter(header => !selectedHiddenColumns.value.includes(header.value as string))
        }),
        itemsLength: computed(() => {
            if ($p.url) {
                return dot.pick($p.totalResKey, apiItemsRef.value?.$bind.data) || apiItemsRef.value?.$bind.items?.length || 0
            }
            return $p.items?.length || 0
        }),
        itemsPerPage: computed(() => {
            if ($p.url) {
                return dot.pick(String($p.itemsPerPageResKey), apiItemsRef.value?.$bind.data) || $p.itemsPerPage
            }
            return $p.itemsPerPage
        }),
        page: computed(() => {

            return dot.pick(String($p.pageResKey), apiItemsRef.value?.$bind.data) || $p.page
        }),
    },
    toolbar: {
        search: {
            appendInnerIcon: 'mdi-magnify',
            clearable: true,
            hideDetails: true,
            placeholder: 'Search',
            // ...$p.searchProps,
        },
        columnVisibility: {
            items: computed(() => {
                const arr: any[] | undefined = $p.headers?.slice()
                    .map((header) => ({
                        title: header.title,
                        value: header.value,
                    }))
                if (arr) {
                    arr.unshift({
                        type: 'subheader',
                        title: 'Hidden Column\'s',
                    })
                    return arr
                }
                return []
            }),
            hiddenColumns: computed(() => {
                return selectedHiddenColumns.value
            }),
            icon: 'mdi-view-column',
            color: $p.btnsColor as string
        },
        refresh: {
            loading: computed(() => {
                return apiItemsRef.value?.$bind.loading
            }),
            icon: 'mdi-refresh',
            color: $p.btnsColor as string,
            onClick: () => {
                apiItemsRef.value?.refresh()
            },
        },
        filter: {
            icon: 'mdi-filter-plus',
            color: $p.btnsColor as string,
            onClick: showFilter
        },
        fullscreen: {
            icon: computed(() => {
                if (isFullscreen.value) {
                    return 'mdi-fullscreen-exit'
                }
                return 'mdi-fullscreen'
            }),
            color: $p.btnsColor as string,
            onClick: toggle
        }
    },
    filter: {
        model: {

        }
    }
})
const emit = defineEmits<{
    (e: 'update:page', value: string | number): void
    (e: 'update:itemsPerPage', value: string | number): void
}>()
const $on = {
    datatable: {
        'update:page': (value: string | number) => {
            appliedQuery.value.page = value
            emit('update:page', value)
        },
        'update:itemsPerPage': (value: string | number) => {
            appliedQuery.value[p.itemsPerPageReqKey] = value
            emit('update:itemsPerPage', value)
        },

    }

}






</script>