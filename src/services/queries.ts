import gql from "graphql-tag";

export const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY {
    videoCollection {
      total
      items {
        sys {
          id
        }
        title
        thumbnail {
          url
        }
        publishedAt
        duration
        media {
          url
        }
      }
    }
  }
`;
