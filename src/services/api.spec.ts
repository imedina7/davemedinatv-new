import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

const { client } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axios = require("axios");
  return { client: axios.create({ baseURL: "/api" }) };
});

vi.mock("./httpClient", () => ({
  createClient: vi.fn(() => client),
}));

import { getStream } from "./api";

describe("api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(client);
  });

  afterEach(() => {
    mock.restore();
  });

  it("getStream calls GET /twitch/stream", async () => {
    mock.onGet("/twitch/stream").reply(200, { isLive: false, stream: null });
    await getStream();
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe("/twitch/stream");
  });

  it("returns typed response", async () => {
    const data = { isLive: true, stream: { id: "1" } as any };
    mock.onGet("/twitch/stream").reply(200, data);
    const res = await getStream();
    expect(res.status).toBe(200);
    expect(res.data).toEqual(data);
  });
});
