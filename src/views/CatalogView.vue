<script setup lang="ts">
import { computed, ref } from "vue";
import { ALL_VIDEOS_QUERY } from "@/services/queries";
import { useQuery } from "@vue/apollo-composable";

import VideoDock from "@/components/VideoDock.vue";
import SectionContainer from "@/components/SectionContainer.vue";

const { result, loading } = useQuery(ALL_VIDEOS_QUERY);
const videos = computed(
  () =>
    result.value?.videoCollection.items.map((video: any) => ({
      id: video.id,
      url: video.media.url,
      title: video.title,
      duration: video.duration,
      thumbnailUrl: video.thumbnail.url,
    })) ?? [],
);
</script>
<template>
  <main class="absolute inset-x-0 bottom-0">
    <SectionContainer>
      <VideoDock title="Ultimos videos" :isLoading="loading" :videos="videos" />
    </SectionContainer>
  </main>
</template>
