<script setup lang="ts">
import classnames from "classnames";

const TWITCH_LOGIN = import.meta.env.VITE_TWITCH_LOGIN;
</script>

<template>
  <div :class="classnames('-z-50 inset-0 w-screen h-screen')">
    <iframe
      title="Twitch Player"
      :src="`https://player.twitch.tv/?channel=${TWITCH_LOGIN}&parent=stage.davemedina.tv`"
      width="100%"
      height="100%"
      parent="stage.davemedina.tv"
      allowfullscreen
    >
    </iframe>
  </div>
</template>
