import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    latest: [],
    mostWatched: [],
  }),
});
