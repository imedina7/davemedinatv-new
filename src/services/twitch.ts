import * as crypto from "crypto";
import { kv } from "@vercel/kv";
import { createClient } from "./httpClient";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { TwitchToken } from "../types/twitch";
import { SubscriptionMethod } from "../types/twitch";

const twitchAuthBaseUrl =
  process.env.TWITCH_AUTH_API_BASE_URL ?? "https://id.twitch.tv/oauth2/token";
const twitchApiBaseUrl =
  process.env.TWITCH_API_BASE_URL ?? "https://api.twitch.tv/helix";

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const userId = process.env.TWITCH_USER_ID;

const authClient = createClient(twitchAuthBaseUrl, {
  "Content-Type": "application/x-www-form-urlencoded",
});

const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  "Twitch-Eventsub-Message-Signature".toLowerCase();

const eventSubSecret = process.env.TWITCH_EVENT_SUB_SECRET ?? "";
const HMAC_PREFIX = "sha256=";

const getHmac = (secret: string, message: string) =>
  crypto.createHmac("sha256", secret).update(message).digest("hex");

const getHmacMessage = (request: Record<string, any>) => {
  if (!request.headers || !request.body) return;
  return (
    request.headers[TWITCH_MESSAGE_ID] +
    request.headers[TWITCH_MESSAGE_TIMESTAMP] +
    JSON.stringify(request.body)
  );
};

const verifyMessage = (hmac: string, verifySignature: string) => {
  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(verifySignature),
  );
};

const getTokenFromTwitch = async () => {
  console.log(
    `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
  );
  return (
    await authClient.post(
      "",
      `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    )
  ).data;
};

const getToken = async () => {
  try {
    console.log("getting token");
    const twitchToken = await kv.hgetall<TwitchToken>("twitch:token");

    if (twitchToken?.expiresAt && twitchToken.expiresAt < Date.now())
      return twitchToken.token;

    console.log("Token not found or expired, requesting a new one...");
    const response = await getTokenFromTwitch();

    await kv.hset<TwitchToken[keyof TwitchToken]>("twitch:token", {
      expiresAt: Date.now() + response.expires_in * 1000,
      token: response.access_token,
    });

    return response.access_token;
  } catch (err) {
    console.log(err);
  }
};

const getClient = async () => {
  console.log("getting client");
  try {
    const token = await getToken();
    return createClient(twitchApiBaseUrl, {
      Authorization: `Bearer ${token}`,
      "Client-Id": clientId,
      "Content-Type": "application/json",
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const subscribeToEvent = async (
  type: string,
  method: SubscriptionMethod = SubscriptionMethod.WEBHOOK,
  sessionId?: string,
  callback?: string,
) => {
  const client = await getClient();
  return client.post("/eventsub/subscriptions", {
    type,
    version: "1",
    condition: { broadcaster_user_id: userId },
    transport: {
      method,
      ...(method === SubscriptionMethod.WEBSOCKET &&
        sessionId && { session_id: sessionId }),
      ...(method === SubscriptionMethod.WEBHOOK &&
        callback && {
          secret: clientSecret,
          callback,
        }),
    },
  });
};

export const getStreamData = async () => {
  const client = await getClient();
  return (await client.get("/streams", { params: { user_id: userId } })).data;
};

export const updateStreamMetadata = async () => {
  const { data } = await getStreamData();

  if (data.length) {
    await kv.hset("stream:metadata", data[0]);
  }
};

export const verifyRequest = (request: Record<string, any>) => {
  if (
    !(
      request.headers[TWITCH_MESSAGE_SIGNATURE] &&
      request.headers[TWITCH_MESSAGE_TIMESTAMP] &&
      request.headers[TWITCH_MESSAGE_ID]
    )
  )
    return false;
  const hmacMessage = getHmacMessage(request);
  if (!hmacMessage) return false;

  const serverHmac = HMAC_PREFIX + getHmac(eventSubSecret, hmacMessage);

  try {
    const verifySignature = request.headers[TWITCH_MESSAGE_SIGNATURE];
    return verifyMessage(serverHmac, verifySignature);
  } catch {
    return false;
  }
};

export const webhookChallengeMiddleware = (
  request: VercelRequest,
  response: VercelResponse,
) => {
  if (
    request.headers["Twitch-Eventsub-Message-Type".toLowerCase()] ===
    "webhook_callback_verification"
  ) {
    response
      .setHeader("Content-Type", "text/plain")
      .status(200)
      .send(request.body.challenge);
    return true;
  }
  return false;
};
