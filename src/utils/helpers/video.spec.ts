import { describe, it, expect } from "vitest";
import { formatDuration } from "./video";

describe("formatDuration", () => {
  it("formats short duration (no hours)", () => {
    expect(formatDuration(125000)).toMatch(/\d{2}:\d{2}/);
  });

  it("formats duration with hours when > 1 hour", () => {
    const result = formatDuration(3600000 + 125000);
    expect(result).toContain(":");
  });

  it("handles 0 ms", () => {
    expect(formatDuration(0)).toMatch(/\d{2}:\d{2}/);
  });

  it("handles default param", () => {
    expect(formatDuration()).toMatch(/\d{2}:\d{2}/);
  });
});