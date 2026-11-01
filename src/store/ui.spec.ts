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

  it("swipeTouch horizontal swipe returns early", () => {
    const store = useUiStore();
    store.touchStart({ touches: [{ pageX: 10, pageY: 100 }] } as any);
    store.swipeTouch({ touches: [{ pageX: 100, pageY: 105 }] } as any);
    expect(store.touch.isSwippingX).toBe(true);
  });

  it("swipeTouch when landingRolledUp uses Math.min", () => {
    const store = useUiStore();
    store.landingRolledUp = true;
    store.touchStart({ touches: [{ pageX: 10, pageY: 100 }] } as any);
    store.swipeTouch({ touches: [{ pageX: 10, pageY: 50 }] } as any);
    expect(store.touch.swipeDeltaY).toBeLessThanOrEqual(0);
  });

  it("swipeTouch no TouchEvent returns early", () => {
    const orig = (global as any).TouchEvent;
    (global as any).TouchEvent = undefined;
    const store = useUiStore();
    store.swipeTouch({ touches: [{ pageX: 10, pageY: 50 }] } as any);
    // no crash
    (global as any).TouchEvent = orig;
  });

  it("swipeWheel updates swipeDeltaY within bounds", () => {
    const store = useUiStore();
    store.touch.swipeDeltaY = 0;
    store.swipeWheel({ deltaY: 10, view: { innerHeight: 100 } } as any);
    expect(store.touch.swipeDeltaY).toBe(10);
  });

  it("swipeWheel out of bounds does not update", () => {
    const store = useUiStore();
    store.touch.swipeDeltaY = 0;
    store.swipeWheel({ deltaY: 200, view: { innerHeight: 100 } } as any);
    expect(store.touch.swipeDeltaY).toBe(0);
  });

  it("swipeWheel no innerHeight returns early", () => {
    const store = useUiStore();
    store.swipeWheel({ deltaY: 10, view: {} } as any);
    expect(store.touch.swipeDeltaY).toBe(0);
  });

  it("swipeWheel landingRolledUp unrolls when below threshold", () => {
    const store = useUiStore();
    store.landingRolledUp = true;
    store.touch.swipeDeltaY = 10;
    store.swipeWheel({ deltaY: -5, view: { innerHeight: 100 } } as any);
    expect(store.landingRolledUp).toBe(false);
  });

  it("swipeWheel triggers landingRolledUp when above threshold", () => {
    const store = useUiStore();
    store.touch.swipeDeltaY = 0;
    store.swipeWheel({ deltaY: 40, view: { innerHeight: 100 } } as any);
    expect(store.landingRolledUp).toBe(true);
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

  it("touchEnd triggers $reset when swiping down while rolled up", () => {
    const store = useUiStore();
    store.landingRolledUp = true;
    store.touch.isSwippingY = true;
    store.touch.touchXStart = 10;
    store.touch.touchYStart = 100;
    store.touchEnd({ changedTouches: [{ pageX: 10, pageY: 200 }] } as any);
    // $reset resets state
    expect(store.landingRolledUp).toBe(false);
  });

  it("touchEnd triggers landingRolledUp when swiping up", () => {
    const store = useUiStore();
    store.landingRolledUp = false;
    store.touch.isSwippingY = true;
    store.touch.touchXStart = 10;
    store.touch.touchYStart = 100;
    store.touchEnd({ changedTouches: [{ pageX: 10, pageY: 0 }] } as any);
    expect(store.landingRolledUp).toBe(true);
  });

  it("touchEnd ignores curtain drop when touch starts below top third", () => {
    const store = useUiStore();
    store.landingRolledUp = false;
    store.touch.isSwippingY = true;
    store.touch.touchXStart = 10;
    // Start below top third (window.innerHeight / 3)
    store.touch.touchYStart = (window.innerHeight || 768) * 0.5;
    store.touchEnd({ changedTouches: [{ pageX: 10, pageY: -50 }] } as any);
    expect(store.landingRolledUp).toBe(false);
  });

  it("touchEnd allows curtain drop when touch starts in top third", () => {
    const store = useUiStore();
    store.landingRolledUp = false;
    store.touch.isSwippingY = true;
    store.touch.touchXStart = 10;
    store.touch.touchYStart = 10; // top third
    store.touchEnd({ changedTouches: [{ pageX: 10, pageY: -50 }] } as any);
    expect(store.landingRolledUp).toBe(true);
  });
});
