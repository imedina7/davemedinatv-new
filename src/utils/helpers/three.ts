import { CubeTexture, CubeTextureLoader } from "three";

export const getCubeMapByName = (name: string): CubeTexture => {
  const loader = new CubeTextureLoader();
  loader.setPath(`/textures/cube/${name}/`);
  return loader.load([
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ]);
};

/**
 * Aspect ratio threshold below which the screen is considered "too thin"
 * (portrait / narrow). When the aspect ratio falls below this value the
 * camera should be moved further back to avoid cropping the logo.
 */
export const THIN_SCREEN_ASPECT_THRESHOLD = 0.75;

/**
 * Base camera Z distance used for wide (landscape) screens.
 */
export const BASE_CAMERA_DISTANCE = 6;

/**
 * Determines whether the screen is too thin (portrait / narrow) based on
 * the given aspect ratio.
 */
export function isScreenTooThin(aspect: number): boolean {
  return aspect < THIN_SCREEN_ASPECT_THRESHOLD;
}

/**
 * Calculates the camera Z distance for a given aspect ratio.
 *
 * On wide screens the base distance is used. On thin screens the camera
 * is moved further back proportionally so the logo is not cropped.
 *
 * @param aspect  - current width / height aspect ratio
 * @param base    - base camera distance for wide screens (default 6)
 * @param factor  - multiplier applied to the base distance on thin screens
 * @returns the camera Z distance to use
 */
export function getCameraDistance(
  aspect: number,
  base: number = BASE_CAMERA_DISTANCE,
  factor: number = 1.5,
): number {
  if (isScreenTooThin(aspect)) {
    // Scale distance inversely with aspect ratio so narrower screens
    // push the camera further back.
    return base * factor * (THIN_SCREEN_ASPECT_THRESHOLD / aspect);
  }
  return base;
}
