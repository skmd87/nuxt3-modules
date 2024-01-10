import { type UseFetchOptions, useFetch, useCookie } from '#app'
import { defu } from 'defu'
import type { ModuleOptions } from '~/src/module'

export function useApi<T>(url: string | (() => string), options: UseFetchOptions<T> = {}): ReturnType<typeof useFetch<T>> {
    const userAuth = useCookie('token')
    const config = useRuntimeConfig()
    const nuxt3ModulesConfig = config.public.nuxt3Modules as ModuleOptions

    const defaults: UseFetchOptions<T> = {
        // this overrides the default key generation, which includes a hash of
        // url, method, headers, etc. - this should be used with care as the key
        // is how Nuxt decides how responses should be deduplicated between
        // client and server

        // key: url instanceof Function ? url() : url, // this caused all imports of useApi to be connected

        // set user token if connected
        headers: userAuth.value
            ? { Authorization: `Bearer ${userAuth.value}` }
            : {},

        onResponse(_ctx) {
            // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
        },

        onResponseError(_ctx) {
            // throw new myBusinessError()
        }
    }

    let parsedConfig = {};

    if (typeof nuxt3ModulesConfig.useApi === 'object') {
        if (typeof nuxt3ModulesConfig.useApi.config === 'function') {
            parsedConfig = nuxt3ModulesConfig.useApi.config(options)
        } else if (typeof nuxt3ModulesConfig.useApi.config === 'object') {
            parsedConfig = nuxt3ModulesConfig.useApi.config
        }

    }


    const params = defu(parsedConfig, options, defaults)

    return useFetch(url, params)
}
