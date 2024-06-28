import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { Vector2 } from "three";

export enum MouseEventType {
  MOVE = "mousemove",
  CLICK = "click",
}

export function useMouseDirection(
  eventType: MouseEventType = MouseEventType.MOVE,
  cb?: () => void,
) {
  const mouseDirection = ref<Vector2>(new Vector2(0, 0));
  onBeforeMount(() => {
    window.addEventListener<MouseEventType>(eventType, mouseMoveHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener<MouseEventType>(eventType, mouseMoveHandler);
  });
  const mouseMoveHandler = (event: MouseEvent) => {
    const { innerHeight, innerWidth } = window;
    const mouseRatioX = (event.clientX / innerWidth) * 2 - 1;
    const mouseRatioY = (event.clientY / innerHeight) * 2 - 1;
    mouseDirection.value.set(mouseRatioX, mouseRatioY);
    cb?.();
  };
  return mouseDirection;
}
