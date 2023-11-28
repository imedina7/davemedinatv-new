import * as crypto from "crypto";
import { createClient } from "./httpClient";
import type { VercelRequest, VercelResponse } from "@vercel/node";

enum SubscriptionMethod {
  WEBSOCKET = "websocket",
  WEBHOOK = "webhook",
}

const twitchAuthBaseUrl =
  process.env.TWITCH_AUTH_API_BASE_URL ?? "https://id.twitch.tv/oauth2/token";
const twitchApiBaseUrl =
  process.env.TWITCH_API_BASE_URL ?? "https://api.twitch.tv/helix/";

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const userId = process.env.TWITCH_USER_ID;
const redirectUri = process.env.TWITCH_REDIRECT_URI;

const authClient = createClient(twitchAuthBaseUrl);

const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  "Twitch-Eventsub-Message-Signature".toLowerCase();

const eventSubSecret = process.env.TWITCH_EVENT_SUB_SECRET ?? "";
const HMAC_PREFIX = "sha256=";

export const getToken = () =>
  authClient.post("", {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

const client = createClient(twitchApiBaseUrl, {
  Authorization: `Bearer ${getToken()}`,
  "Client-Id": clientId,
  "Content-Type": "application/json",
});

export const subscribeToEvent = (
  type: string,
  method: SubscriptionMethod = SubscriptionMethod.WEBHOOK,
  sessionId?: string,
  callback?: string,
) => {
  client.post("/eventsub/subscriptions", {
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

const getHmac = (secret: string, message: string) =>
  crypto.createHmac("sha256", secret).update(message).digest("hex");

export const getHmacMessage = (request: Record<string, any>) => {
  if (!request.headers || !request.body) return;
  return (
    request.headers[TWITCH_MESSAGE_ID] +
    request.headers[TWITCH_MESSAGE_TIMESTAMP] +
    JSON.stringify(request.body)
  );
};

export const verifyMessage = (hmac: string, verifySignature: string) => {
  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(verifySignature),
  );
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
