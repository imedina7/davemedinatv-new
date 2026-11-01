import { describe, it, expect } from "vitest";
import {
  isScreenTooThin,
  getCameraDistance,
  THIN_SCREEN_ASPECT_THRESHOLD,
  BASE_CAMERA_DISTANCE,
} from "./three";

describe("isScreenTooThin", () => {
  it("returns true when aspect < threshold", () => {
    expect(isScreenTooThin(0.5)).toBe(true);
  });

  it("returns false when aspect >= threshold", () => {
    expect(isScreenTooThin(1.0)).toBe(false);
    expect(isScreenTooThin(0.75)).toBe(false);
  });

  it("returns true at just below threshold", () => {
    expect(isScreenTooThin(0.74)).toBe(true);
  });
});

describe("getCameraDistance", () => {
  it("returns base distance for wide screens", () => {
    expect(getCameraDistance(1.0)).toBe(BASE_CAMERA_DISTANCE);
  });

  it("returns base distance at threshold", () => {
    expect(getCameraDistance(THIN_SCREEN_ASPECT_THRESHOLD)).toBe(
      BASE_CAMERA_DISTANCE,
    );
  });

  it("returns increased distance for thin screens", () => {
    const dist = getCameraDistance(0.5);
    expect(dist).toBeGreaterThan(BASE_CAMERA_DISTANCE);
  });

  it("returns greater distance for thinner screens", () => {
    const d1 = getCameraDistance(0.5);
    const d2 = getCameraDistance(0.3);
    expect(d2).toBeGreaterThan(d1);
  });

  it("uses custom base and factor", () => {
    expect(getCameraDistance(1.0, 10, 2)).toBe(10);
  });

  it("scales correctly for thin screen with custom params", () => {
    const dist = getCameraDistance(0.5, 10, 2);
    expect(dist).toBeGreaterThan(10);
  });
});

describe("constants", () => {
  it("THIN_SCREEN_ASPECT_THRESHOLD is 0.75", () => {
    expect(THIN_SCREEN_ASPECT_THRESHOLD).toBe(0.75);
  });

  it("BASE_CAMERA_DISTANCE is 6", () => {
    expect(BASE_CAMERA_DISTANCE).toBe(6);
  });
});