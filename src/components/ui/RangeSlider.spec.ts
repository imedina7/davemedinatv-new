import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RangeSlider from "./RangeSlider.vue";

describe("RangeSlider", () => {
  it("renders input with default props", () => {
    const wrapper = mount(RangeSlider);
    const input = wrapper.find("input[type='range']");
    expect(input.exists()).toBe(true);
    expect(input.attributes("max")).toBe("1");
    expect(input.attributes("min")).toBe("0");
  });

  it("applies value prop", () => {
    const wrapper = mount(RangeSlider, {
      props: { value: 0.5, max: 1, min: 0, step: 0.01 },
    });
    const input = wrapper.find("input[type='range']");
    expect(input.attributes("value")).toBe("0.5");
  });

  it("emits input on change", async () => {
    const wrapper = mount(RangeSlider, { props: { value: 0, max: 1 } });
    const input = wrapper.find("input[type='range']");
    await input.setValue("0.3");
    // setValue triggers input? setValue sets value and triggers input event
    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("emits change event", async () => {
    const wrapper = mount(RangeSlider, { props: { value: 0, max: 1 } });
    const input = wrapper.find("input[type='range']");
    await input.trigger("change");
    // change event may not carry parsed value in test; at least emitted
    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("disabled prop", () => {
    const wrapper = mount(RangeSlider, { props: { disabled: true } });
    const input = wrapper.find("input[type='range']");
    expect(input.attributes("disabled")).toBeDefined();
  });
});
