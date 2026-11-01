<script setup lang="ts">
import classnames from "classnames";

const TWITCH_LOGIN = import.meta.env.VITE_TWITCH_LOGIN;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const TWITCH_EMBED_URL = `https://player.twitch.tv/?channel=${TWITCH_LOGIN}&parent=${BASE_URL}`;
</script>

<template>
  <div :class="classnames('-z-50 inset-0 w-screen h-screen')">
    <iframe
      title="Twitch Player"
      :src="TWITCH_EMBED_URL"
      width="100%"
      height="100%"
      :parent="BASE_URL"
      allowfullscreen
    >
    </iframe>
  </div>
</template>
