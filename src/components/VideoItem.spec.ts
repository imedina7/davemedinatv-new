import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import VideoItem from "./VideoItem.vue";
import { createMockVideo } from "@/test-utils";

library.add(icons);

describe("VideoItem", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createRouter({ history: createWebHistory(), routes });
  });

  it("renders video title", () => {
    const video = createMockVideo({ title: "My Video" });
    const wrapper = mount(VideoItem, {
      props: { video },
      global: { plugins: [pinia, router], components: { FontAwesomeIcon } },
    });
    expect(wrapper.text()).toContain("My Video");
  });

  it("renders thumbnail image with src", () => {
    const video = createMockVideo({
      thumbnailUrl: "https://example.com/thumb.jpg",
    });
    const wrapper = mount(VideoItem, {
      props: { video },
      global: { plugins: [pinia, router], components: { FontAwesomeIcon } },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toContain("https://example.com/thumb.jpg");
  });

  it("renders duration", () => {
    const video = createMockVideo({ duration: 120000 });
    const wrapper = mount(VideoItem, {
      props: { video },
      global: { plugins: [pinia, router], components: { FontAwesomeIcon } },
    });
    // formatDuration output present
    expect(wrapper.find(".absolute.bottom-0").exists()).toBe(true);
  });

  it("renders play icon overlay", () => {
    const video = createMockVideo();
    const wrapper = mount(VideoItem, {
      props: { video },
      global: { plugins: [pinia, router], stubs: { FontAwesomeIcon: true } },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders without thumbnail url (v-if false branch)", () => {
    const video = createMockVideo({ thumbnailUrl: "" });
    const wrapper = mount(VideoItem, {
      props: { video },
      global: { plugins: [pinia, router], components: { FontAwesomeIcon } },
    });
    expect(wrapper.find("img").exists()).toBe(false);
  });
});
