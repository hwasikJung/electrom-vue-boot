<template>
  <q-layout view="hHh lpr fFf" class="main-layout">
    <q-header>
      <layout-header />
      <layout-gnb :isLoggedIn="isLoggedIn" :userRoles="userRoles" />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <layout-footer />
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import LayoutHeader from '@/layout/LayoutHeader.vue';
import LayoutFooter from '@/layout/LayoutFooter.vue';
import LayoutGnb from '@/layout/LayoutGnb.vue';

const isLoggedIn = ref(true);
const userRoles = ref(['admin', 'user']);
</script>

<style scoped>
.main-layout {
  height: 100vh;
}
</style>
