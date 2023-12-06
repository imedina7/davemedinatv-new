<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import { routes } from "@/router";
</script>

<template>
  <NavBar :navigation="routes" />
  <RouterView />
</template>
