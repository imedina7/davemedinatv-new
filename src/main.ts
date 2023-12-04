import { createApp, h, provide } from "vue";

import { createPinia } from "pinia";
import "./assets/styles/main.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import * as icons from "./icons";

import App from "./App.vue";
import router from "./router";

import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./services/apolloClient";
import { useAppStore } from "./stores/app";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

library.add(icons);

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);

const store = useAppStore();

store.initStore();

app.mount("#app");

window.addEventListener("touchstart", store.touchStart);
window.addEventListener("touchmove", store.swipe);
window.addEventListener("wheel", store.swipe);
window.addEventListener("touchend", store.touchEnd);
