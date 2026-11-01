import MockAdapter from "axios-mock-adapter";
import { createClient } from "@/services/httpClient";

export function setupAxiosMock(): MockAdapter {
  const client = createClient("/api");
  return new MockAdapter(client);
}

export function teardownAxiosMock(mock: MockAdapter): void {
  mock.reset();
  mock.restore();
}
