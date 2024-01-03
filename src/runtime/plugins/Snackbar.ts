
import { defineNuxtPlugin } from "#app";
import { useEvent } from '../composables/useEvent'
import type { SnackbarItem, SnackbarFn } from '../../types/Snackbar'
declare module "#app" {
    interface NuxtApp {
        $snackbar: SnackbarFn;
    }
}
declare module "#Nuxt3Modules" {
    interface Events {
        snackbar: SnackbarItem;
    }
}
export default defineNuxtPlugin(() => {

    const { emit } = useEvent()

    const snackbar: SnackbarFn = (item: SnackbarItem) => {
        emit('snackbar', item)
    }
    return {
        provide: {
            snackbar
        },
    };
});
