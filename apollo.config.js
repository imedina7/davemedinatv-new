/* eslint-disable no-undef */
import { config } from 'dotenv'

config()
export default {
  client: {
    service: {
      name: "my-app",
      // URL to the GraphQL API
      url: `${process.env.VITE_CONTENTFUL_GRAPHQL_URI}${process.env.VITE_CONTENTFUL_SPACE_ID}`,
      headers: {
        authorization: `Bearer ${process.env.VITE_CONTENTFUL_ACCESS_TOKEN}`,
      },
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
