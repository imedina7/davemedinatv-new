<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DaveLogo from "../components/DaveLogo.vue";
import SocialLinks from "./SocialLinks.vue";

defineProps({
  navigation: Object,
});
import { computed } from "vue";
import { useUiStore } from "@/stores/ui";
import { useAppStore } from "@/stores/app";
import classnames from "classnames";

const app = useAppStore();
const ui = useUiStore();

const isLive = computed(() => app.stream.isLive);
const streamRun = computed(() => app.streamRunTime);
</script>
<template>
  <nav
    :class="
      classnames(
        'border-b gap-5 border-b-neutral-900/60 shadow-lg',
        'bg-black/60 flex fixed inset-0 transition-all duration-200 z-30',
        'ease-in-out items-center justify-center backdrop-blur-sm dotted-pattern',
        ui.landingRolledUp && !ui.touch.isSwippingY
          ? 'h-14'
          : 'h-screen flex-col',
        { 'overflow-hidden': ui.touch.isSwippingY },
      )
    "
    :style="
      ui.touch.isSwippingY
        ? `transition: none; height: calc(${
            ui.landingRolledUp ? '56px' : '100vh'
          } - ${ui.touch.swipeDeltaY}px)`
        : ''
    "
  >
    <div
      :class="`transition-all shrink px-5 md:px-20 lg:px-40 ${
        ui.landingRolledUp && !ui.touch.isSwippingY
          ? 'h-full scale-125 translate-y-2'
          : 'w-full'
      }`"
      @touchstart.passive="(e) => ui.landingRolledUp && e.stopPropagation()"
    >
      <RouterLink to="/">
        <DaveLogo />
      </RouterLink>
    </div>
    <div
      class="flex flex-col w-48 items-center text-slate-400 text-lg font-thin uppercase font-rajdhani"
    >
      <div
        v-if="isLive && !ui.landingRolledUp"
        @click="() => (ui.landingRolledUp = true)"
        class="flex gap-3 items-center text-center hover:text-slate-200 cursor-pointer"
      >
        <FontAwesomeIcon fade :icon="['fa', 'angles-up']" size="sm" />
        en vivo {{ streamRun }}
        <FontAwesomeIcon fade :icon="['fa', 'angles-up']" size="sm" />
      </div>
      <RouterLink
        to="/videos"
        class="flex gap-3 items-center text-center hover:text-slate-200"
        >videos</RouterLink
      >
    </div>
    <SocialLinks class="text-2xl" />
  </nav>
</template>
