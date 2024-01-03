<template>
    <v-container>
        <v-card-title>FCM</v-card-title>

        <v-card-text>

        </v-card-text>

        <v-card-actions>
            <v-btn color="success" @click="">Register</v-btn>


        </v-card-actions>


    </v-container>
    <!-- Should be added in app.vue or in layout -->
    <Notifications />
</template>
<script lang="ts" setup >
const { notify } = useNotification()




</script> 