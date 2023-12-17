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

router.beforeEach((to) => {
  // if (to.name !== "home") store.$patch({ ui: { landingRolledUp: true } });
  return true;
});

app.use(router);

const store = useAppStore();
store.initStore();

app.mount("#app");

window.addEventListener("touchstart", store.touchStart, { passive: true });
window.addEventListener("touchmove", store.swipeTouch);
window.addEventListener("wheel", store.swipeWheel);
window.addEventListener("touchend", store.touchEnd);
