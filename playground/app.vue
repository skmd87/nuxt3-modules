<template>
    <v-app>
        <v-locale-provider :locale="$i18n.locale" :rtl="$i18n.localeProperties.dir === 'rtl'">
            <v-main>
                <v-row>
                    <v-col cols="12" md="5">
                        <NuxtPage />
                    </v-col>
                    <v-col cols="12" md="7">
                        <source-code />
                    </v-col>
                </v-row>
            </v-main>
            <v-app-bar>
                <v-tabs>
                    <v-tab :to="localePath('/test-crud')">
                        Crud
                    </v-tab>
                    <v-tab :to="localePath('/test-datatable')">
                        Data Table
                    </v-tab>
                    <v-tab :to="localePath('/test-api-items')">
                        Api Items
                    </v-tab>

                    <v-tab :to="localePath('/test-notifications')">
                        Notifications
                    </v-tab>

                    <v-tab :to="localePath('/test-snackbars')">
                        Snackbars
                    </v-tab>

                    <v-tab :to="localePath('/test-event')">
                        Event
                    </v-tab>
                </v-tabs>
                <v-spacer />
                <v-btn-toggle :model-value="$i18n.locale">
                    <v-btn v-for="(locale ) in ($i18n.locales as LocaleObject[])" :key="locale.code" color="primary"
                        :value="locale.code" @click="$i18n.setLocale(locale.code)">
                        {{ locale.code }}
                    </v-btn>
                </v-btn-toggle>
            </v-app-bar>
            <Snackbars variant="elevated" :timeout="1000" />
            <!-- </v-layout> -->
        </v-locale-provider>
    </v-app>
</template>

<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables';

const localePath = useLocalePath()
</script>
