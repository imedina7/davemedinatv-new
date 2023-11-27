import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive<{ connected: boolean; socketId?: string }>({
  connected: false,
  socketId: undefined,
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = "wss://eventsub.wss.twitch.tv/";

export const socket = io(URL, {
  path: "/ws",
});

socket.on("connect", () => {
  state.connected = true;
  state.socketId = socket.id;
  console.log(socket.id);
});

socket.on("disconnect", () => {
  state.connected = false;
});
