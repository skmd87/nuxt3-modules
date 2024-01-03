<template>
    <v-container>
        <v-card-title>Notifications</v-card-title>

        <v-card-text>

        </v-card-text>

        <v-card-actions>
            <v-btn color="success" @click="notify({
                type: 'success',
                title: 'Success',
                text: 'This is a success notification',
                closeOnClick: true,
            })">Success</v-btn>

            <v-btn color="info" @click="notify({
                type: 'info',
                title: 'Info',
                text: 'This is an info notification',
                closeOnClick: true,
            })">Info</v-btn>

            <v-btn color="warning" @click="notify({
                type: 'warning',
                title: 'Warning',
                text: 'This is a warning notification',
                closeOnClick: true,
            })">Warning</v-btn>

            <v-btn color="error" @click="notify({
                type: 'error',
                title: 'Error',
                text: 'This is an error notification',
                closeOnClick: true,
            })">Error</v-btn>
        </v-card-actions>


    </v-container>
    <!-- Should be added in app.vue or in layout -->
    <Notifications />
</template>

<script lang="ts" setup >
const { notify } = useNotification()
</script> 