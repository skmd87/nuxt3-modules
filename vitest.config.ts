import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig ({
    // plugins: [vue()],
    test: {
        globals: true,
        // environment: 'jsdom',
        server: {
            deps: {
                inline: ['vuetify'],
            },
        },
        alias: [{ find: "@", replacement: resolve(__dirname) }],

    },
})