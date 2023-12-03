import {
  updateStreamMetadata,
  verifyRequest,
  webhookChallengeMiddleware,
} from "../../../src/services/twitch";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (webhookChallengeMiddleware(request, response)) return;
  if (!verifyRequest(request)) {
    response
      .setHeader("Content-Type", "text/plain")
      .status(403)
      .send("Forbidden. Failed to verify request");
    return;
  }

  const { subscription } = request.body;
  try {
    switch (subscription.type) {
      case "stream.online":
        await kv.set<boolean>("stream:status", true);
        await updateStreamMetadata();
        break;

      case "stream.offline":
        console.log(`user went offline !`);
        await kv.set<boolean>("stream:status", false);
        break;

      case "channel.update":
        await updateStreamMetadata();
        break;
      default:
        response.status(400).json({ error: "Invalid Event" });
        return;
    }

    response.status(200).json({ message: "ok" });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "failed to update stream status" });
  }
}
