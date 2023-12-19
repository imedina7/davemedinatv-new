<script setup lang="ts">
import type { Video } from "@/types";
import { formatDuration } from "@/utils";
const props = defineProps<{ video: Video }>();
const imgQueryParams = document.body.clientWidth > 768 ? "h=200" : "h=420";
</script>
<template>
  <div class="h-48 w-52 flex-none px-2 cursor-pointer">
    <div
      v-if="props.video?.thumbnailUrl"
      class="z-0 w-full relative overflow-hidden"
    >
      <img
        class="h-28 rounded-sm"
        :src="`${props.video?.thumbnailUrl}?${imgQueryParams}`"
        :alt="`${props.video?.title} thumbnail`"
      />
      <div
        class="absolute bottom-0 right-0 py-0.5 px-1 bg-slate-950/80 rounded-tl-sm font-semibold text-white text-xs"
      >
        {{ formatDuration(props.video?.duration) }}
      </div>
    </div>
    <div class="flex h-8 mt-3">
      <div class="shrink text-sm text-slate-100">
        {{ props.video?.title }}
      </div>
    </div>
  </div>
</template>
