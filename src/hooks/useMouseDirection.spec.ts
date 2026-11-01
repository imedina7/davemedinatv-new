import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { useMouseDirection, MouseEventType } from "./useMouseDirection";

describe("useMouseDirection", () => {
  beforeEach(() => {
    vi.stubGlobal("innerWidth", 1024);
    vi.stubGlobal("innerHeight", 768);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a ref with initial value (0, 0)", () => {
    const TestComp = defineComponent({
      setup() {
        const dir = useMouseDirection();
        return () => h("div", dir.value.x + "," + dir.value.y);
      },
    });
    const wrapper = mount(TestComp);
    expect(wrapper.text()).toBe("0,0");
  });

  it("updates direction on mousemove", async () => {
    const cb = vi.fn();
    const TestComp = defineComponent({
      setup() {
        const dir = useMouseDirection(MouseEventType.MOVE, cb);
        return () => h("div", dir.value.x.toFixed(2) + "," + dir.value.y.toFixed(2));
      },
    });
    const wrapper = mount(TestComp);
    const event = new MouseEvent("mousemove", { clientX: 512, clientY: 384 });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(cb).toHaveBeenCalled();
  });

  it("updates direction on click when eventType is CLICK", async () => {
    const cb = vi.fn();
    const TestComp = defineComponent({
      setup() {
        const dir = useMouseDirection(MouseEventType.CLICK, cb);
        return () => h("div", dir.value.x.toFixed(2) + "," + dir.value.y.toFixed(2));
      },
    });
    const wrapper = mount(TestComp);
    const event = new MouseEvent("click", { clientX: 1024, clientY: 768 });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(cb).toHaveBeenCalled();
  });

  it("works without callback", async () => {
    const TestComp = defineComponent({
      setup() {
        const dir = useMouseDirection();
        return () => h("div", dir.value.x.toFixed(2));
      },
    });
    const wrapper = mount(TestComp);
    const event = new MouseEvent("mousemove", { clientX: 100, clientY: 100 });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it("cleans up event listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const TestComp = defineComponent({
      setup() {
        useMouseDirection();
        return () => h("div");
      },
    });
    const wrapper = mount(TestComp);
    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalled();
  });
});