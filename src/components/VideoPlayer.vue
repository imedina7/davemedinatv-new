<script setup lang="ts">
import type { Video } from "@/types";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { formatDuration } from "@/utils";
import vFocus from "@/directives/focus";
import Slider from "./ui/Slider.vue";
import Seekbar from "./ui/Seekbar.vue";

defineProps<{ video: Video }>();

const videoElem = useTemplateRef<HTMLMediaElement, string>("player");
const containerElem = useTemplateRef<HTMLDivElement, string>("video-container");

const volume = ref(1.0);
const seeking = ref(false);
const time = ref("00:00 / 00:00");
const progressSeconds = ref(0.0);
const durationSeconds = ref(0.0);
const isFullscreen = ref(false);
const isPlaying = ref(true);
const showControls = ref(true);
const timeoutHandle = ref<NodeJS.Timeout | undefined>();

const hideControls = () => {
  timeoutHandle.value = setTimeout(() => {
    showControls.value = false;
  }, 5000);
};

const clearControlsHideTimeout = () => {
  clearTimeout(timeoutHandle.value);
};

onMounted(() => {
  hideControls();
});

const togglePlayback = () => {
  if (!videoElem.value) return;
  if (videoElem.value.paused) {
    videoElem.value.play();
    isPlaying.value = true;
    return;
  }
  videoElem.value.pause();
  isPlaying.value = false;
};

const toggleMute = () => {
  if (!videoElem.value) return;
  if (videoElem.value.muted) {
    videoElem.value.muted = false;
    return;
  }
  videoElem.value.muted = true;
};

const handleVolumeChange = (newVolume: number) => {
  if (!videoElem.value) return;
  videoElem.value.volume = newVolume;
  volume.value = newVolume;
};

const toggleFullscreen = async () => {
  if (!containerElem.value) return;
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    isFullscreen.value = false;
    return;
  }
  await containerElem.value.requestFullscreen();
  isFullscreen.value = true;
};

const handleSeek = (progress: number) => {
  if (!videoElem.value) return;
  seeking.value = false;
  videoElem.value.currentTime = progress;
};

const handleProgress = (event: Event) => {
  if (!videoElem.value || seeking.value) return;
  const currentTime = formatDuration(videoElem.value.currentTime * 1000);
  const duration = formatDuration(videoElem.value.duration * 1000);
  progressSeconds.value = videoElem.value.currentTime;
  durationSeconds.value = videoElem.value.duration;
  time.value = `${currentTime} / ${duration}`;
};

const handleVideoClick = (event: Event) => {
  togglePlayback();
};

const handleMouse = () => {
  clearControlsHideTimeout();
  showControls.value = true;
  hideControls();
};

const speakerIcon = computed(() => {
  if (videoElem.value?.muted) return "fa-volume-mute";
  if (volume.value > 0.5) return "fa-volume-high";
  if (volume.value <= 0.04) return "fa-volume-off";
  return "fa-volume-low";
});

const playIcon = computed(() => {
  if (isPlaying.value) return "fa-pause";
  return "fa-play";
});

const fullscreenIcon = computed(() => {
  if (isFullscreen.value) {
    return "fa-down-left-and-up-right-to-center";
  }
  return "fa-up-right-and-down-left-from-center";
});
</script>
<template>
  <div
    class="relative h-full text-white"
    ref="video-container"
    @mousemove="handleMouse"
    @dblclick="toggleFullscreen"
  >
    <video
      v-focus
      class="outline-none h-full w-full"
      :src="video.url"
      ref="player"
      autoplay
      @click="handleVideoClick"
      @timeupdate="handleProgress"
      @loadedmetadata="handleProgress"
      @ended="() => isPlaying = false"
    ></video>
    <div
      :class="`absolute bg-gradient-to-t from-neutral-950/80 via-neutral-950/50 to-neutral-950/0 bottom-0 w-full h-60 flex flex-col justify-end transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'} pointer-events-none`"
    >
      <div
        @mouseenter="
          () => {
            clearControlsHideTimeout();
          }
        "
        @mouseleave="hideControls()"
        class="pointer-events-auto"
      >
        <div class="w-full h-6">
          <Seekbar
            @seek="handleSeek"
            @input="()=>{ seeking = true }"
            :value="progressSeconds"
            :max="durationSeconds"
          />
        </div>
        <div class="w-full h-12 py-2 flex justify-between">
          <div class="flex gap-3">
            <button class="px-3 w-8" @click="togglePlayback">
              <FontAwesomeIcon :icon="playIcon" />
            </button>
            <div class="flex items-center">
              <div class="text-xs opacity-75">{{ time }}</div>
            </div>
            <button
              @click="toggleMute"
              class="px-1 w-8 flex justify-start items-center"
            >
              <FontAwesomeIcon :icon="speakerIcon" />
            </button>
            <Slider
              :step="0.001"
              @input="handleVolumeChange"
            />
          </div>
          <div class="flex gap-3">
            <button class="px-3" @click="toggleFullscreen">
              <FontAwesomeIcon :icon="fullscreenIcon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
