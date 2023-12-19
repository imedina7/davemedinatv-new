<script setup lang="ts">
import { ref } from "vue";
import VideoItem from "./VideoItem.vue";
import VideoPlayer from "./VideoPlayer.vue";
import ModalWindow from "./ModalWindow.vue";
import type { Video } from "@/types";

const props = defineProps<{
  title: string;
  videos: Video[];
  isLoading?: boolean;
}>();

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
      class="flex mx-2 gap-5 overflow-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
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
  <div v-else class="flex flex-col py-7 px-5 gap-3">
    <div class="mx-2 mb-3 font-semibold text-2xl text-slate-100">
      {{ title }}
    </div>
    <div
      class="flex snap-x snap-mandatory h-56 mx-2 overflow-y-hidden overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
    >
      <VideoItem
        v-for="video in videos"
        :key="video.id"
        :video="video"
        @click="openModal(video)"
      />
    </div>
  </div>
  <ModalWindow v-if="displayModal && selectedVideo" @close="closeModal()">
    <VideoPlayer :video="selectedVideo" />
  </ModalWindow>
</template>
