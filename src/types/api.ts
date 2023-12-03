import type { Stream } from "@/types/twitch";

export interface StreamStatus {
  isLive: boolean;
  stream: Stream;
}
