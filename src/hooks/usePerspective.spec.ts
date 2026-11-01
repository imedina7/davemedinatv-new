import { describe, it, expect, vi } from "vitest";

vi.mock("three", async () => {
  const actual = await vi.importActual("three");
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      render: vi.fn(),
    })),
  };
});

import { usePerspective } from "./usePerspective";

describe("usePerspective", () => {
  it("creates scene, camera, and renderer", () => {
    const { scene, camera, renderer } = usePerspective(
      { fov: 75, aspect: 16 / 9, near: 0.1, far: 1000 },
      { antialias: true },
    );
    expect(scene).toBeDefined();
    expect(camera).toBeDefined();
    expect(renderer).toBeDefined();
  });

  it("creates with partial options", () => {
    const { scene, camera, renderer } = usePerspective({}, {});
    expect(scene).toBeDefined();
    expect(camera).toBeDefined();
    expect(renderer).toBeDefined();
  });

  it("creates with some options", () => {
    const { scene, camera, renderer } = usePerspective(
      { fov: 45 },
      { alpha: true },
    );
    expect(scene).toBeDefined();
    expect(camera).toBeDefined();
    expect(renderer).toBeDefined();
  });
});