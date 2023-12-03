<script setup lang="ts">
import SocialLinks from "../components/SocialLinks.vue";
import DaveLogo from "../components/DaveLogo.vue";
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();

const isLive = computed(() => store.stream.isLive);
const streamRun = computed(() => store.streamRunTime);
</script>
<template>
  <main
    class="bg-black/80 h-screen flex flex-col items-center justify-center backdrop-blur-sm dotted-pattern"
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
  </main>
</template>
