<template>
    <v-app>
        <v-app-bar app dark>
            <div class="d-flex align-center">
                <v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="@/assets/btc.png"
                    transition="scale-transition"
                    width="40"
                />

                <span class="mr-2">나는 100억 부자될거야</span>
            </div>

            <v-spacer></v-spacer>

            <v-btn
                href="https://github.com/vuetifyjs/vuetify/releases/latest"
                target="_blank"
                text
            >
                <span class="mr-2">Latest Release</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <Dashboard />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Dashboard from '@/components/Dashboard.vue'

export default Vue.extend({
    name: 'App',
    components: {
        Dashboard,
    },

    data: () => ({
        //
    }),
})
</script>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-calendars/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-navigations/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material-dark.css';
@import '../node_modules/@syncfusion/ej2-vue-grids/styles/material-dark.css';
</style>
