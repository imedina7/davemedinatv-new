/* eslint-disable no-undef */
require("dotenv").config();

module.exports = {
  client: {
    service: {
      name: "my-app",
      // URL to the GraphQL API
      url: `https://graphql.contentful.com/content/v1/spaces/${process.env.VITE_SPACE_ID}`,
      headers: {
        authorization: `Bearer ${process.env.VITE_ACCESS_TOKEN}`,
      },
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
