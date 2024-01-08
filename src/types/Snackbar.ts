import type { VSnackbar, VBtn } from 'vuetify/components'
type excludedProps = 'symbol' | '$children'// | 'onVnodeBeforeMount' | 'onVnodeBeforeUnmount' | 'onVnodeBeforeUpdate' | 'onVnodeMounted' | 'onVnodeUnmounted' | 'onVnodeUpdated' | 'onUpdate:modelValue' | 'value' | 'ref' | 'onGroup:selected' | 'v-slot:default' | 'v-slot:append' | 'v-slot:loader' | 'v-slots' 

type VSnackbarProps = Omit<InstanceType<typeof VSnackbar>['$props'], excludedProps>;

type VBtnProps = Omit<InstanceType<typeof VBtn>['$props']['symbol'], excludedProps>

export type SnackbarItem = {
    text: string,
    btns?: SnackbarBtn[],
    _id?: string,
    _timeout?: ReturnType<typeof setTimeout> | null,
} & VSnackbarProps

export type SnackbarBtn = {
    text: string,
    onClick: ({ close }: { close: () => void }) => void;
} & VBtnProps

export type SnackbarFn = (item: SnackbarItem) => void

