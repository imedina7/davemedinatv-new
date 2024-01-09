import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  type WebGLRendererParameters,
} from "three";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";

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

export function useMouseDirection() {
  const mouseDirection = ref<[number, number]>([0, 0]);
  onBeforeMount(() => {
    window.addEventListener("mousemove", mouseMoveHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("mousemove", mouseMoveHandler);
  });
  const mouseMoveHandler = (event: MouseEvent) => {
    const { innerHeight, innerWidth } = window;
    const mouseRatioX = (event.clientX / innerWidth) * 2 - 1;
    const mouseRatioY = (event.clientY / innerHeight) * 2 - 1;
    mouseDirection.value = [mouseRatioX, mouseRatioY];
  };
  return mouseDirection;
}
