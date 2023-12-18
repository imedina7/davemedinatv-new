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
import { useRootStore, useUiStore } from "./store";

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
  if (to.name !== "home") uiStore.$patch({ landingRolledUp: true });
  return true;
});

app.use(router);

const uiStore = useUiStore();
const rootStore = useRootStore();
rootStore.initStore();

app.mount("#app");

window.addEventListener("touchstart", uiStore.touchStart, { passive: true });
window.addEventListener("touchmove", uiStore.swipeTouch);
window.addEventListener("wheel", uiStore.swipeWheel);
window.addEventListener("touchend", uiStore.touchEnd);
