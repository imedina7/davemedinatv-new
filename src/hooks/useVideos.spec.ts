import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import { useVideos } from "@/hooks/useVideos";

const mockQueryResult = vi.fn(() => ({
  result: ref(undefined as any),
  loading: ref(true),
  error: ref(null as any),
}));

vi.mock("@vue/apollo-composable", () => ({
  useQuery: (...args: any[]) => mockQueryResult(),
}));

describe("useVideos", () => {
  it("returns videos and loading state", () => {
    const { videos, loading, error } = useVideos();
    expect(Array.isArray(videos.value)).toBe(true);
    expect(typeof loading.value).toBe("boolean");
    expect(error.value).toBeNull();
  });

  it("loading true initially", () => {
    const { loading } = useVideos();
    expect(loading.value).toBe(true);
  });

  it("maps video data when result available", () => {
    mockQueryResult.mockReturnValueOnce({
      result: ref({
        videoCollection: {
          items: [
            {
              id: "v1",
              title: "Video 1",
              duration: 120,
              media: { url: "https://example.com/v1.mp4" },
              thumbnail: { url: "https://example.com/v1.jpg" },
            },
          ],
        },
      }),
      loading: ref(false),
      error: ref(null),
    });
    const { videos, loading } = useVideos();
    expect(videos.value).toHaveLength(1);
    expect(videos.value[0].id).toBe("v1");
    expect(videos.value[0].title).toBe("Video 1");
    expect(loading.value).toBe(false);
  });

  it("returns empty array when result is undefined", () => {
    mockQueryResult.mockReturnValueOnce({
      result: ref(undefined),
      loading: ref(false),
      error: ref(null),
    });
    const { videos } = useVideos();
    expect(videos.value).toEqual([]);
  });
});