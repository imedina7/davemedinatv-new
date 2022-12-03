<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>
<template>
  <div class="text-gray-600 text-3xl w-1/2" aria-label="Redes Sociales">
    <ul class="flex items-center justify-between">
      <li class="hover:text-gray-300 transition-all duration-150">
        <a aria-label="Youtube" href="https://www.youtube.com/DaveMedinaTV"
          ><FontAwesomeIcon :icon="['fab', 'youtube']"
        /></a>
      </li>
      <li class="hover:text-gray-300 transition-all duration-150">
        <a aria-label="Instagram" href="https://www.instagram.com/davemedina.tv"
          ><FontAwesomeIcon :icon="['fab', 'instagram']"
        /></a>
      </li>
      <li class="hover:text-gray-300 transition-all duration-150">
        <a aria-label="Twitter" href="https://www.twitter.com/davemedinatv"
          ><FontAwesomeIcon :icon="['fab', 'twitter']"
        /></a>
      </li>
      <li class="hover:text-gray-300 transition-all duration-150">
        <a aria-label="Twitch" href="https://www.twitch.com/davemedinatv"
          ><FontAwesomeIcon :icon="['fab', 'twitch']"
        /></a>
      </li>
    </ul>
  </div>
</template>
