<template>
  <video class="w-full h-full" autoplay controls :src="video.url" muted></video>
</template>
<script setup lang="ts">
import type { Video } from "@/types";

defineProps<{ video: Video }>();
</script>
