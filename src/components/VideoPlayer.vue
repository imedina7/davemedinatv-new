<template>
  <video class="w-full h-full" autoplay controls :src="video.url"></video>
</template>
<script setup lang="ts">
import type { Video } from "@/types";

defineProps<{ video: Video }>();
</script>
