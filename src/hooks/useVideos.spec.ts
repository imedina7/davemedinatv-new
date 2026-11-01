import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import { useVideos } from "@/hooks/useVideos";

vi.mock("@vue/apollo-composable", () => ({
  useQuery: vi.fn(() => ({
    result: ref(undefined),
    loading: ref(true),
    error: ref(null),
  })),
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
});
