<script setup lang="ts">
import { RouterView } from "vue-router";
import { state } from "@/socket";
import { computed } from "vue";

const connected = computed(() => state.connected);
</script>

<template>
  <RouterView />
  <div style="color: white">Connected: {{ connected }}</div>
</template>
