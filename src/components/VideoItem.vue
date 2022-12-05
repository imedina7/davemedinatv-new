<script setup lang="ts">
import { formatDuration } from "@/utils";
const props = defineProps({
  video: Object,
});
</script>
<template>
  <a
    :href="props.video?.media.url"
    class="block relative w-80 border border-gray-700 rounded-sm overflow-hidden"
  >
    <span class="font-bold text-sm absolute">{{ props.video?.title }}</span>
    <div v-if="props.video?.thumbnail" class="z-0">
      <img
        :src="props.video?.thumbnail.url"
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
