import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUiStore } from "@/store";

describe("useUiStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    (global as any).TouchEvent = class TouchEvent {};
    (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    };
  });

  it("initial state has isLiveModalOpen false", () => {
    const store = useUiStore();
    expect(store.isLiveModalOpen).toBe(false);
  });

  it("openLiveModal sets isLiveModalOpen true", () => {
    const store = useUiStore();
    store.openLiveModal();
    expect(store.isLiveModalOpen).toBe(true);
  });

  it("closeLiveModal sets isLiveModalOpen false", () => {
    const store = useUiStore();
    store.isLiveModalOpen = true;
    store.closeLiveModal();
    expect(store.isLiveModalOpen).toBe(false);
  });

  it("swipeTouch sets swipe direction", () => {
    const store = useUiStore();
    store.touchStart({ touches: [{ pageX: 10, pageY: 100 }] } as any);
    store.swipeTouch({ touches: [{ pageX: 10, pageY: 50 }] } as any);
    expect(store.touch.isSwippingY).toBe(true);
    expect(store.touch.swipeDeltaY).toBe(50);
  });

  it("swipeWheel updates swipeDeltaY within bounds", () => {
    const store = useUiStore();
    store.touch.swipeDeltaY = 0;
    store.swipeWheel({ deltaY: 10, view: { innerHeight: 100 } } as any);
    expect(store.touch.swipeDeltaY).toBe(10);
  });

  it("touchStart records coordinates", () => {
    const store = useUiStore();
    store.touchStart({ touches: [{ pageX: 5, pageY: 7 }] } as any);
    expect(store.touch.touchXStart).toBe(5);
    expect(store.touch.touchYStart).toBe(7);
    expect(store.touch.swipeDeltaX).toBe(0);
    expect(store.touch.swipeDeltaY).toBe(0);
  });

  it("touchEnd computes delta", () => {
    const store = useUiStore();
    store.touch.touchXStart = 10;
    store.touch.touchYStart = 20;
    store.touchEnd({ changedTouches: [{ pageX: 4, pageY: 8 }] } as any);
    expect(store.touch.swipeDeltaX).toBe(6);
    expect(store.touch.swipeDeltaY).toBe(12);
    expect(store.touch.touchXStart).toBe(0);
    expect(store.touch.touchYStart).toBe(0);
  });
});
