import { defineNuxtPlugin } from '#app'
import vApiItemsDirective from '../directives/ApiItems'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('api-items', vApiItemsDirective)
})
