import {
  verifyRequest,
  webhookChallengeMiddleware,
} from "../../../src/services/twitch";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  webhookChallengeMiddleware(request, response);
  if (!verifyRequest(request)) {
    response
      .setHeader("Content-Type", "text/plain")
      .status(403)
      .send("Forbidden. Failed to verify request");
    return;
  }
  const { subscription } = request.body;

  if (subscription.type === "stream.online") {
    console.log(`user went online !`);
  }
  if (subscription.type === "stream.offline") {
    console.log(`user went offline !`);
  }
  response.status(200).json({ test: "ok" });
}
