<template>
    <v-container>
        <v-card-title>Snackbars</v-card-title>

        <div>
            <v-btn v-for="item in snackbarsButtons" :key="item.btnText" block variant="elevated" class="my-2"
                color="success" @click="snackbar(item.snackbar)">{{ item.btnText }}</v-btn>
        </div>

    </v-container>
    <!-- Should be added in app.vue or in layout -->
    <!-- <Snackbars :timeout="1000" /> -->
</template>

<script lang="ts" setup >
import { type SnackbarItem } from '../../src/types/Snackbar';

const snackbar = useSnackbar()

type DemoButtons = {
    btnText: string;
    snackbar: SnackbarItem;
}

const snackbarsButtons: DemoButtons[] = [
    {
        btnText: 'message with two buttons',
        snackbar: {
            text: 'Data entered is invalid. Please try again.',
            timeout: 5000,
            btns: [
                {
                    text: 'Close',
                    onClick: ({ close }) => { close() },
                },
                {
                    text: 'Try Again',
                    onClick: () => { alert('Try Again') },
                },
            ],
        }
    },
    {
        btnText: 'message with two buttons (Vertical)',
        snackbar: {
            text: 'Request Successful',
            vertical: true,
            btns: [
                {
                    text: 'Close',
                    onClick: ({ close }: { close: () => void }) => { close() },
                },
                {
                    text: 'Try Again',
                    onClick: () => { alert('Try Again') },
                },
            ],
        },
    },
    {
        btnText: 'top center message with timeout',
        snackbar: {
            text: 'Request Failed',
            timeout: 10000,
            location: 'top center',
            transition: 'slide-y-reverse-transition',
        },
    },
    {
        btnText: 'message with default timeout and no close on click',
        snackbar: {
            text: 'You have been logged out. Please log in again.',

        }
    },

    {
        btnText: 'message with no timeout and no close on click',
        snackbar: {
            text: 'You have been logged out. Please log in again.',
            timeout: -1,
        }
    }
]


</script> 