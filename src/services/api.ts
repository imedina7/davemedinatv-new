import { createClient } from "./httpClient";

const client = createClient("/api/twitch");

export const getStream = () => client.get("/stream");
