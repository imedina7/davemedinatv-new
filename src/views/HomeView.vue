<script setup lang="ts">
import SectionContainer from "@/components/SectionContainer.vue";
import LivePlayer from "../components/LivePlayer.vue";
import VideoDock from "../components/VideoDock.vue";
import { computed } from "vue";
import { useRootStore } from "@/store";

const store = useRootStore();
const isLive = computed(() => store.stream.isLive);
</script>
<template>
  <main>
    <LivePlayer v-if="isLive" />
    <SectionContainer v-else>
      <VideoDock title="Ultimos videos" :isLoading="true" />
    </SectionContainer>
  </main>
</template>
