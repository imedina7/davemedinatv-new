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
      swipeDelta: 0,
      touchYStart: 0,
      isSwipping: false,
      landingRolledUp: false,
    },
    now: Date.now(),
  }),

  getters: {
    streamRunTime(state): string {
      const { startedAt } = state.stream;
      return formatDuration(this.now - startedAt.getTime());
    },
  },

  actions: {
    updateNow() {
      this.now = Date.now();

      if (this.stream.isLive) this.scheduleUpdateNow();
    },
    initStore() {
      this.fetchLiveState();
    },
    scheduleUpdateNow() {
      setTimeout(this.updateNow, 1000);
    },

    scheduleUpdateStreamState() {
      setTimeout(() => {
        this.fetchLiveState();
      }, 60000);
    },

    async fetchLiveState() {
      try {
        const { isLive, stream } = (await getStream()).data;
        const startedAt = new Date(stream.started_at);

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

    swipeTouch(event: TouchEvent) {
      console.log(event);
      if (window.TouchEvent) return;
      const delta = this.ui.touchYStart - event.touches[0].pageY;
      if (this.ui.landingRolledUp) {
        this.ui.swipeDelta = Math.min(delta, 0);
        return;
      }
      this.ui.swipeDelta = Math.max(delta, 0);
    },

    swipeWheel(event: WheelEvent) {
      const { innerHeight } = event.view ?? {};

      if (!innerHeight) return;

      if (
        this.ui.swipeDelta + event.deltaY > 0 &&
        this.ui.swipeDelta + event.deltaY < innerHeight - 50
      ) {
        this.ui.swipeDelta += event.deltaY;
      }

      if (this.ui.landingRolledUp) {
        if (this.ui.swipeDelta < innerHeight / 3) {
          this.ui.landingRolledUp = false;
          this.ui.isSwipping = false;
        }
        return;
      }

      if (this.ui.swipeDelta > innerHeight / 3) {
        this.ui.landingRolledUp = true;
        this.ui.isSwipping = false;
      }
    },

    touchStart(ev: TouchEvent) {
      this.ui.swipeDelta = 0;
      this.ui.touchYStart = ev.touches[0].pageY;
      this.ui.isSwipping = true;
    },

    touchEnd(ev: TouchEvent) {
      this.ui.isSwipping = false;
      const touchEnd = ev.changedTouches[0].pageY;

      this.ui.swipeDelta = this.ui.touchYStart - touchEnd;
      this.ui.touchYStart = 0;

      if (this.ui.landingRolledUp && this.ui.swipeDelta < -150) {
        this.ui.landingRolledUp = false;
        return;
      }
      if (!this.ui.landingRolledUp && this.ui.swipeDelta > 150)
        this.ui.landingRolledUp = true;
    },
  },
});
