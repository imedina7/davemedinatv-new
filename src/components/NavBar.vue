<script setup lang="ts">
import DaveLogo from "./DaveLogo.vue";
import SocialLinks from "./SocialLinks.vue";

defineProps({
  navigation: Object,
});
</script>
<template>
  <nav
    class="bg-gray-900 h-11 text-md md:text-lg md:h-16 flex flex-row justify-between gap-2 items-center"
  >
    <div class="h-14 md:h-20 py-2 px-4 relative top-1">
      <RouterLink to="/">
        <DaveLogo />
      </RouterLink>
    </div>
    <div class="text-slate-400 font-thin uppercase font-rajdhani">
      <RouterLink class="px-2" to="/videos">videos</RouterLink>
    </div>
    <div class="w-1/2">
      <SocialLinks />
    </div>
  </nav>
</template>
<style></style>
