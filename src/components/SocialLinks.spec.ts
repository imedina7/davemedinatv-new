import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as icons from "@/icons";
import SocialLinks from "./SocialLinks.vue";

library.add(icons);

describe("SocialLinks", () => {
  it("renders list of social links", () => {
    const wrapper = mount(SocialLinks, {
      global: { components: { FontAwesomeIcon } },
    });
    const links = wrapper.findAll("a");
    expect(links.length).toBe(3);
  });

  it("renders aria-labels", () => {
    const wrapper = mount(SocialLinks, {
      global: { components: { FontAwesomeIcon } },
    });
    expect(wrapper.text()).toContain("");
    const first = wrapper.find("a");
    expect(first.attributes("aria-label")).toBeTruthy();
  });

  it("has redes sociales aria-label container", () => {
    const wrapper = mount(SocialLinks, {
      global: { components: { FontAwesomeIcon } },
    });
    expect(wrapper.find('[aria-label="Redes Sociales"]').exists()).toBe(true);
  });
});
