import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SectionContainer from "./SectionContainer.vue";

describe("SectionContainer", () => {
  it("renders slot content", () => {
    const wrapper = mount(SectionContainer, {
      slots: { default: "<p>hello section</p>" },
    });
    expect(wrapper.text()).toContain("hello section");
  });

  it("renders container div", () => {
    const wrapper = mount(SectionContainer);
    expect(wrapper.find("div").exists()).toBe(true);
  });
});
