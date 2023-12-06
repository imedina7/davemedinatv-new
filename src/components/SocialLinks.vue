<script setup lang="ts">
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { socialMediaLinks } from "@/utils/constants";
</script>
<template>
  <div class="px-2 md:px-6 text-gray-600 w-full" aria-label="Redes Sociales">
    <ul class="flex items-center justify-around">
      <li
        v-for="link in socialMediaLinks"
        :key="link.label"
        class="hover:text-gray-300 transition-all duration-150"
      >
        <a :aria-label="link.label" :href="link.url"
          ><FontAwesomeIcon :icon="link.icon"
        /></a>
      </li>
    </ul>
  </div>
</template>
