import { describe, it, expect } from "vitest";
import { createClient } from "./httpClient";

describe("httpClient", () => {
  it("createClient returns axios instance", () => {
    const client = createClient("http://example.com");
    expect(client).toBeDefined();
    expect(typeof client.get).toBe("function");
    expect(typeof client.post).toBe("function");
  });

  it("baseURL is set correctly", () => {
    const client = createClient("http://example.com/api");
    expect(client.defaults.baseURL).toBe("http://example.com/api");
  });

  it("headers are applied", () => {
    const client = createClient("http://example.com", { "X-Foo": "bar" });
    const headers = client.defaults.headers as any;
    const value =
      headers?.["X-Foo"] ??
      headers?.common?.["X-Foo"] ??
      headers?.get?.["X-Foo"];
    expect(value).toBe("bar");
  });
});
