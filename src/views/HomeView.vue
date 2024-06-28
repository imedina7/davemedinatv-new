<script setup lang="ts">
import SectionContainer from "@/components/SectionContainer.vue";
import LivePlayer from "../components/LivePlayer.vue";
import VideoDock from "../components/VideoDock.vue";
import { computed } from "vue";
import { useRootStore } from "@/store";
import { useQuery } from "@vue/apollo-composable";
import { ALL_VIDEOS_QUERY } from "@/services/queries";

const store = useRootStore();
const isLive = computed(() => store.stream.isLive);

const { result, loading, error } = useQuery(ALL_VIDEOS_QUERY);

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
    <LivePlayer v-if="isLive" />
    <SectionContainer v-else>
      <VideoDock title="Ultimos videos" :isLoading="loading" :videos="videos" />
    </SectionContainer>
  </main>
</template>
