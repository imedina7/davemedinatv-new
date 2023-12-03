<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { computed } from "vue";

const store = useAppStore();
const TWITCH_LOGIN = import.meta.env.VITE_TWITCH_LOGIN;
const isLive = computed(() => store.stream.isLive);
</script>

<template>
  <div v-if="isLive" class="fixed bottom-5 left-6 w-52 h-36">
    <iframe
      title="Twitch Player"
      :src="`https://player.twitch.tv/?channel=${TWITCH_LOGIN}&parent=stage.davemedina.tv`"
      height="100%"
      parent="stage.davemedina.tv"
      allowfullscreen
    >
    </iframe>
  </div>
</template>
