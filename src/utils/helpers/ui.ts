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
  return (
    Math.abs(deltaX) > SWIPE_MIN_THRESHOLD &&
    Math.abs(deltaX) > Math.abs(deltaY)
  );
}
