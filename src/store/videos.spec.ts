import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useVideos } from "./videos";

describe("useVideos store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("has initial state with empty arrays", () => {
    const store = useVideos();
    expect(store.latest).toEqual([]);
    expect(store.mostWatched).toEqual([]);
  });

  it("allows setting latest videos", () => {
    const store = useVideos();
    store.latest = [{ id: "1", title: "Test" }] as any;
    expect(store.latest).toHaveLength(1);
  });

  it("allows setting mostWatched videos", () => {
    const store = useVideos();
    store.mostWatched = [{ id: "2", title: "Test2" }] as any;
    expect(store.mostWatched).toHaveLength(1);
  });
});