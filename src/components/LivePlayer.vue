<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { computed } from "vue";
import classnames from "classnames";

const store = useAppStore();
const TWITCH_LOGIN = import.meta.env.VITE_TWITCH_LOGIN;
const isLive = computed(() => store.stream.isLive);
</script>

<template>
  <div :class="classnames('-z-50 inset-0 w-screen h-screen')" v-if="isLive">
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
