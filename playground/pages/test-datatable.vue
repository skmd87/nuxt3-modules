<template>
    <v-container>
        <v-card-title>Datatable</v-card-title>

        <v-card-text>
            <datatable items-key="data" url="https://reqres.in/api/users" :headers="headers">
                <template #item.avatar="{ value }">
                    <v-avatar :image="value" />
                </template>
                <template #filter="{ model }">
                    <v-text-field v-model="model.username" />
                </template>
                <template #toolbar.column-Visibility="{ }"></template>
            </datatable>
        </v-card-text>
    </v-container>
</template>

<script lang="ts" setup >
import { type Headers } from '../../src/runtime/components/datatable.vue'

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

const headers: Headers = [
    {
        title: 'ID',
        value: 'id',
    },
    {
        title: 'Email',
        value: 'email'
    },
    {
        title: 'First Name',
        value: 'first_name'
    },
    {
        title: 'Last Name',
        value: 'last_name'
    },
    {
        title: 'Avatar',
        value: 'avatar'
    },
]
</script> 