<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { computed } from "vue";

const store = useAppStore();
const TWITCH_LOGIN = import.meta.env.VITE_TWITCH_LOGIN;
const isLive = computed(() => store.stream.isLive);
</script>

<template>
  <div v-if="isLive" class="fixed bottom-5 right-6 h-32">
    <iframe
      title="Twitch Player"
      :src="`https://player.twitch.tv/?${TWITCH_LOGIN}&parent=stage.davemedina.tv`"
      height="120"
      width="212"
      allowfullscreen
    >
    </iframe>
  </div>
</template>
