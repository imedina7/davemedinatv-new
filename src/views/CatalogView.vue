<script setup lang="ts">
import { computed, ref } from "vue";
import { ALL_VIDEOS_QUERY } from "@/services/queries";
import { useQuery } from "@vue/apollo-composable";
import VideoItem from "@/components/VideoItem.vue";

import ModalWindow from "@/components/ModalWindow.vue";
import VideoPlayer from "@/components/VideoPlayer.vue";
import type { Video } from "@/types";

const { result, loading, error } = useQuery(ALL_VIDEOS_QUERY);
const videos = computed(() => result.value?.videoCollection.items ?? []);

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
  <main class="bg-black h-screen">
    <div class="container mx-auto mt-14 text-gray-200 overflow-y-auto">
      <h1 class="font-doppio text-2xl py-2">Videos</h1>
      <div v-if="loading">Cargando la diversion...</div>
      <div v-else-if="error">Hubo un error, intente nuevamente</div>
      <div v-else class="flex flex-wrap w-full">
        <VideoItem
          v-for="video in videos"
          :key="video.sys.id"
          :video="video"
          @click="
            openModal({
              url: video.media.url,
              title: video.title,
              duration: video.duration,
              thumbnailUrl: video.thumbnail.url,
            })
          "
        />
      </div>
    </div>
  </main>
  <ModalWindow v-if="displayModal && selectedVideo" @close="closeModal()">
    <VideoPlayer :video="selectedVideo" />
  </ModalWindow>
</template>
