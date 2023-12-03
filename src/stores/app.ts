import { getStream } from "@/services/api";
import { formatDuration } from "@/utils/helpers/video";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    stream: {
      title: "Test stream",
      startedAt: new Date(),
      isLive: false,
      category: "3D Modelling",
      gameName: "",
      thumbnail: "",
      tags: ["uruguay"],
    },
    ui: {
      isVideoOverlayOpen: false,
    },
    now: Date.now(),
  }),
  getters: {
    streamRunTime(state): string {
      console.log(this.now);
      const { startedAt } = state.stream;
      return formatDuration(this.now - startedAt.getTime());
    },
  },

  actions: {
    updateNow() {
      this.now = Date.now();
      if (this.stream.isLive) {
        this.scheduleUpdateNow();
      }
    },
    initStore() {
      this.fetchLiveState();
    },
    scheduleUpdateNow() {
      setTimeout(this.updateNow, 1000);
    },
    scheduleUpdateStreamState() {
      setTimeout(this.fetchLiveState, 15000);
    },
    async fetchLiveState() {
      try {
        const { isLive, stream } = (await getStream()).data;
        const startedAt = new Date(stream.started_at);
        console.log(startedAt);
        this.stream = {
          isLive,
          title: stream.title,
          category: stream.category_name,
          gameName: stream.game_name,
          startedAt,
          thumbnail: stream.thumbnail_url,
          tags: stream.tags,
        };
      } catch (err) {
        console.log(err);
      } finally {
        this.updateNow();
        this.scheduleUpdateStreamState();
      }
    },
  },
});
