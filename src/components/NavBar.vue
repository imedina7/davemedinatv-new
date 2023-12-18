<script setup lang="ts">
import { computed } from "vue";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { useRootStore, useUiStore } from "@/store";
import { cssCalc } from "@/utils/helpers/string";
import DaveLogo from "../components/DaveLogo.vue";
import SocialLinks from "./SocialLinks.vue";

defineProps({
  navigation: Object,
});

const app = useRootStore();
const ui = useUiStore();

const isLive = computed(() => app.stream.isLive);
const streamRun = computed(() => app.streamRunTime);

const navClass = computed(() =>
  classnames(
    "border-b gap-5 border-b-neutral-900/60 shadow-lg",
    "bg-black/60 flex fixed inset-0 transition-all duration-200 z-30",
    "ease-in-out items-center justify-center backdrop-blur-sm dotted-pattern",
    ui.landingRolledUp && !ui.touch.isSwippingY ? "h-14" : "h-screen flex-col",
    { "overflow-hidden": ui.touch.isSwippingY },
  ),
);

const logoWrapperClass = computed(() =>
  classnames("transition-all shrink px-5 md:px-20 lg:px-40", {
    "h-full scale-125 translate-y-2":
      ui.landingRolledUp && !ui.touch.isSwippingY,
    "w-full": !ui.landingRolledUp || ui.touch.isSwippingY,
  }),
);

const getNavStyle = () => {
  if (!ui.touch.isSwippingY) return "";

  return {
    transition: "none", // avoid delay when swipping
    height: cssCalc(
      `${ui.landingRolledUp ? "56px" : "100vh"} - ${ui.touch.swipeDeltaY}px`,
    ),
  };
};
</script>
<template>
  <nav :class="navClass" :style="getNavStyle()">
    <div
      :class="logoWrapperClass"
      @touchstart.passive="(e) => ui.landingRolledUp && e.stopPropagation()"
    >
      <RouterLink to="/">
        <DaveLogo className="drop-shadow-md" />
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
