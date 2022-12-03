<script setup lang="ts">
import { computed } from "vue";
import gql from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";

const ALL_POSTS_QUERY = gql`
  query ALL_POSTS_QUERY {
    videoCollection {
      total
      items {
        sys {
          id
        }
        title
        description {
          json
        }
        thumbnail {
          url
        }
      }
    }
  }
`;

const { result, loading, error } = useQuery(ALL_POSTS_QUERY);
const videos = computed(() => result.value?.videoCollection.items ?? []);
if (error) console.log(error);
</script>
<template>
  <main class="bg-black h-screen">
    <div class="container text-gray-200">
      <h1>Videos</h1>
      <div class="">
        <div
          v-for="video in videos"
          :key="video.sys.id"
          class="w-80 h-20 border border-gray-700 rounded-sm bg-gray-900"
        >
          <span class="font-bold text-sm">{{ video.title }}</span>
          <div v-if="video.thumbnail">
            <img :src="video.thumbnail.url" :alt="`${video.title} thumbnail`" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
