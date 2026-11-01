import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "crypto";
import MockAdapter from "axios-mock-adapter";

vi.hoisted(() => {
  process.env.TWITCH_CLIENT_ID = "client-id";
  process.env.TWITCH_CLIENT_SECRET = "client-secret";
  process.env.TWITCH_USER_ID = "user-id";
  process.env.TWITCH_EVENT_SUB_SECRET = "event-secret";
  process.env.TWITCH_AUTH_API_BASE_URL = "https://auth.example.com";
  process.env.TWITCH_API_BASE_URL = "https://api.example.com";
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.com";
  process.env.UPSTASH_REDIS_REST_TOKEN = "redis-token";
});

const { mockRedis } = vi.hoisted(() => {
  const mockRedis = {
    hgetall: vi.fn(),
    hset: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  };
  return { mockRedis };
});

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: vi.fn(() => mockRedis) },
}));

const { mockHttp } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axios = require("axios");
  return { mockHttp: axios.create() };
});

vi.mock("./httpClient", () => ({
  createClient: vi.fn(() => mockHttp),
}));

import {
  getToken,
  getClient,
  subscribeToEvent,
  getStreamData,
  updateStreamMetadata,
  verifyRequest,
  webhookChallengeMiddleware,
} from "./twitch";
import { SubscriptionMethod } from "@/types/twitch";

describe("twitch", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(mockHttp);
    vi.clearAllMocks();
    mockRedis.hgetall.mockReset();
    mockRedis.hset.mockReset();
    mockRedis.get.mockReset();
    mockRedis.set.mockReset();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getToken", () => {
    it("returns cached token if not expired", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() + 100000,
        token: "cached-token",
      });

      const token = await getToken();

      expect(token).toBe("cached-token");
      expect(mock.history.post.length).toBe(0);
    });

    it("fetches new token if expired", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() - 1000,
        token: "old-token",
      });
      mock.onPost(/.*/).reply(200, {
        access_token: "new-token",
        expires_in: 3600,
      });

      const token = await getToken();

      expect(token).toBe("new-token");
    });

    it("fetches new token if missing", async () => {
      mockRedis.hgetall.mockResolvedValue(null);
      mock.onPost(/.*/).reply(200, {
        access_token: "new-token",
        expires_in: 3600,
      });

      const token = await getToken();

      expect(token).toBe("new-token");
    });

    it("stores new token in Redis", async () => {
      mockRedis.hgetall.mockResolvedValue(null);
      mock.onPost(/.*/).reply(200, {
        access_token: "new-token",
        expires_in: 3600,
      });

      await getToken();

      expect(mockRedis.hset).toHaveBeenCalledWith(
        "twitch:token",
        expect.objectContaining({
          token: "new-token",
          expiresAt: expect.any(Number),
        }),
      );
    });
  });

  describe("getStreamData", () => {
    it("calls /streams with user_id param", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() + 100000,
        token: "cached-token",
      });
      mock.onGet("/streams").reply(200, { data: [{ id: "1" }] });

      const result = await getStreamData();

      expect(result).toEqual({ data: [{ id: "1" }] });
      expect(mock.history.get.length).toBe(1);
      expect(mock.history.get[0].url).toBe("/streams");
      expect(mock.history.get[0].params).toEqual({ user_id: "user-id" });
    });
  });

  describe("verifyRequest", () => {
    const secret = "event-secret";

    it("returns true for valid HMAC", () => {
      const body = { foo: "bar" };
      const messageId = "msg-id";
      const timestamp = "12345";
      const hmacMessage = messageId + timestamp + JSON.stringify(body);
      const signature =
        "sha256=" +
        crypto.createHmac("sha256", secret).update(hmacMessage).digest("hex");

      const req = {
        headers: {
          "twitch-eventsub-message-id": messageId,
          "twitch-eventsub-message-timestamp": timestamp,
          "twitch-eventsub-message-signature": signature,
        },
        body,
      };

      expect(verifyRequest(req)).toBe(true);
    });

    it("returns false for invalid signature", () => {
      const body = { foo: "bar" };
      const req = {
        headers: {
          "twitch-eventsub-message-id": "msg-id",
          "twitch-eventsub-message-timestamp": "12345",
          "twitch-eventsub-message-signature": "sha256=invalid",
        },
        body,
      };

      expect(verifyRequest(req)).toBe(false);
    });

    it("returns false when headers missing", () => {
      expect(verifyRequest({})).toBe(false);
      expect(
        verifyRequest({
          headers: {},
          body: { foo: "bar" },
        }),
      ).toBe(false);
    });
  });

  describe("webhookChallengeMiddleware", () => {
    it("returns true + sends challenge for verification request", () => {
      const req = {
        headers: {
          "twitch-eventsub-message-type": "webhook_callback_verification",
        },
        body: { challenge: "challenge-string" },
      } as any;
      const res = {
        setHeader: vi.fn().mockReturnThis(),
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      const result = webhookChallengeMiddleware(req, res);

      expect(result).toBe(true);
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/plain");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("challenge-string");
    });

    it("returns false for non-verification request", () => {
      const req = {
        headers: { "twitch-eventsub-message-type": "notification" },
        body: { foo: "bar" },
      } as any;
      const res = {
        setHeader: vi.fn().mockReturnThis(),
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      const result = webhookChallengeMiddleware(req, res);

      expect(result).toBe(false);
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe("updateStreamMetadata", () => {
    it("stores stream data in Redis when live", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() + 100000,
        token: "cached-token",
      });
      mock.onGet("/streams").reply(200, {
        data: [{ id: "1", title: "Live" }],
      });

      await updateStreamMetadata();

      expect(mockRedis.hset).toHaveBeenCalledWith("stream:metadata", {
        id: "1",
        title: "Live",
      });
    });

    it("does not store when no data", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() + 100000,
        token: "cached-token",
      });
      mock.onGet("/streams").reply(200, { data: [] });

      await updateStreamMetadata();

      expect(mockRedis.hset).not.toHaveBeenCalled();
    });
  });

  describe("getClient", () => {
    it("returns client with token", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() + 100000,
        token: "cached-token",
      });
      const client = await getClient();
      expect(client).toBeDefined();
    });

    it("returns client even when redis fails (token undefined)", async () => {
      mockRedis.hgetall.mockRejectedValue(new Error("redis down"));
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const client = await getClient();
      expect(client).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe("subscribeToEvent", () => {
    it("subscribes via webhook", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() + 100000,
        token: "cached-token",
      });
      mock.onPost("/eventsub/subscriptions").reply(200, { data: {} });

      const result = await subscribeToEvent("stream.online", SubscriptionMethod.WEBHOOK, "https://callback.url");

      expect(result).toBeDefined();
      expect(mock.history.post.length).toBe(1);
    });

    it("subscribes via websocket", async () => {
      mockRedis.hgetall.mockResolvedValue({
        expiresAt: Date.now() + 100000,
        token: "cached-token",
      });
      mock.onPost("/eventsub/subscriptions").reply(200, { data: {} });

      const result = await subscribeToEvent("stream.online", SubscriptionMethod.WEBSOCKET, undefined, "session-123");

      expect(result).toBeDefined();
    });
  });

  describe("getToken error handling", () => {
    it("logs error when redis fails", async () => {
      mockRedis.hgetall.mockRejectedValue(new Error("redis down"));
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const token = await getToken();
      expect(token).toBeUndefined();
      consoleSpy.mockRestore();
    });
  });
});
