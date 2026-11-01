import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import NavBar from "./NavBar.vue";
import { useRootStore, useUiStore } from "@/store";

library.add(icons);

describe("NavBar", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createRouter({ history: createWebHistory(), routes });
    vi.clearAllMocks();
  });

  function mountNavBar(isLive = false) {
    const rootStore = useRootStore();
    rootStore.stream.isLive = isLive;
    const uiStore = useUiStore();
    vi.spyOn(uiStore, "openLiveModal");
    return mount(NavBar, {
      global: {
        plugins: [pinia, router],
        components: { FontAwesomeIcon },
      },
    });
  }

  it("renders nav", () => {
    const wrapper = mountNavBar(false);
    expect(wrapper.find("nav").exists()).toBe(true);
  });

  it("renders logo", () => {
    const wrapper = mountNavBar(false);
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders videos link", () => {
    const wrapper = mountNavBar(false);
    const link = wrapper.find('a[href="/videos"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain("videos");
  });

  it('shows "en vivo" button when stream.isLive is true', () => {
    const wrapper = mountNavBar(true);
    const button = wrapper.find('[aria-label="Watch live stream"]');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain("en vivo");
  });

  it("hides button when stream.isLive is false", () => {
    const wrapper = mountNavBar(false);
    expect(wrapper.find('[aria-label="Watch live stream"]').exists()).toBe(
      false,
    );
  });

  it("displays stream runtime when live", () => {
    const wrapper = mountNavBar(true);
    const button = wrapper.find('[aria-label="Watch live stream"]');
    expect(button.text()).toMatch(/en vivo/);
  });

  it("button is a <button> element", () => {
    const wrapper = mountNavBar(true);
    const button = wrapper.find('[aria-label="Watch live stream"]');
    expect(button.element.tagName).toBe("BUTTON");
  });

  it("button click calls ui.openLiveModal()", async () => {
    const wrapper = mountNavBar(true);
    const uiStore = useUiStore();
    await wrapper.find('[aria-label="Watch live stream"]').trigger("click");
    expect(uiStore.openLiveModal).toHaveBeenCalled();
  });

  it("button has aria-label", () => {
    const wrapper = mountNavBar(true);
    const button = wrapper.find('[aria-label="Watch live stream"]');
    expect(button.attributes("aria-label")).toBe("Watch live stream");
  });
});
