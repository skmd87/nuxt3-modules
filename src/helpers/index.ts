import type { NuxtApp } from "@nuxt/schema"
import { useNuxtApp } from "#app"
import type { Messages } from "../module"

const replaceParams = (str: string, params?: Record<string, string>) => {
    if (!params) {
        return str;
    }
    const regex = /{([^}]+)}/g;

    // Replace each key with its value
    return str.replace(regex, (match, key) => {
        return params[key.trim()] || match;
    });
}

export const t = (key: string, params?: Record<string, string>): string => {
    const ctx = useNuxtApp() as unknown as NuxtApp & { $i18n: any }
    if (ctx.$i18n && ctx.$i18n.te(`$nuxt3Modules.${key}`)) {
        return ctx.$i18n.t(key, params)
    }
    // get translation from config
    const config = useRuntimeConfig().public.nuxt3Modules
    const locale: keyof typeof config.messages = ctx.$i18n.locale.value || config.defaultLocale
    
    if (config && (config.messages as Messages)?.[locale]?.[key]) {
        return replaceParams((config.messages as Messages)[locale][key], params);
    } else {
        return key;
    }

}