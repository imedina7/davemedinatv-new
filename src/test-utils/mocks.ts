import type { Stream } from "@/types/twitch";
import type { StreamStatus } from "@/types/api";
import type { Video } from "@/types/video";

export function createMockStream(overrides?: Partial<Stream>): Stream {
  return {
    id: "1",
    thumbnail_url: "https://example.com/thumbnail.jpg",
    type: "live",
    category_name: "Just Chatting",
    tags: [],
    viewer_count: "100",
    user_id: "123",
    is_mature: false,
    title: "Test Stream",
    user_name: "testuser",
    content_classification_labels: [],
    language: "en",
    game_id: "0",
    started_at: new Date().toISOString(),
    tag_ids: [],
    user_login: "testuser",
    game_name: "Just Chatting",
    ...overrides,
  };
}

export function createMockStreamStatus(
  isLive: boolean,
  overrides?: Partial<StreamStatus>,
): StreamStatus {
  return {
    isLive,
    stream: createMockStream(),
    ...overrides,
  };
}

export function createMockVideo(overrides?: Partial<Video>): Video {
  return {
    id: "1",
    url: "https://example.com/video.mp4",
    title: "Test Video",
    thumbnailUrl: "https://example.com/thumbnail.jpg",
    ...overrides,
  };
}
