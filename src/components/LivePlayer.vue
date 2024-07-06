<script setup lang="ts">
const TWITCH_LOGIN: string = import.meta.env.VITE_TWITCH_LOGIN;
const BASE_URL: string = import.meta.env.VITE_BASE_URL.replace("https://");
const host =
  BASE_URL[BASE_URL.length - 1] === "/"
    ? BASE_URL.substring(0, BASE_URL.length - 1)
    : BASE_URL;
</script>

<template>
  <div class="-z-50 inset-0 w-screen h-screen">
    <iframe
      title="Twitch Player"
      :src="`https://player.twitch.tv/?channel=${TWITCH_LOGIN}&parent=${host}`"
      width="100%"
      height="100%"
      :parent="host"
      allowfullscreen
    >
    </iframe>
  </div>
</template>
