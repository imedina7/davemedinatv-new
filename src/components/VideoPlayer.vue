<script setup lang="ts">
import type { Video } from "@/types";

defineProps<{ video: Video }>();
const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
};
</script>
<template>
  <video
    v-focus
    class="w-full h-full outline-none"
    autoplay
    controls
    :src="video.url"
  ></video>
</template>
