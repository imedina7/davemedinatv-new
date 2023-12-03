import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const isLive = await kv.get("stream:status");
    const stream = await kv.hgetall("stream:metadata");
    response.status(200).json({
      isLive,
      stream,
    });
  } catch {
    response.status(500).json({
      error: "Failed to get stream status",
    });
  }
}
