import { ALL_VIDEOS_QUERY } from "@/services/queries";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";

export function useVideos() {
  const { result, loading, error } = useQuery(ALL_VIDEOS_QUERY);

  const videos = computed(
    () =>
      result.value?.videoCollection.items.map((video: any) => ({
        id: video.id,
        url: video.media.url,
        title: video.title,
        duration: video.duration,
        thumbnailUrl: video.thumbnail.url,
      })) ?? [],
  );
  return { videos, loading, error };
}
