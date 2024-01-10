export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '../src/module'
  ],
  nuxt3Modules: {
    crud: true,
    datatable: {
      totalReqKey: 'total',
      totalResKey: 'total',
      itemsPerPage: 10,
      itemsPerPageReqKey: 'per_page',
      itemsPerPageResKey: 'per_page',
      pageReqKey: 'page',
      pageResKey: 'page',
      btnsColor: 'primary',
    },
    apiItems: true,
    useApi: {
      config(options) {
        return {
          ...options,
          baseURL: 'https://api.nuxtjs.com'
        }
      },
    },
    notifications: true,
    snackbars: true,
    // pass Event type to module
    events: true
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', dir: 'ltr' },
      { code: 'ar', iso: 'ar-AR', file: 'ar.json', dir: 'rtl' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    langDir: 'i18n'

  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  vuetify: {
    vuetifyOptions: {
      // localeMessages: {
      //   // en: 
      // }
    }
  },

})