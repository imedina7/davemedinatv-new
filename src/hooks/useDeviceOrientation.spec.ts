import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { useDeviceOrientation } from "./useDeviceOrientation";

describe("useDeviceOrientation", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns initial values", () => {
    const TestComp = defineComponent({
      setup() {
        const { alpha, beta, gamma, supported, permissionGranted } =
          useDeviceOrientation();
        return () =>
          h(
            "div",
            `${alpha.value},${beta.value},${gamma.value},${supported.value},${permissionGranted.value}`,
          );
      },
    });
    const wrapper = mount(TestComp);
    expect(wrapper.text()).toContain("0,0,0");
  });

  it("isMobile returns true for mobile user agent", () => {
    const TestComp = defineComponent({
      setup() {
        const { isMobile } = useDeviceOrientation();
        return () => h("div", String(isMobile()));
      },
    });
    const wrapper = mount(TestComp);
    expect(wrapper.text()).toBe("true");
  });

  it("requestPermission grants on non-iOS", async () => {
    // Remove requestPermission from DeviceOrientationEvent
    (global as any).DeviceOrientationEvent = function () {};
    const TestComp = defineComponent({
      setup() {
        const { requestPermission, permissionGranted } = useDeviceOrientation();
        return () => {
          requestPermission();
          return h("div", String(permissionGranted.value));
        };
      },
    });
    const wrapper = mount(TestComp);
    // permission should be granted (non-iOS path)
    expect(wrapper.text()).toBe("true");
  });

  it("start/stop toggle listening", () => {
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" });
    delete (window as any).ontouchstart;
    (global as any).DeviceOrientationEvent = function () {};
    const TestComp = defineComponent({
      setup() {
        const { start, stop, listening } = useDeviceOrientation();
        start();
        const wasListening = listening.value;
        stop();
        return () => h("div", `${wasListening},${listening.value}`);
      },
    });
    const wrapper = mount(TestComp);
    expect(wrapper.text()).toBe("true,false");
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)" });
    (window as any).ontouchstart = undefined;
  });

  it("handles deviceorientation event", () => {
    (global as any).DeviceOrientationEvent = function () {};
    const addSpy = vi.spyOn(window, "addEventListener");
    const TestComp = defineComponent({
      setup() {
        const { start, alpha, beta, gamma } = useDeviceOrientation();
        start();
        return () => h("div", `${alpha.value},${beta.value},${gamma.value}`);
      },
    });
    const wrapper = mount(TestComp);
    expect(addSpy).toHaveBeenCalledWith("deviceorientation", expect.any(Function));
  });
});
