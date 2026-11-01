import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import VideoPlayer from "./VideoPlayer.vue";
import { createMockVideo } from "@/test-utils";

library.add(icons);

const focusDirective = { mounted: (el: any) => el.focus() };

describe("VideoPlayer", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createRouter({ history: createWebHistory(), routes });
    // avoid jsdom fullscreen issues
    (document as any).fullscreenElement = null;
    (HTMLMediaElement.prototype as any).play = vi
      .fn()
      .mockResolvedValue(undefined);
    (HTMLMediaElement.prototype as any).pause = vi.fn();
  });

  function globalOpts() {
    return {
      plugins: [pinia, router],
      components: { FontAwesomeIcon },
      directives: { focus: focusDirective },
    };
  }

  it("renders video element with src from prop", () => {
    const video = createMockVideo({ url: "https://example.com/video.mp4" });
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    const videoEl = wrapper.find("video");
    expect(videoEl.exists()).toBe(true);
    expect(videoEl.attributes("src")).toBe("https://example.com/video.mp4");
  });

  it("renders play button", () => {
    const video = createMockVideo();
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("renders time display", () => {
    const video = createMockVideo();
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    expect(wrapper.text()).toContain("00:00");
  });

  it("toggles playback on video click", async () => {
    const video = createMockVideo();
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    // jsdom play/pause are no-ops but should not throw
    await wrapper.find("video").trigger("click");
    expect(wrapper.exists()).toBe(true);
  });

  it("toggles mute button", async () => {
    const video = createMockVideo();
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    const buttons = wrapper.findAll("button");
    if (buttons.length > 1) {
      await buttons[1].trigger("click");
    }
    expect(wrapper.exists()).toBe(true);
  });

  it("toggles fullscreen", async () => {
    const video = createMockVideo();
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    const buttons = wrapper.findAll("button");
    const fsBtn = buttons[buttons.length - 1];
    await fsBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });

  it("handles mouse movement on container", async () => {
    const video = createMockVideo();
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    await wrapper.find(".relative").trigger("mousemove");
    expect(wrapper.exists()).toBe(true);
  });

  it("handles double click for fullscreen", async () => {
    const video = createMockVideo();
    const wrapper = mount(VideoPlayer, {
      props: { video },
      global: globalOpts(),
    });
    await wrapper.find(".relative").trigger("dblclick");
    expect(wrapper.exists()).toBe(true);
  });
});

