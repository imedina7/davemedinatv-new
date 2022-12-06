import gql from "graphql-tag";

export const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY {
    videoCollection(order: youtubeUploadDate_DESC) {
      total
      items {
        sys {
          id
        }
        title
        thumbnail {
          url
        }
        youtubeUploadDate
        duration
        media {
          url
        }
      }
    }
  }
`;
