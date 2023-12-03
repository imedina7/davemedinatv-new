<script setup lang="ts">
import SocialLinks from "../components/SocialLinks.vue";
import DaveLogo from "../components/DaveLogo.vue";
import { computed, onMounted } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();

const isLive = computed(() => store.stream.isLive);
onMounted(() => {
  store.fetchLiveState();
});
</script>
<template>
  <main class="bg-black h-screen flex flex-col items-center justify-center">
    <div class="w-full px-5 md:px-20 lg:px-40">
      <DaveLogo />
    </div>
    <div
      class="text-slate-400 hover:text-slate-200 text-lg mb-5 font-thin uppercase font-rajdhani"
    >
      <RouterLink to="/videos">ver videos</RouterLink>
    </div>
    <span class="text-slate-100">{{ isLive }}</span>
    <SocialLinks class="text-2xl" />
  </main>
</template>
