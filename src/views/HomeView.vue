<script setup lang="ts">
import SocialLinks from "../components/SocialLinks.vue";
import DaveLogo from "../components/DaveLogo.vue";
import LivePlayer from "../components/LivePlayer.vue";
import { computed, ref } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();

const isLive = computed(() => store.stream.isLive);
const streamRun = computed(() => store.streamRunTime);

const touchStart = ref(0);

const deltaTouch = ref(0);

const rollUp = ref(false);
const drawerEl = ref<HTMLDivElement | null>(null);

const drawerComputedHeight = computed(() => drawerEl.value?.clientHeight);

const swipeHandler = (ev: TouchEvent | WheelEvent) => {
  if (ev instanceof TouchEvent) {
    deltaTouch.value = touchStart.value - ev.touches[0].pageY;
    return;
  }

  if (deltaTouch.value + ev.deltaY > 0) {
    deltaTouch.value += ev.deltaY;
  }
  if (rollUp.value) {
    if (ev.deltaY < -25) rollUp.value = false;
  } else if (ev.deltaY > 25) rollUp.value = true;
  console.log("wheel event triggered");
};
</script>
<template>
  <main @wheel="swipeHandler">
    <div
      ref="drawerEl"
      :class="`bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm dotted-pattern ${
        rollUp ? 'h-11' : 'h-screen'
      }`"
      :style="deltaTouch === 0 ? '' : `height: calc(100vh - ${deltaTouch}px)`"
      @touchstart="
        (ev) => {
          touchStart = ev.touches[0].pageY;
        }
      "
      @touchmove="swipeHandler"
      @touchend="
        (ev) => {
          const touchEnd = ev.changedTouches[0].pageY;
          deltaTouch = touchStart - touchEnd;
          console.log('delta touch:', deltaTouch);
          if (rollUp) {
            if (deltaTouch < -50) rollUp = false;
          } else {
            if (deltaTouch > 50) rollUp = true;
          }
          touchStart = 0;
          deltaTouch = 0;
        }
      "
    >
      <div class="w-full px-5 md:px-20 lg:px-40">
        <DaveLogo />
      </div>
      <div
        class="text-slate-400 hover:text-slate-200 text-lg mb-5 font-thin uppercase font-rajdhani"
      >
        <RouterLink to="/videos">ver videos</RouterLink>
      </div>
      <span class="text-slate-100">{{ isLive }}</span>
      <span class="text-slate-100">{{ streamRun }}</span>
      <SocialLinks class="text-2xl" />
    </div>
    <LivePlayer />
  </main>
</template>
