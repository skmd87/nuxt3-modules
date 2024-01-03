<template>
    <v-container>
        <v-card-title>Events</v-card-title>

        <v-card-text>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" variant="elevated" @click="emit('test-event', 'from useEvent')">Send Event</v-btn>
            <v-btn color="primary" variant="elevated" @click="$emit('test-event', 'from useNuxtApp')">Send Event (from
                useNuxtApp)</v-btn>
        </v-card-actions>
    </v-container>
</template>

<script lang="ts" setup >
// declare module "#Nuxt3Modules" {
//     interface Events {
//         'test-event': string;
//     }
// }
const { emit, on } = useEvent()

const { $emit } = useNuxtApp()

on('test-event', (v: string) => alert(`test-event received ${v}`))

</script> 