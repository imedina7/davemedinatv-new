<script setup lang="ts">
import type { Video } from "@/types";
import { computed, ref, useModel, useTemplateRef } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { formatDuration } from "@/utils";

defineProps<{ video: Video }>();
const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
};

const videoElem = useTemplateRef<HTMLMediaElement, string>("player")
const containerElem = useTemplateRef<HTMLDivElement, string>("video-container")
const volume = ref(1.0)
const seeking = ref(false)
const time = ref("00:00 / 00:00")
const progressSeconds = ref(0.0)
const isPlaying = ref(false)

const togglePlayback = () => {
  if(!videoElem.value) return
  if (videoElem.value.paused) {
    videoElem.value.play();
    isPlaying.value= true;
    return
  }
  videoElem.value.pause();
  isPlaying.value = false;
}
const toggleMute = () => {
  if(!videoElem.value) return
  if(videoElem.value.muted) {
    videoElem.value.muted = false
    return
  }
  videoElem.value.muted = true
}

const handleVolumeChange = (event: Event) => {
  if(!event.target || !videoElem.value) return
  console.log("Previous volume was:", videoElem.value.volume)
  const newVolume = parseFloat((event.target as HTMLInputElement).value);
  videoElem.value.volume = newVolume;
  volume.value = newVolume;
}

const toggleFullscreen = async () => {
  if(!containerElem.value) return
  if(document.fullscreenElement) {
    document.exitFullscreen()
    return
  }
  await containerElem.value.requestFullscreen()
}

const handleSeek = (event: Event) => {
  if(!videoElem.value) return
  seeking.value = false;
  const seekPosition = parseInt((event.target as HTMLInputElement).value)
  videoElem.value.currentTime = seekPosition;
}

const handleProgress = (event: Event) => {
  if(!videoElem.value || seeking.value) return
  const currentTime = formatDuration(videoElem.value.currentTime * 1000);
  const duration = formatDuration(videoElem.value.duration * 1000);
  progressSeconds.value = videoElem.value.currentTime;
  console.log("current time", videoElem.value.currentTime)
  console.log("duration", videoElem.value.duration)
  time.value = `${currentTime} / ${duration}`;
}


const duration = computed(() => videoElem.value?.duration)
const speakerIcon = computed(() => {
  if(volume.value > 0.5) return "fa-volume-high"
  if(volume.value <= 0.04) return "fa-volume-off"
  return "fa-volume-low"
})
const playIcon = computed(() => {
  if(isPlaying.value) return 'fa-pause'
  return 'fa-play'
})

</script>
<template>
  <div class="relative h-full text-white" ref="video-container">
    <video
      v-focus
      class="outline-none h-full w-full"
      :src="video.url"
      ref="player"
      @timeupdate="handleProgress"
      @loadedmetadata="handleProgress"
    ></video>
    <div class="absolute bottom-0 w-full h-12 py-2 flex gap-3">
      <button class="px-3" @click="togglePlayback"><FontAwesomeIcon :icon="playIcon"/></button>
      <div class="flex items-center"><div class="text-xs opacity-75">{{ time }}</div></div>
      <button @click="toggleMute" class="px-1"><FontAwesomeIcon :icon="speakerIcon"/></button>
      <input type="range" min="0" max="1" step="0.001" @input="handleVolumeChange"/>
      <input type="range" :value="progressSeconds" min="0" step="0.01" :max="duration" @change="handleSeek" @input="() => {seeking.value = true}"class="flex-grow"/>
      <button class="px-3" @click="toggleFullscreen"><FontAwesomeIcon icon="fa-up-right-and-down-left-from-center"/></button>
    </div>
  </div>
</template>
