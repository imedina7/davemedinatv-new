<script setup lang="ts">
import { formatDuration } from "@/utils";
const props = defineProps({
  video: Object,
});
const imgQueryParams = document.body.clientWidth > 768 ? "h=200" : "h=420";
</script>
<template>
  <a
    :href="props.video?.media.url"
    class="block flex-grow relative w-full h-fit md:w-fit border border-gray-700 rounded-sm overflow-hidden"
  >
    <span
      class="font-bold text-md md:text-sm absolute px-2 py-1 z-10 drop-shadow-md shadow-black"
      >{{ props.video?.title }}</span
    >
    <div v-if="props.video?.thumbnail" class="z-0">
      <img
        class="transition-transform w-full duration-150 hover:scale-110"
        :src="`${props.video?.thumbnail.url}?${imgQueryParams}`"
        :alt="`${props.video?.title} thumbnail`"
      />
    </div>
    <div
      class="absolute z-20 right-0 bottom-0 px-2 text-sm font-semibold bg-black/70"
    >
      {{ formatDuration(props.video?.duration) }}
    </div>
  </a>
</template>
