import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockRedis } = vi.hoisted(() => ({
  mockRedis: {
    get: vi.fn(),
    hgetall: vi.fn(),
  },
}));

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(() => mockRedis),
  },
}));

import handler from "./stream";

describe("api/twitch/stream", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with {isLive, stream} from Redis", async () => {
    mockRedis.get.mockResolvedValue(true);
    mockRedis.hgetall.mockResolvedValue({ id: "1", title: "Test" });

    const req = { method: "GET", headers: {}, body: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as any;

    await handler(req, res);

    expect(mockRedis.get).toHaveBeenCalledWith("stream:status");
    expect(mockRedis.hgetall).toHaveBeenCalledWith("stream:metadata");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      isLive: true,
      stream: { id: "1", title: "Test" },
    });
  });

  it("returns 500 with error when Redis fails", async () => {
    mockRedis.get.mockRejectedValue(new Error("redis down"));

    const req = { method: "GET", headers: {}, body: {} } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as any;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to get stream status",
    });
  });
});
