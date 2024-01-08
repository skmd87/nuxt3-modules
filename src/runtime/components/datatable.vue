<template>
    <api-items ref="apiItemsRef" v-bind="$bind.apiItems">
        <v-data-table ref="vDataTableRef" v-bind="$bind.datatable">
            <template #top="{ }">
                <v-toolbar color="transparent" density="compact">
                    <v-text-field ref="searchRef" v-bind="$bind.search" v-model="searchModel" />
                    <v-spacer />
                    <slot name="toolbar.column-Visibility" v-bind="$bind.columnVisibility">
                        <v-btn v-bind="$bind.columnVisibility">
                            <v-menu activator="parent" close-on-back :close-on-content-click="false">
                                <v-list v-model:selected="selectedHiddenColumns" density="compact" slim
                                    :items="$bind.columnVisibility.items" select-strategy="classic">

                                    <template v-slot:append="{ isActive }">
                                        <v-list-item-action end>
                                            <v-switch class="ms-8" hide-details density="compact" color="primary"
                                                :model-value="isActive" />
                                        </v-list-item-action>
                                    </template>

                                </v-list>
                            </v-menu>
                            <v-icon>{{ $bind.columnVisibility.icon }}</v-icon>
                        </v-btn>
                    </slot>

                </v-toolbar>
                {{ appliedFilters }}
            </template>
            <template v-for="(_, name) in ($slots as VDataTableSlots | {})" v-slot:[name]="slotData">
                <slot :name="name" v-bind="{ ...slotData }"></slot>
            </template>
            <template v-slot:loading>
                <v-skeleton-loader :type="`table-row@${p.itemsPerPage}`"></v-skeleton-loader>
            </template>
        </v-data-table>
    </api-items>
    {{ $bind.apiItems }}
    <v-navigation-drawer v-model="navigationDrawerModel" location="start" temporary>
        <template #prepend>
            <v-card-title> Filter</v-card-title>
        </template>
        <v-card-text>
            <slot name="filter" v-bind="$bind.filter" />
        </v-card-text>
        <template #append>
            <v-card-actions>
                <v-btn @click="resetFilter">Reset</v-btn>
                <v-spacer />
                <v-btn color="primary" @click="applyFilter">Apply</v-btn>

            </v-card-actions>
        </template>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { VDataTable, VTextField, VBtn, VList } from 'vuetify/components';
import { useStorage } from '@vueuse/core'
import { klona } from 'klona';
import ApiItems, { type ApiItemsProps } from './api-items.vue'
import { type PropType, computed, ref, reactive, watch, useSlots } from '#imports';
type Computed<T> = ReturnType<typeof computed<T>>
// type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ApiOptions = ApiItemsProps['apiOptions']
export type Headers = VDataTable['$props']['headers']
export type CellProps = VDataTable['$props']['cellProps']
export type Color = VDataTable['$props']['color']
export type CustomFilter = VDataTable['$props']['customFilter']
export type CustomKeyFilter = VDataTable['$props']['customKeyFilter']
export type CustomKeySort = VDataTable['$props']['customKeySort']
export type Density = VDataTable['$props']['density']
export type Expanded = VDataTable['$props']['expanded']
export type ExpandOnClick = VDataTable['$props']['expandOnClick']
export type FilterKeys = VDataTable['$props']['filterKeys']
export type FilterMode = VDataTable['$props']['filterMode']
export type FirstIcon = VDataTable['$props']['firstIcon']
export type FirstPageLabel = VDataTable['$props']['firstPageLabel']
export type FixedFooter = VDataTable['$props']['fixedFooter']
export type FixedHeader = VDataTable['$props']['fixedHeader']
export type GroupBy = VDataTable['$props']['groupBy']
export type Height = VDataTable['$props']['height']
export type HideNoData = VDataTable['$props']['hideNoData']
export type Hover = VDataTable['$props']['hover']
export type ItemSelectable = VDataTable['$props']['itemSelectable']
export type ItemsPerPage = VDataTable['$props']['itemsPerPage']
export type ItemsPerPageOptions = VDataTable['$props']['itemsPerPageOptions']
export type ItemsPerPageText = VDataTable['$props']['itemsPerPageText']
export type ItemValue = VDataTable['$props']['itemValue']
export type LastIcon = VDataTable['$props']['lastIcon']
export type LastPageLabel = VDataTable['$props']['lastPageLabel']
export type Loading = VDataTable['$props']['loading']
export type LoadingText = VDataTable['$props']['loadingText']
export type ModelValue = VDataTable['$props']['modelValue']
export type MultiSort = VDataTable['$props']['multiSort']
export type MustSort = VDataTable['$props']['mustSort']
export type NextIcon = VDataTable['$props']['nextIcon']
export type NextPageLabel = VDataTable['$props']['nextPageLabel']
export type NoDataText = VDataTable['$props']['noDataText']
export type NoFilter = VDataTable['$props']['noFilter']
export type Page = VDataTable['$props']['page']
export type PageText = VDataTable['$props']['pageText']
export type PrevIcon = VDataTable['$props']['prevIcon']
export type PrevPageLabel = VDataTable['$props']['prevPageLabel']
export type ReturnObject = VDataTable['$props']['returnObject']
export type RowProps = VDataTable['$props']['rowProps']
export type Search = VDataTable['$props']['search']
export type SelectStrategy = VDataTable['$props']['selectStrategy']
export type ShowCurrentPage = VDataTable['$props']['showCurrentPage']
export type ShowExpand = VDataTable['$props']['showExpand']
export type ShowSelect = VDataTable['$props']['showSelect']
export type SortAscIcon = VDataTable['$props']['sortAscIcon']
export type SortBy = VDataTable['$props']['sortBy']
export type SortDescIcon = VDataTable['$props']['sortDescIcon']
export type Sticky = VDataTable['$props']['sticky']
export type Theme = VDataTable['$props']['theme']
export type ValueComparator = VDataTable['$props']['valueComparator']
export type Width = VDataTable['$props']['width']

