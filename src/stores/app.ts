import { getStream } from "@/services/api";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    stream: {
      title: "Test stream",
      timeRunning: 123341233,
      isLive: false,
      category: "3D Modelling",
      thumbnail: null,
    },
    ui: {
      isVideoOverlayOpen: false,
    },
  }),
  actions: {
    async fetchLiveState() {
      this.stream.isLive = (await getStream()).data.isLive;
    },
  },
});
