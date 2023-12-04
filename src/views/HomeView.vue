<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SocialLinks from "../components/SocialLinks.vue";
import DaveLogo from "../components/DaveLogo.vue";
import LivePlayer from "../components/LivePlayer.vue";
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();

const isLive = computed(() => store.stream.isLive);
const streamRun = computed(() => store.streamRunTime);

const ui = computed(() => store.ui);
</script>
<template>
  <main>
    <div
      :class="`bg-black/80 flex fixed overflow-hidden inset-0 flex-col transition-all duration-200 ease-in-out items-center justify-center backdrop-blur-sm dotted-pattern ${
        ui.landingRolledUp ? 'h-11' : 'h-screen'
      }`"
      :style="
        ui.isSwipping
          ? `transition: none; height: calc(100vh - ${ui.swipeDelta}px)`
          : ''
      "
    >
      <div class="w-full shrink px-5 md:px-20 lg:px-40">
        <DaveLogo />
      </div>
      <div
        class="text-slate-400 hover:text-slate-200 text-lg mb-5 font-thin uppercase font-rajdhani"
      >
        <RouterLink to="/videos" class="flex gap-3 items-center"
          ><FontAwesomeIcon fade :icon="['fa', 'angles-down']" size="sm" />
          ver videos
          <FontAwesomeIcon fade :icon="['fa', 'angles-down']" size="sm"
        /></RouterLink>
      </div>
      <span class="text-slate-100">{{ isLive }}</span>
      <span class="text-slate-100">{{ streamRun }}</span>
      <SocialLinks class="text-2xl" />
    </div>
    <LivePlayer />
  </main>
</template>
