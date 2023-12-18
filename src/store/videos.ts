import { defineStore } from "pinia";

export const useVideos = defineStore("videos", {
  state: () => ({
    latest: [],
    mostWatched: [],
  }),
});
