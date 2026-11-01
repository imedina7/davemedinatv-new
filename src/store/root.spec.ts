import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useRootStore } from "@/store";

vi.mock("@/services/api", () => ({
  getStream: vi.fn(),
}));

import { getStream } from "@/services/api";

const mockStream = {
  id: "1",
  thumbnail_url: "thumb.jpg",
  type: "live",
  category_name: "Gaming",
  tags: ["tag1"],
  viewer_count: "10",
  user_id: "u",
  is_mature: false,
  title: "Live Title",
  user_name: "Dave",
  content_classification_labels: [],
  language: "en",
  game_id: "g",
  started_at: new Date().toISOString(),
  tag_ids: [],
  user_login: "dave",
  game_name: "GameName",
};

describe("useRootStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initial state matches defaults", () => {
    const store = useRootStore();
    expect(store.stream.title).toBe("Test stream");
    expect(store.stream.isLive).toBe(false);
    expect(store.stream.category).toBe("3D Modelling");
    expect(store.stream.tags).toEqual(["uruguay"]);
    expect(typeof store.now).toBe("number");
  });

  it("fetchLiveState updates state when live", async () => {
    const store = useRootStore();
    (getStream as any).mockResolvedValue({
      data: { isLive: true, stream: mockStream },
    });
    await store.fetchLiveState();
    expect(store.stream.isLive).toBe(true);
    expect(store.stream.title).toBe("Live Title");
    expect(store.stream.gameName).toBe("GameName");
  });

  it("fetchLiveState updates state when offline", async () => {
    const store = useRootStore();
    const offlineStream = { ...mockStream, title: "Offline Title" };
    (getStream as any).mockResolvedValue({
      data: { isLive: false, stream: offlineStream },
    });
    await store.fetchLiveState();
    expect(store.stream.isLive).toBe(false);
    expect(store.stream.title).toBe("Offline Title");
  });

  it("fetchLiveState handles errors", async () => {
    const store = useRootStore();
    (getStream as any).mockRejectedValue(new Error("fail"));
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await store.fetchLiveState();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("updateNow updates now and schedules when live", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const store = useRootStore();
    store.stream.isLive = true;
    const scheduleSpy = vi.spyOn(store, "scheduleUpdateNow");
    store.updateNow();
    expect(store.now).toBe(Date.now());
    expect(scheduleSpy).toHaveBeenCalled();
  });

  it("scheduleUpdateStreamState calls fetchLiveState after timeout", () => {
    vi.useFakeTimers();
    const store = useRootStore();
    (getStream as any).mockResolvedValue({
      data: { isLive: false, stream: mockStream },
    });
    const spy = vi.spyOn(store, "fetchLiveState");
    store.scheduleUpdateStreamState();
    vi.advanceTimersByTime(60000);
    expect(spy).toHaveBeenCalled();
  });

  it("initStore calls fetchLiveState", () => {
    const store = useRootStore();
    const spy = vi.spyOn(store, "fetchLiveState").mockResolvedValue(undefined);
    store.initStore();
    expect(spy).toHaveBeenCalled();
  });
});
