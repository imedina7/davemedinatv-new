<script setup lang="ts">
import SectionContainer from "@/components/SectionContainer.vue";
import LivePlayer from "../components/LivePlayer.vue";
import VideoDock from "../components/VideoDock.vue";
import ModalWindow from "../components/ModalWindow.vue";

import { useRootStore, useUiStore } from "@/store";
import { useVideos } from "@/hooks";

const store = useRootStore();
const ui = useUiStore();

const { videos, loading } = useVideos();
</script>
<template>
  <main class="absolute inset-x-0 bottom-0 md:mx-8">
    <SectionContainer>
      <VideoDock title="Ultimos videos" :isLoading="loading" :videos="videos" />
    </SectionContainer>
    <ModalWindow v-if="ui.isLiveModalOpen" @close="ui.closeLiveModal()">
      <LivePlayer v-if="store.stream.isLive" />
      <div v-else>
        Stream ended
        <button @click="ui.closeLiveModal()">Dismiss</button>
      </div>
    </ModalWindow>
  </main>
</template>
