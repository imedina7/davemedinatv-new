<script setup lang="ts">
import { ref } from "vue";
import VideoItem from "./VideoItem.vue";
import VideoPlayer from "./VideoPlayer.vue";
import type { Video } from "@/types";

const props = defineProps({
  title: String,
  videos: {
    type: Array<Video>,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const displayModal = ref(false);
const selectedVideo = ref<Video | null>(null);

function openModal(video: Video) {
  displayModal.value = true;
  selectedVideo.value = video;
}

function closeModal() {
  displayModal.value = false;
  selectedVideo.value = null;
}
</script>
<template>
  <div v-if="props.isLoading" class="flex flex-col py-7 px-5 gap-3">
    <div class="mx-2 h-8 w-44 skeleton-element"></div>
    <div
      class="flex mx-2 gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
    >
      <div class="py-4 flex gap-3 flex-col">
        <div class="h-28 w-48 skeleton-element"></div>
        <div class="h-4 w-36 skeleton-element"></div>
      </div>
      <div class="py-4 flex gap-3 flex-col">
        <div class="h-28 w-48 skeleton-element"></div>
        <div class="h-4 w-36 skeleton-element"></div>
      </div>
      <div class="py-4 flex gap-3 flex-col">
        <div class="h-28 w-48 skeleton-element"></div>
        <div class="h-4 w-36 skeleton-element"></div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-wrap w-full">
    <VideoItem
      v-for="video in videos"
      :key="video.id"
      :video="video"
      @click="openModal(video)"
    />
  </div>
  <ModalWindow v-if="displayModal && selectedVideo" @close="closeModal()">
    <VideoPlayer :video="selectedVideo" />
  </ModalWindow>
</template>
