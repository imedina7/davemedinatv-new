<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>
<template>
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-40"
    @keydown="(e) => e.code === 'Escape' && $emit('close')"
    @click="
      (event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) {
          $emit('close');
        }
      }
    "
  >
    <div
      class="absolute top-2 right-4 text-neutral-300/60 hover:text-slate-100 cursor-pointer"
      @click="$emit('close')"
    >
      <FontAwesomeIcon :icon="['fa', 'close']" size="2x" />
    </div>
    <div class="container h-3/4 z-50" v-focus>
      <slot></slot>
    </div>
  </div>
</template>
