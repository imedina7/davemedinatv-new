import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/styles/main.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import * as icons from "./icons";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

library.add(icons);

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
