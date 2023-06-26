<script setup lang="ts"></script>
<template>
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-40"
    @click="
      (event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) {
          $emit('close');
        }
      }
    "
  >
    <div class="container h-3/4 z-50">
      <slot></slot>
    </div>
  </div>
</template>
