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
      :class="`border-b border-b-neutral-900/60 shadow-lg shadow-neutral-900/20 bg-black/80 flex fixed overflow-hidden inset-0 flex-col transition-all duration-200 ease-in-out items-center justify-center backdrop-blur-sm dotted-pattern ${
        ui.landingRolledUp ? 'h-11' : 'h-screen'
      }`"
      :style="
        ui.isSwipping
          ? `transition: none; height: calc(${
              ui.landingRolledUp ? '44px' : '100vh'
            } - ${ui.swipeDelta}px)`
          : ''
      "
    >
      <div class="w-full shrink px-5 md:px-20 lg:px-40">
        <DaveLogo />
      </div>
      <div
        class="flex flex-col w-48 items-center text-slate-400 text-lg mb-5 font-thin uppercase font-rajdhani"
      >
        <div
          v-if="isLive && !store.ui.landingRolledUp"
          @click="
            () => {
              store.ui.landingRolledUp = true;
            }
          "
          class="flex gap-3 items-center text-center hover:text-slate-200 cursor-pointer"
        >
          <FontAwesomeIcon fade :icon="['fa', 'angles-up']" size="sm" />
          en vivo {{ streamRun }}
          <FontAwesomeIcon fade :icon="['fa', 'angles-up']" size="sm" />
        </div>
        <RouterLink
          to="/videos"
          class="flex gap-3 items-center text-center hover:text-slate-200"
          ><FontAwesomeIcon fade :icon="['fa', 'angles-down']" size="sm" />
          ver videos
          <FontAwesomeIcon fade :icon="['fa', 'angles-down']" size="sm"
        /></RouterLink>
      </div>
      <SocialLinks class="text-2xl" />
    </div>
    <LivePlayer />
  </main>
</template>
