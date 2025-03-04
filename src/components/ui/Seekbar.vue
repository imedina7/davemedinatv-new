<template>
  <div
    class="h-6 flex items-center cursor-pointer"
    @mousedown="handleMouseDown"
  >
    <div class="seekbar">
      <div class="progress" :style="{ width: width + '%' }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

const { value = 0, max = 100 } = defineProps<{
  value?: number;
  max?: number;
}>();

const progress = ref(value);
const seeking = ref(false);

const width = computed(() => (progress.value / max) * 100);

const emit = defineEmits<{
  input: [progress: number];
  seek: [progress: number];
}>();

watch(
  () => value,
  () => {
    if (!seeking.value) {
      progress.value = value;
    }
  },
);

const calcProgress = (moveX: number, seekbarWidth: number) => {
  return Math.max(0, Math.min(max, (moveX / seekbarWidth) * max));
};

const handleMouseDown = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const seekbar = target.getBoundingClientRect();
  const startX = event.clientX - seekbar.left;
  progress.value = calcProgress(startX, seekbar.width);
  seeking.value = true;

  const handleMove = (moveEvent: MouseEvent) => {
    const moveX = moveEvent.clientX - seekbar.left;
    const newProgress = calcProgress(moveX, seekbar.width);
    progress.value = newProgress;
    emit("input", newProgress);
  };

  const handleUp = () => {
    seeking.value = false;
    emit("seek", progress.value);
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleUp);
  };

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleUp);
};
</script>

<style scoped>
.seekbar {
  position: relative;
  width: 100%;
  height: 5px;
  background-color: #dddddd61;
}

.progress,
.buffer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}
.progress {
  background-color: rgb(69, 14, 151);
  z-index: 100;
}
.buffer {
  width: 50%;
  background-color: rgba(180, 180, 180, 0.5);
  z-index: 60;
}
</style>
