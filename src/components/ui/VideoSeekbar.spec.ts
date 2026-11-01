import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import VideoSeekbar from "./VideoSeekbar.vue";

describe("VideoSeekbar", () => {
  it("renders progress width based on value/max", () => {
    const wrapper = mount(VideoSeekbar, {
      props: { value: 50, max: 100 },
    });
    const progress = wrapper.find(".progress");
    expect(progress.attributes("style")).toContain("width: 50%");
  });

  it("defaults value to 0", () => {
    const wrapper = mount(VideoSeekbar, {
      props: { max: 100 },
    });
    const progress = wrapper.find(".progress");
    expect(progress.attributes("style")).toContain("width: 0%");
  });

  it("emits input and seek on mouse interaction", async () => {
    const wrapper = mount(VideoSeekbar, {
      props: { value: 0, max: 100 },
    });
    const root = wrapper.find("div");
    // mock getBoundingClientRect
    root.element.getBoundingClientRect = () =>
      ({
        left: 0,
        width: 100,
        top: 0,
        height: 6,
        right: 100,
        bottom: 6,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as any;
    await root.trigger("mousedown", { clientX: 25 });
    // mouseup triggers seek
    document.dispatchEvent(new MouseEvent("mouseup"));
    // seek emitted
    expect(wrapper.emitted("seek")).toBeTruthy();
  });
});
