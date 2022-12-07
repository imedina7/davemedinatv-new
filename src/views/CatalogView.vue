<script setup lang="ts">
import { computed } from "vue";
import { ALL_VIDEOS_QUERY } from "@/services/queries";
import { useQuery } from "@vue/apollo-composable";
import VideoItem from "@/components/VideoItem.vue";
import { routes } from "@/router";
import NavBar from "@/components/NavBar.vue";

const { result, loading, error } = useQuery(ALL_VIDEOS_QUERY);
const videos = computed(() => result.value?.videoCollection.items ?? []);
</script>
<template>
  <NavBar :navigation="routes" />
  <main class="bg-black h-screen">
    <div class="container mx-auto md:mt-4 text-gray-200 overflow-y-auto">
      <h1 class="font-doppio text-2xl py-2">Videos</h1>
      <div v-if="loading">Cargando la diversion...</div>
      <div v-else-if="error">Hubo un error, intente nuevamente</div>
      <div v-else class="flex flex-wrap w-full">
        <VideoItem v-for="video in videos" :key="video.sys.id" :video="video" />
      </div>
    </div>
  </main>
</template>
