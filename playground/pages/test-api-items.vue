<template>
    <v-container>
        <v-card-title>API Items</v-card-title>

        <v-card-text>
            <api-items v-slot="props" url="https://api.restful-api.dev/objects">
                <v-select label="Select" item-title="name" item-value="id" v-bind="props"></v-select>
            </api-items>

            <api-items v-slot="props" url="https://api.restful-api.dev/objects">
                <v-autocomplete label="Autocomplete" item-title="name" item-value="id" v-bind="props"></v-autocomplete>
            </api-items>

            <api-items v-slot="props" url="https://api.restful-api.dev/objects">
                <v-combobox label="Combobox" item-title="name" item-value="id" v-bind="props"></v-combobox>
            </api-items>

            <api-items v-slot="props" url="https://api.restful-api.dev/objects/false-api">
                <v-select label="Error" item-title="name" item-value="id" v-bind="props"></v-select>
            </api-items>
        </v-card-text>


    </v-container>
</template>
<script lang="ts" setup >

</script> 