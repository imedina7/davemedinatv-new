import { describe, it, expect } from "vitest";
import { cssCalc } from "./string";

describe("cssCalc", () => {
  it("wraps expression in calc()", () => {
    expect(cssCalc("100% - 50px")).toBe("calc(100% - 50px)");
  });

  it("handles empty string", () => {
    expect(cssCalc("")).toBe("calc()");
  });

  it("handles complex expression", () => {
    expect(cssCalc("56px - 10px")).toBe("calc(56px - 10px)");
  });
});