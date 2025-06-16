<template>
  <q-layout view="hHh lpr fFf" class="main-layout">
    <q-header>
      <layout-header />
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
import LayoutHeader from '/src/layout/LayoutHeader.vue';
import LayoutFooter from '/src/layout/LayoutFooter.vue';
</script>

<style scoped>
.main-layout {
  height: 100vh;
}
</style>
