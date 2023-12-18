import { SWIPE_ACTION_THRESHOLD } from "@/utils/constants";
import { findDeltaSwipe, isSwippingHorizontally } from "@/utils/helpers/ui";
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    isVideoOverlayOpen: false,
    landingRolledUp: false,
    touch: {
      swipeDeltaY: 0,
      swipeDeltaX: 0,
      touchYStart: 0,
      touchXStart: 0,
      isSwippingY: false,
      isSwippingX: false,
    },
  }),

  actions: {
    swipeTouch(event: TouchEvent) {
      if (!window.TouchEvent) return;

      requestAnimationFrame(() => {
        const { deltaX, deltaY } = findDeltaSwipe({
          touchXStart: this.touch.touchXStart,
          touchYStart: this.touch.touchYStart,
          event,
        });

        if (isSwippingHorizontally(deltaX, deltaY)) {
          this.touch.isSwippingX = true;
          return;
        }

        this.touch.isSwippingY = true;

        if (this.landingRolledUp) {
          this.touch.swipeDeltaY = Math.min(deltaY, 0);
          return;
        }

        this.touch.swipeDeltaY = Math.max(deltaY, 0);
      });
    },

    swipeWheel(event: WheelEvent) {
      const { innerHeight } = event.view ?? {};

      if (!innerHeight) return;

      if (
        this.touch.swipeDeltaY + event.deltaY > 0 &&
        this.touch.swipeDeltaY + event.deltaY < innerHeight - 50
      ) {
        this.touch.swipeDeltaY += event.deltaY;
      }

      if (this.landingRolledUp) {
        if (this.touch.swipeDeltaY < innerHeight / 3) {
          this.landingRolledUp = false;
          this.touch.isSwippingY = false;
        }
        return;
      }

      if (this.touch.swipeDeltaY > innerHeight / 3) {
        this.landingRolledUp = true;
        this.touch.isSwippingY = false;
      }
    },

    touchStart(ev: TouchEvent) {
      this.touch.swipeDeltaX = 0;
      this.touch.swipeDeltaY = 0;
      this.touch.touchXStart = ev.touches[0].pageX;
      this.touch.touchYStart = ev.touches[0].pageY;
    },

    touchEnd(ev: TouchEvent) {
      const touchEndX = ev.changedTouches[0].pageX;
      const touchEndY = ev.changedTouches[0].pageY;

      this.touch.swipeDeltaX = this.touch.touchXStart - touchEndX;
      this.touch.swipeDeltaY = this.touch.touchYStart - touchEndY;
      this.touch.touchXStart = 0;
      this.touch.touchYStart = 0;

      this.touch.isSwippingX = false;
      this.touch.isSwippingY = false;

      if (
        this.landingRolledUp &&
        this.touch.swipeDeltaY < -SWIPE_ACTION_THRESHOLD
      ) {
        this.landingRolledUp = false;
        return;
      }
      if (
        !this.landingRolledUp &&
        this.touch.swipeDeltaY > SWIPE_ACTION_THRESHOLD
      )
        this.landingRolledUp = true;
    },
  },
});
