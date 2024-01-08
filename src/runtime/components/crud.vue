<template>
    <ClientOnly>
        <v-navigation-drawer v-model="drawerModel" tag="div" temporary class="crud" v-bind="computedNavigationDrawerProps"
            @update:model-value="navigationDrawerUpdateHandler">
            <template #prepend>
                <v-card-title>
                    <v-skeleton-loader :loading="isGetting" type="heading">
                        <slot v-bind="$titleSlot" name="title">{{ title }}</slot>
                        <v-spacer />
                        <slot name="title-actions" v-bind="$titleSlot">
                            <v-btn variant="plain" :icon="closeIcon" @click="close" />
                        </slot>
                    </v-skeleton-loader>
                </v-card-title>
            </template>

            <v-card-text>
                <v-skeleton-loader type="paragraph@3" :loading="isGetting">
                    <slot v-if="hasGettingError" name="error" v-bind="{ error: hasGettingError }">
                        <v-banner stacked lines="three" icon="mdi-alert-circle-outline">
                            <template #prepend>
                                <v-icon color="error">mdi-alert-circle</v-icon>
                            </template>
                            <div>
                                <div><b>{{ t('crud.error-while-getting') }}</b></div>
                                {{ hasGettingError }}
                            </div>
                            <template #actions>
                                <v-btn variant="plain" @click="close">{{ t('crud.cancel') }}</v-btn>
                                <v-btn variant="text" color="primary" :loading="$actionsSlot.isSaving" @click="save">
                                    {{ t('crud.retry') }}
                                </v-btn>
                            </template>
                        </v-banner>
                    </slot>
                    <v-form v-else ref="mainForm" class="d-flex flex-column flex-grow-1">
                        <slot v-bind="$defaultSlot" />
                    </v-form>
                </v-skeleton-loader>
            </v-card-text>


            <template #append>
                <v-skeleton-loader :loading="isGetting" type="actions">
                    <v-card-actions class="flex-grow-1">
                        <slot v-if="!hasGettingError" name="actions" v-bind="$actionsSlot">
                            <v-btn variant="text" @click="close">{{ t('crud.cancel') }}</v-btn>
                            <v-spacer />
                            <v-btn variant="text" color="primary" :loading="$actionsSlot.isSaving" @click="save">
                                {{ t('crud.save') }}
                            </v-btn>
                        </slot>
                    </v-card-actions>
                </v-skeleton-loader>
            </template>
        </v-navigation-drawer>

    </ClientOnly>
</template>

<script  lang="ts" setup>
import { VNavigationDrawer, VForm, VCardActions, VCardText, VCardTitle, VBtn, VSpacer, VSkeletonLoader, VBanner } from 'vuetify/components'
import { normalizeURL } from 'ufo'
import { t } from '../../helpers'
import { useApi } from '../composables/useApi'
import { useSnackbar } from '../composables/useSnackbar';
import { ref, type PropType, computed, reactive, toRaw } from '#imports';
import type { SnackbarItem } from '~/src/types/Snackbar';

type URLVars = Record<string, string | number>

const p = defineProps({
    navigationDrawerProps: {
        type: Object as PropType<InstanceType<typeof VNavigationDrawer>['$props']>,
        default: () => ({})
    },
    skeletonLoaderProps: {
        type: Object as PropType<InstanceType<typeof VSkeletonLoader>['$props']>,
        default: () => ({})
    },
    itemName: {
        type: String,
        required: true
    },
    handler: {
        type: Function as PropType<typeof useApi>,
        default: useApi
    },
    createMapper: {
        type: Function as PropType<(item: any) => any>,
        default: (item: any) => item
    },
    updateMapper: {
        type: Function as PropType<(item: any) => any>,
        default: (item: any) => item
    },
    url: {
        type: [String, Boolean, Function] as PropType<string | false | (() => string | false)>,
        default: '',
    },
    get: {
        type: [String, Boolean, Function] as PropType<string | false | (() => string | false)>,
        default: ''
    },
    post: {
        type: [String, Boolean, Function] as PropType<string | false | (() => string | false)>,
        default: ''
    },
    put: {
        type: [String, Boolean, Function] as PropType<string | false | (() => string | false)>,
        default: ''
    },
    delete: {
        type: [String, Boolean, Function] as PropType<string | false | (() => string | false)>,
        default: ''
    },
    defaultItem: {
        type: Object as PropType<any>,
        default: () => ({} as any)
    },
    closeIcon: {
        type: String,
        default: 'mdi-close'
    },
    disableFeedback: {
        type: Boolean,
        default: false
    }
})

const snackbar = useSnackbar()

const mainForm = ref<InstanceType<typeof VForm>>()

const isGetting = ref(false)

const title = computed(() => {
    return isCreateAction.value ? t('crud.create-item', { itemName: p.itemName }) : t('crud.update-item', { itemName: p.itemName })
})

const hasGettingError = ref<false | string>(false)

const defaultNavigationDrawerProps: InstanceType<typeof VNavigationDrawer>['$props'] = {
    width: 500,
    temporary: true,
    absolute: true,
    order: -1
}

const computedNavigationDrawerProps = computed(() => {
    return {
        ...defaultNavigationDrawerProps,
        ...p.navigationDrawerProps
    }
})

const getURLAddressByMethod = (method: 'get' | 'post' | 'put' | 'delete'): string | false => {
    if (typeof p[method] === 'function') {
        const methodFn = p[method] as () => string | false; // Type assertion to specify the correct function signature
        let url = methodFn();
        if (typeof url === 'string') {
            url = normalizeURL(url);
        }
        return url;
    }

    if (typeof p[method] === 'string' && p[method]) {
        const methodStr = p[method] as string;
        return normalizeURL(methodStr);
    }

    if (typeof p.url === 'function') {
        let url = p.url()
        if (typeof url === 'string') {
            url = normalizeURL(url);
        }
        return url
    }

    if (typeof p.url === 'string' && p.url) {
        return normalizeURL(p.url)
    }
    return false
}

