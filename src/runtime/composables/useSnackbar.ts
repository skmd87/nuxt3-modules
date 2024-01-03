import { useNuxtApp } from "#app";

export function useSnackbar() {
    const { $snackbar } = useNuxtApp();
    return $snackbar;
}