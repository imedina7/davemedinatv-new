<script setup lang="ts">
import DaveLogo from "./DaveLogo.vue";
import SocialLinks from "./SocialLinks.vue";
</script>
<template>
  <nav
    class="bg-gray-900 h-16 flex flex-row justify-between gap-2 items-center"
  >
    <div class="h-full py-2 px-4">
      <RouterLink to="/">
        <DaveLogo />
      </RouterLink>
    </div>
    <div class="text-slate-400 text-lg font-thin uppercase font-rajdhani">
      <RouterLink class="px-2" to="/videos">videos</RouterLink>
    </div>
    <div class="w-80">
      <SocialLinks />
    </div>
  </nav>
</template>
<style></style>
