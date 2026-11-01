import { describe, it, expect, vi, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";

let LivePlayer: any;

beforeAll(() => {
  vi.stubEnv("VITE_TWITCH_LOGIN", "davemedinatv");
  vi.stubEnv("VITE_BASE_URL", "localhost");
});

beforeAll(async () => {
  LivePlayer = (await import("./LivePlayer.vue")).default;
});

describe("LivePlayer", () => {
  it("renders iframe with correct src using env vars", () => {
    const wrapper = mount(LivePlayer);
    const iframe = wrapper.find("iframe");
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("src")).toBe(
      "https://player.twitch.tv/?channel=davemedinatv&parent=localhost",
    );
  });

  it("iframe has allowfullscreen", () => {
    const wrapper = mount(LivePlayer);
    const iframe = wrapper.find("iframe");
    expect(
      (iframe.element as HTMLIFrameElement).hasAttribute("allowfullscreen"),
    ).toBe(true);
  });

  it('iframe has title "Twitch Player"', () => {
    const wrapper = mount(LivePlayer);
    const iframe = wrapper.find("iframe");
    expect(iframe.attributes("title")).toBe("Twitch Player");
  });
});
