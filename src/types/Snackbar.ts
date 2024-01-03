import { VSnackbar, VBtn } from 'vuetify/components'


export type SnackbarItem = {
    text: string,
    btns?: SnackbarBtn[],
    _id?: string,
    _timeout?: ReturnType<typeof setTimeout> | null,
} & InstanceType<typeof VSnackbar['$props']>

export type SnackbarBtn = {
    text: string,
    onClick: ({ close }: { close: () => void }) => void;
} & InstanceType<typeof VBtn['$props']>

export type SnackbarFn = (item: SnackbarItem) => void