export type VDataTableSlots = VDataTable['$slots']
export type Model = Record<string, any>
export type ToolbarSlots = Readonly<{
    'toolbar.column-Visibility'(props: {
        items: any[]
    }): any
}>
export type FilterSlots = Readonly<{
    filter(props: {
        model: Model
    }): any
}>
export type Slots = VDataTableSlots & ToolbarSlots & FilterSlots

defineOptions({
    inheritAttrs: false
})

defineSlots<Slots>()

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
    customFilter: {
        type: Function as PropType<CustomFilter>,
        required: false,
        default: undefined
    },
    customKeyFilter: {
        type: Object as PropType<CustomKeyFilter>,
        required: false,
        default: undefined
    },
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
    filterKeys: {
        type: Array as PropType<FilterKeys>,
        required: false,
        default: undefined
    },
    filterMode: {
        type: String as PropType<FilterMode>,
        required: false,
        default: undefined
    },
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
    noFilter: {
        type: Boolean as PropType<NoFilter>,
        required: false,
        default: undefined
    },
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
    }

})

const computedStorageKey = computed(() => {
    return `Nuxt3Modules.table.headers:${p.tableStorageKey || p.url || 'default'}`
})

const columnVisibilityStorageState = useStorage<string[]>(computedStorageKey.value, [])
const slots = useSlots()


const apiItemsRef = ref<typeof ApiItems | null>()
const vDataTableRef = ref<typeof VDataTable | null>()
const searchRef = ref<typeof VTextField | null>()

const searchModel = ref<string>('')
const navigationDrawerModel = ref<boolean>(false)
const selectedHiddenColumns = ref<string[]>([...columnVisibilityStorageState.value])

watch(() => selectedHiddenColumns.value, (value) => {
    columnVisibilityStorageState.value = value
}, { deep: true })

const hasFilter = computed(() => {
    return !!slots.filter
})

const appliedFilters = ref<Model>({})


const showFilter = () => {
    navigationDrawerModel.value = true
}

const closeFilter = () => {
    navigationDrawerModel.value = false
}

const applyFilter = () => {
    appliedFilters.value = klona($bind.filter.model)
    closeFilter()
}

const resetFilter = () => {
    appliedFilters.value = {}
    closeFilter()
}


const defaultSearchProps = computed(() => {
    const props: VTextField['$props'] = {
        appendInnerIcon: 'mdi-magnify',
        clearable: true,
        hideDetails: true,
        placeholder: 'Search'
    }
    if (hasFilter.value) {
        props.prependIcon = 'mdi-filter'
        props['onClick:prepend'] = showFilter
    }
    return props

})

// const apiItemsProps = computed(() => {
//     return {
//         url: p.url,
//         apiOptions: p.apiOptions,
//         itemsKey: p.itemsKey,
//         ssr: p.ssr
//     }
// })

const $bind = reactive<{
    apiItems: {
        url: Computed<ApiItemsProps['url']>,
        apiOptions: Computed<ApiItemsProps['apiOptions']>,
        itemsKey: Computed<ApiItemsProps['itemsKey']>,
        ssr: Computed<ApiItemsProps['ssr']>
    },
    datatable: {
        items: Computed<VList['$props']['items']>

        loading: Computed<boolean>,
        headers: Computed<Headers>
    },
    search: VTextField['$props'],
    columnVisibility: {
        items: Computed<any[]>,
        hiddenColumns: Computed<string[]>
        icon: string
    }
    filter: {
        model: Model
    }
}>({
    apiItems: {
        url: computed(() => {
            return p.url
        }),
        apiOptions: computed(() => {
            const appliedFiltersKeys: string[] = Object.keys(appliedFilters.value)
            const hasFilterModels: boolean = !!appliedFiltersKeys.length
            const apiOptions = klona(p.apiOptions) || {}
            if (hasFilterModels) {
                apiOptions.query = computed(() => {
                    return appliedFilters.value
                })
                apiOptions.key = p.url + JSON.stringify(appliedFilters.value)
            }

            return apiOptions
        }),
        itemsKey: computed(() => {
            return p.itemsKey
        }),
        ssr: computed(() => {
            return p.ssr
        })
    },
    datatable: {
        items: computed(() => {
            if (p.url) {
                return apiItemsRef.value?.$bind.items
            }
            return p.items
        }),
        loading: computed(() => {
            if (p.url) {
                return apiItemsRef.value?.$bind.loading
            }
            return false
        }),
        headers: computed(() => {
            if (!selectedHiddenColumns.value.length) {
                return p.headers
            }
            return p.headers?.filter(header => !selectedHiddenColumns.value.includes(header.value as string))
        })
    },
    search: {
        ...defaultSearchProps.value,
        ...p.searchProps,
    },
    columnVisibility: {
        items: computed(() => {
            const arr: any[] | undefined = p.headers?.slice()
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
        icon: 'mdi-view-column'
    },
    filter: {
        model: {

        }
    }
})




</script>