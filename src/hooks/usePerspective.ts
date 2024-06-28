import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  type WebGLRendererParameters,
} from "three";

type CamOptions = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
};

export function usePerspective(
  { fov, aspect, near, far }: Partial<CamOptions>,
  rendererOptions: WebGLRendererParameters,
) {
  const scene = new Scene();
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  const renderer = new WebGLRenderer(rendererOptions);

  return { scene, camera, renderer };
}
