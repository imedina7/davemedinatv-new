import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import ModalWindow from "./ModalWindow.vue";

library.add(icons);

const focusDirective = { mounted: (el: any) => el.focus() };

describe("ModalWindow", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createRouter({ history: createWebHistory(), routes });
  });

  function mountModal(slots?: any) {
    return mount(ModalWindow, {
      slots,
      global: {
        plugins: [pinia, router],
        components: { FontAwesomeIcon },
        directives: { focus: focusDirective },
      },
    });
  }

  it("renders slot content", () => {
    const wrapper = mountModal({
      default: "<div class='slot-content'>hello</div>",
    });
    expect(wrapper.text()).toContain("hello");
  });

  it("emits close on backdrop click", async () => {
    const wrapper = mountModal({ default: "<div>content</div>" });
    await wrapper.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits close on Escape key", async () => {
    const wrapper = mountModal({ default: "<div>content</div>" });
    await wrapper.trigger("keydown", { code: "Escape" });
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("does not emit close on inner content click", async () => {
    const wrapper = mountModal({
      default: "<div class='inner-content'>content</div>",
    });
    await wrapper.find(".inner-content").trigger("click");
    expect(wrapper.emitted("close")).toBeFalsy();
  });

  it("renders close button", () => {
    const wrapper = mountModal({ default: "<div>content</div>" });
    expect(wrapper.find(".cursor-pointer").exists()).toBe(true);
  });

  it("emits close on close button click", async () => {
    const wrapper = mountModal({ default: "<div>content</div>" });
    await wrapper.find(".cursor-pointer").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
