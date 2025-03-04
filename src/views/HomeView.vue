<script setup lang="ts">
import SectionContainer from "@/components/SectionContainer.vue";
import LivePlayer from "../components/LivePlayer.vue";
import VideoDock from "../components/VideoDock.vue";
import { computed } from "vue";
import { useRootStore } from "@/store";
import { useVideos } from '@/hooks';

const store = useRootStore();
const isLive = computed(() => store.stream.isLive);

const { videos, loading } = useVideos()
</script>
<template>
  <main class="absolute inset-x-0 bottom-0 md:mx-8">
    <LivePlayer v-if="isLive" />
    <SectionContainer v-else>
      <VideoDock title="Ultimos videos" :isLoading="loading" :videos="videos" />
    </SectionContainer>
  </main>
</template>
