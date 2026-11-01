import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockRedis,
  mockUpdateStreamMetadata,
  mockVerifyRequest,
  mockWebhookChallengeMiddleware,
} = vi.hoisted(() => ({
  mockRedis: {
    set: vi.fn(),
    get: vi.fn(),
    hgetall: vi.fn(),
    hset: vi.fn(),
  },
  mockUpdateStreamMetadata: vi.fn(),
  mockVerifyRequest: vi.fn(),
  mockWebhookChallengeMiddleware: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(() => mockRedis),
  },
}));

vi.mock("../../../src/services/twitch", () => ({
  updateStreamMetadata: mockUpdateStreamMetadata,
  verifyRequest: mockVerifyRequest,
  webhookChallengeMiddleware: mockWebhookChallengeMiddleware,
}));

vi.mock("@/services/twitch", () => ({
  updateStreamMetadata: mockUpdateStreamMetadata,
  verifyRequest: mockVerifyRequest,
  webhookChallengeMiddleware: mockWebhookChallengeMiddleware,
}));

import handler from "./live";

describe("api/twitch/events/live", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWebhookChallengeMiddleware.mockReturnValue(false);
    mockVerifyRequest.mockReturnValue(true);
    mockRedis.set.mockResolvedValue("OK");
    mockUpdateStreamMetadata.mockResolvedValue(undefined);
  });

  const makeRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    setHeader: vi.fn().mockReturnThis(),
    send: vi.fn(),
  });

  it("stream.online: sets stream:status true and calls updateStreamMetadata", async () => {
    const req = {
      method: "POST",
      headers: {},
      body: { subscription: { type: "stream.online" } },
    } as any;
    const res = makeRes() as any;

    await handler(req, res);

    expect(mockRedis.set).toHaveBeenCalledWith("stream:status", true);
    expect(mockUpdateStreamMetadata).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("stream.offline: sets stream:status false", async () => {
    const req = {
      method: "POST",
      headers: {},
      body: { subscription: { type: "stream.offline" } },
    } as any;
    const res = makeRes() as any;

    await handler(req, res);

    expect(mockRedis.set).toHaveBeenCalledWith("stream:status", false);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("channel.update: calls updateStreamMetadata", async () => {
    const req = {
      method: "POST",
      headers: {},
      body: { subscription: { type: "channel.update" } },
    } as any;
    const res = makeRes() as any;

    await handler(req, res);

    expect(mockUpdateStreamMetadata).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("unknown type: returns 400", async () => {
    const req = {
      method: "POST",
      headers: {},
      body: { subscription: { type: "stream.unknown" } },
    } as any;
    const res = makeRes() as any;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Event" });
  });

  it("invalid signature: returns 403", async () => {
    mockVerifyRequest.mockReturnValue(false);

    const req = {
      method: "POST",
      headers: {},
      body: { subscription: { type: "stream.online" } },
    } as any;
    const res = makeRes() as any;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(
      "Forbidden. Failed to verify request",
    );
  });

  it("webhook challenge verification: returns 200 with challenge", async () => {
    mockWebhookChallengeMiddleware.mockImplementation((req: any, res: any) => {
      res
        .setHeader("Content-Type", "text/plain")
        .status(200)
        .send(req.body.challenge);
      return true;
    });

    const req = {
      method: "POST",
      headers: {},
      body: { challenge: "abc123" },
    } as any;
    const res = makeRes() as any;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("abc123");
  });
});