const parseURL = (method: Parameters<typeof getURLAddressByMethod>[0], URLVars: URLVars = {}): false | string => {
    let url = getURLAddressByMethod(method)

    if (!url) {
        return false
    }

    const vars = Object.keys(URLVars)

    if (vars.length) {
        return vars.reduce((acc, key) => {
            return acc.replace(`:${key}`, String(URLVars[key]))
        }, url)
    }

    // remove any words that starts with :
    url = url.replace(/\/:[^/]+/g, '')

    return url
}

const emit = defineEmits(['closed', 'opened', 'updated', 'created', 'deleted', 'loaded', 'error', 'feedback'])

const action = ref<'create' | 'update'>('create')

const isCreateAction = computed(() => {
    return action.value === 'create'
})

const isUpdateAction = computed(() => {
    return action.value === 'update'
})

const isDeleting = ref(false)

const isCreating = computed(() => {
    return isCreateAction.value && $actionsSlot.isSaving
})

const isUpdating = computed(() => {
    return isUpdateAction.value && $actionsSlot.isSaving
})

const drawerModel = ref(false)

const currentURLVars = ref<URLVars>({})

const navigationDrawerUpdateHandler = (val: boolean) => {
    if (val === false) {
        reset()
    }
}

const reset = () => {
    currentURLVars.value = {}
    hasGettingError.value = false
    isGetting.value = false
    mainForm.value?.reset()
    mainForm.value?.resetValidation()
    $defaultSlot.item = { ...p.defaultItem }
}

const openForCreate = (urlVars: URLVars = {}) => {
    currentURLVars.value = urlVars
    action.value = 'create'
    drawerModel.value = true
}

const openForUpdate = (urlVars: URLVars = {}) => {
    currentURLVars.value = urlVars
    action.value = 'update'
    drawerModel.value = true
    const url = parseURL('get', urlVars)
    if (url) {
        isGetting.value = true
        p.handler(url, {
            method: 'GET'
        })
            .then(({ data, error }) => {
                if (error.value) {
                    hasGettingError.value = error.value?.message || error.value?.toString() || t('crud.unknown-error')
                    emit('error', error.value)
                } else {
                    $defaultSlot.item = data.value
                    emit('loaded', data.value)
                }

                isGetting.value = false
            })

    }
}

const del = async (urlVars: URLVars = {}) => {
    const url = parseURL('delete', urlVars)

    if (url) {
        isDeleting.value = true
        await p.handler(url, {
            method: 'DELETE'
        }).then(({ error }) => {
            if (error.value) {
                feedback({
                    text: error.value?.message || error.value?.toString() || t('crud.unknown-error'),
                    timeout: -1,
                    timer: 'error',
                    btns: [
                        {
                            text: t('crud.retry'),
                            color: 'primary',
                            onClick: ({ close }) => {
                                del(urlVars)
                                close()
                            },

                        },
                        {
                            text: t('crud.cancel'),
                            color: 'white',
                            onClick: ({ close }) => {
                                close()
                            },
                        }
                    ]
                })
            } else {
                emit('deleted', urlVars)
            }

            isDeleting.value = false
        })
    }
}

const save = () => {
    if (!mainForm.value?.validate()) {
        return
    }
    const method = isCreateAction.value ? 'POST' : 'PUT'
    const mapper = isCreateAction.value ? p.createMapper : p.updateMapper
    const body = mapper(toRaw($defaultSlot.item))
    $actionsSlot.isSaving = true

    const url = (isCreateAction.value ? parseURL('post', currentURLVars.value) : parseURL('put', currentURLVars.value)) as string | false

    if (url) {
        console.log("url", url, method)
        p.handler(url, {
            method,
            body
        }).then(({ data, error }) => {
            if (error.value) {
                emit('error', error.value)
                feedback({
                    text: error.value?.message || error.value?.toString() || t('crud.unknown-error'),
                    timeout: -1,
                    timer: 'error',
                    _id: 'crud-save-error',
                    btns: [
                        {
                            text: t('crud.retry'),
                            color: 'primary',
                            onClick: ({ close }) => {
                                save()
                                close()
                            },

                        },
                        {
                            text: t('crud.cancel'),
                            color: 'white',
                            onClick: ({ close }) => {
                                close()
                            },
                        }
                    ]
                })
            } else {
                emit(isCreateAction.value ? 'created' : 'updated', data.value)
                close()
                setTimeout(() => {
                    reset()
                }, 300)
            }
            $actionsSlot.isSaving = false
        })
    }
}

const close = () => {
    drawerModel.value = false
    reset()
    emit('closed')
}

const feedback = (payload: SnackbarItem) => {
    if (p.disableFeedback) return
    snackbar(payload)
    emit('feedback', payload)
}

const isOpen = computed(() => {
    return drawerModel.value
})

const $defaultSlot = reactive({
    item: p.defaultItem as any,
    isCreateAction,
    isUpdateAction,
})

const $actionsSlot = reactive({
    close,
    save,
    isSaving: false
})

const $titleSlot = reactive({
    itemName: p.itemName,
    isCreateAction,
    isUpdateAction,
    item: $defaultSlot.item,
    close,
    save,
})


defineExpose({
    create: openForCreate,
    update: openForUpdate,
    delete: del,
    close,
    isOpen,
    isDeleting,
    isCreating,
    isUpdating,
})
</script>