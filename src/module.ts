import { defineNuxtModule, addPlugin, addComponent, createResolver, addImports, installModule, addTypeTemplate } from '@nuxt/kit'
import type { UseFetchOptions } from 'nuxt/app'
import defu from 'defu'
import { klona } from 'klona'
import messages from './locales'
export type useApiConfig = {
  config?: <T>(options: UseFetchOptions<T>) => UseFetchOptions<T> | UseFetchOptions<T>
}

export type Messages = Record<string, Record<string, string>>  // { [locale: string]: { [key: string]: string } }

// Module options TypeScript interface definition
export interface ModuleOptions {
  crud: boolean,
  datatable: boolean,
  apiItems: boolean,
  messages: Messages,
  notifications: boolean,
  snackbars: boolean,
  events: boolean
  // fcm: false | {
  //   config: FirebaseOptions
  // }
  useApi: useApiConfig
  defaultLocale: keyof ModuleOptions['messages']
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt3-modules',
    configKey: 'nuxt3Modules',
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '^3.0.0'
    }
  },
  // Default configuration options of the Nuxt module
  defaults: {
    crud: false,
    datatable: false,
    apiItems: false,
    notifications: false,
    snackbars: false,
    events: false,
    // fcm: false,
    useApi: {},
    messages,
    defaultLocale: 'en'
  },
  async setup(options: ModuleOptions, nuxt) {

    nuxt.options.runtimeConfig.public.nuxt3Modules = defu(nuxt.options.runtimeConfig.public.nuxt3Modules, klona(options))

    const resolver = createResolver(import.meta.url)

    let isVuetifyRequired = false

    if (options.crud) {

      isVuetifyRequired = true
      addComponent({
        filePath: resolver.resolve('./runtime/components/crud.vue'),
        name: 'crud',
      })
    }

    if (options.apiItems) {
      isVuetifyRequired = true
      addComponent({
        filePath: resolver.resolve('./runtime/components/api-items.vue'),
        name: 'api-items',
      })
    }

    if (options.notifications) {

      await installModule('nuxt3-notifications', {
        componentName: 'nuxt-notifications',
      })

      addComponent({
        filePath: resolver.resolve('./runtime/components/notifications.vue'),
        name: 'notifications',
      })

    }

    if (options.snackbars) {
      addComponent({
        filePath: resolver.resolve('./runtime/components/snackbars.vue'),
        name: 'snackbars',
      })
      addPlugin(resolver.resolve('./runtime/plugins/Snackbar'))
      addImports({
        name: 'useSnackbar',
        as: 'useSnackbar',
        from: resolver.resolve('./runtime/composables/useSnackbar'),
      })
    }

    if (options.events) {
      addPlugin(resolver.resolve('./runtime/plugins/Event'))
      addImports({
        name: 'useEvent',
        as: 'useEvent',
        from: resolver.resolve('./runtime/composables/useEvent'),
      })
      addTypeTemplate({
        src: resolver.resolve('./types/#Nuxt3Modules.d.ts'),
        filename: '#Nuxt3Modules.d.ts',
        options: {}
      })

    }

    if (options.datatable) {
      isVuetifyRequired = true
      addComponent({
        filePath: resolver.resolve('./runtime/components/datatable.vue'),
        name: 'datatable',
      })
    }

    addImports({
      name: 'useApi',
      as: 'useApi',
      from: resolver.resolve('./runtime/composables/useApi'),
    })



    //! TBD: check if vuetify is loaded as crud depends on it
  }
})
