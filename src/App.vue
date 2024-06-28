<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import Logo3D from "@/components/Logo3D.vue";
import { routes } from "@/router";
import { useRootStore } from "./store";

const store = useRootStore();
</script>

<template>
  <NavBar :navigation="routes" />
  <RouterView />
  <Logo3D v-if="!store.stream.isLive" />
</template>
