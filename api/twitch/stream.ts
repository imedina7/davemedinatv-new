import { redis } from "../redisClient";
import type { VercelRequest, VercelResponse } from "@vercel/node";
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const isLive = await redis.get<boolean>("stream:status");
    const stream = await redis.hgetall("stream:metadata");
    response.status(200).json({
      isLive,
      stream,
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      error: "Failed to get stream status",
    });
  }
}
