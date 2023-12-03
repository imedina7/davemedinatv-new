import type { AxiosResponse } from "axios";
import { createClient } from "./httpClient";
import type { StreamStatus } from "@/types/api";

const client = createClient("/api");

export const getStream = (): Promise<AxiosResponse<StreamStatus>> =>
  client.get("/twitch/stream");
