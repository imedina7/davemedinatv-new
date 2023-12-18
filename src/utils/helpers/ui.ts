import { SWIPE_MIN_THRESHOLD } from "../constants";

export function findDeltaSwipe({
  touchXStart,
  touchYStart,
  event,
}: {
  touchXStart: number;
  touchYStart: number;
  event: TouchEvent;
}) {
  const deltaY = touchYStart - event.touches[0].pageY;
  const deltaX = touchXStart - event.touches[0].pageX;
  return { deltaX, deltaY };
}

export function isSwippingHorizontally(deltaX: number, deltaY: number) {
  const dX = Math.abs(Math.round(deltaX));
  const dY = Math.abs(Math.round(deltaY));
  return dY < SWIPE_MIN_THRESHOLD || dX > dY;
}
