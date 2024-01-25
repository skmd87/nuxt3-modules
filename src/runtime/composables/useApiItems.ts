import { type UseFetchOptions, useFetch, useCookie } from '#app'
import { useApi } from "./useApi";
import { reactive, toRaw, type Ref, onMounted, shallowReactive, } from "#imports"

export function useApiItems<T>(url: string | (() => string), options?: UseFetchOptions<T>) {
    const returnObject = shallowReactive<{
        items: T[],
        loading: boolean,
    }>({
        items: [],
        loading: false,
    })

    returnObject.loading = true
    useApi<T>(url, options).then(({ data, error }) => {
        if (error.value) {

        } else if (data.value) {
            // @ts-ignore
            returnObject.items = data.value
        }
        returnObject.loading = false
    })

    return (returnObject)
}