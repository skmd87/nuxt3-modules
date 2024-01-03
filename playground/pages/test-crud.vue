<template>
    <v-container>
        <v-card-title>CRUD</v-card-title>
        <v-card-text>
            is open? {{ crudRef?.isOpen }}
            <v-btn color="primary" @click="crudRef?.update({ id: 7 })" class="me-3">Update item</v-btn>

            <v-btn color="primary" @click="crudRef?.create()" class="me-3">Create item</v-btn>

            <v-btn color="primary" :loading="crudRef?.isDeleting" @click="crudRef?.delete({ id: 7 })" class="me-3">Delete
                item</v-btn>
        </v-card-text>
    </v-container>

    <crud :default-item="defaultItem" item-name="product" ref="crudRef" :navigation-drawer-props="{ width: 500 }"
        :handler="useApi" url="https://api.restful-api.dev/objects/:id">
        <template #default="{ item }: { item: Device }">
            <v-text-field v-model="item.name" label="Name"></v-text-field>
        </template>
    </crud>
</template>
<script lang="ts" setup>
import crud from '../../src/runtime/components/crud.vue'

export interface Device {
    id: string;
    name: string;
    data: Data;
}

export interface Data {
    year: number;
    price: number;
    "CPU model": string;
    "Hard disk size": string;
}

const defaultItem: Device = {
    id: '',
    name: '',
    data: {
        year: 0,
        price: 0,
        "CPU model": '',
        "Hard disk size": ''
    }
}

const crudRef = ref<typeof crud | null>(null)
</script> 