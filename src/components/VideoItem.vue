<script setup lang="ts">
import type { Video } from "@/types";
import { formatDuration } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps<{ video: Video }>();
const imgQueryParams = document.body.clientWidth > 768 ? "h=200" : "h=420";
</script>
<template>
  <div class="h-48 w-52 flex-none px-2 cursor-pointer group">
    <div
      v-if="props.video?.thumbnailUrl"
      class="z-0 w-full relative rounded-sm overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-black/60 flex justify-center items-center opacity-0 transition-opacity group-hover:opacity-100 z-10"
      >
        <FontAwesomeIcon :icon="['fa', 'play']" size="3x" class="text-white" />
      </div>
      <img
        class="h-28 group-hover:scale-110 transition-transform z-10"
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
