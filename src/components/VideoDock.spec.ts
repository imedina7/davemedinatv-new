import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import VideoDock from "./VideoDock.vue";
import { createMockVideo } from "@/test-utils";

library.add(icons);

const focusDirective = { mounted: (el: any) => el.focus() };

describe("VideoDock", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createRouter({ history: createWebHistory(), routes });
  });

  function globalOpts() {
    return {
      plugins: [pinia, router],
      components: { FontAwesomeIcon },
      directives: { focus: focusDirective },
    };
  }

  it("shows loading skeletons when isLoading", () => {
    const wrapper = mount(VideoDock, {
      props: { title: "Latest", videos: [], isLoading: true },
      global: globalOpts(),
    });
    expect(wrapper.find(".skeleton-element").exists()).toBe(true);
  });

  it("renders title", () => {
    const wrapper = mount(VideoDock, {
      props: { title: "Latest Videos", videos: [] },
      global: globalOpts(),
    });
    expect(wrapper.text()).toContain("Latest Videos");
  });

  it("renders video items", () => {
    const videos = [
      createMockVideo({ id: "1", title: "V1" }),
      createMockVideo({ id: "2", title: "V2" }),
    ];
    const wrapper = mount(VideoDock, {
      props: { title: "Latest", videos },
      global: globalOpts(),
    });
    expect(wrapper.findAllComponents({ name: "VideoItem" }).length).toBe(2);
  });

  it("opens modal when video clicked", async () => {
    const videos = [createMockVideo({ id: "1", title: "V1" })];
    const wrapper = mount(VideoDock, {
      props: { title: "Latest", videos },
      global: globalOpts(),
    });
    await wrapper.findComponent({ name: "VideoItem" }).trigger("click");
    expect(wrapper.findComponent({ name: "ModalWindow" }).exists()).toBe(true);
  });
});
