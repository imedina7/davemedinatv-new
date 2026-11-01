// Polyfill atob/btoa for jsdom compatibility with Node 26+
// Node 26's atob is stricter and rejects non-Latin1 characters
if (typeof globalThis.atob === "undefined" || true) {
  globalThis.atob = (str: string) => Buffer.from(str, "base64").toString("binary");
  globalThis.btoa = (str: string) => Buffer.from(str, "binary").toString("base64");
}