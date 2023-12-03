<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { computed } from "vue";

const store = useAppStore();
const VERCEL_URL = import.meta.env.VUE_APP_VERCEL_URL;
const TWITCH_LOGIN = import.meta.env.TWITCH_LOGIN;
const isLive = computed(() => store.stream.isLive);
</script>

<template>
  <div v-if="isLive" class="fixed bottom-5 right-6 h-32">
    <iframe
      title="Twitch Player"
      :src="`https://player.twitch.tv/?${TWITCH_LOGIN}&parent=${VERCEL_URL}`"
      height="120"
      width="212"
      allowfullscreen
    >
    </iframe>
  </div>
</template>
