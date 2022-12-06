<script setup lang="ts">
import SocialLinks from "../components/SocialLinks.vue";
import DaveLogo from "../components/DaveLogo.vue";
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
    <SocialLinks />
  </main>
</template>
