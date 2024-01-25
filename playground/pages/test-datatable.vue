<template>
    <v-container>
        <v-card-title>Datatable</v-card-title>
        <v-card-text>
            <!-- EXAMPLE 1 -->
            <datatable items-key="data" items-per-page="5" items-per-page-req-key="per_page"
                items-per-page-res-key="per_page" total-req-key="total" total-res-key="total" page-req-key="page"
                page-res-key="page" url="https://reqres.in/api/users" :headers="headers" item-selectable>
                <template #item.avatar="{ value }">
                    <v-avatar :image="value" />
                </template>
                <template #filter="{ model }">
                    <v-text-field v-model="model.username" label="Username" />
                </template>
            </datatable>
        </v-card-text>
        <v-card-title>Datatable (With Defaults Provider)</v-card-title>
        <v-card-text>
            <!-- EXAMPLE 2 (check nuxt.config.ts also)-->
            <defaults-provider :datatable="{ searchKey: 'q', }">
                <div class="just-a-normal-div">
                    <datatable items-key="data" url="https://reqres.in/api/users" :headers="headers" />
                </div>
            </defaults-provider>
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
    {
        title: '',
        value: 'data-table-select',
    },
]
</script> 