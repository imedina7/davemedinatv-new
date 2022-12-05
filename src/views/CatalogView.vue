<script setup lang="ts">
import { computed } from "vue";
import { ALL_VIDEOS_QUERY } from "@/services/queries";
import { useQuery } from "@vue/apollo-composable";
import VideoItem from "@/components/VideoItem.vue";

const { result, loading, error } = useQuery(ALL_VIDEOS_QUERY);
const videos = computed(() => result.value?.videoCollection.items ?? []);

if (error) console.log(error);
</script>
<template>
  <main class="bg-black h-screen">
    <div class="container text-gray-200">
      <h1 class="font-doppio">Videos</h1>
      <div class="container mx-auto">
        <VideoItem v-for="video in videos" :key="video.sys.id" :video="video" />
      </div>
    </div>
  </main>
</template>
