import { onBeforeMount, onBeforeUnmount, ref } from "vue";

export interface DeviceOrientation {
  alpha: number;
  beta: number;
  gamma: number;
}

export function useDeviceOrientation() {
  const alpha = ref(0);
  const beta = ref(0);
  const gamma = ref(0);
  const supported = ref(false);
  const permissionGranted = ref(false);
  const listening = ref(false);

  const isMobile = () =>
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent,
    ) || "ontouchstart" in window;

  const requestPermission = async (): Promise<boolean> => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const result = await (DeviceOrientationEvent as any).requestPermission();
        permissionGranted.value = result === "granted";
      } catch {
        permissionGranted.value = false;
      }
    } else {
      // Non-iOS or older browsers: no permission needed
      permissionGranted.value = true;
    }
    return permissionGranted.value;
  };

  const handler = (event: DeviceOrientationEvent) => {
    alpha.value = event.alpha ?? 0;
    beta.value = event.beta ?? 0;
    gamma.value = event.gamma ?? 0;
  };

  const start = () => {
    if (typeof DeviceOrientationEvent === "undefined") {
      supported.value = false;
      return;
    }
    supported.value = true;
    window.addEventListener("deviceorientation", handler);
    listening.value = true;
  };

  const stop = () => {
    window.removeEventListener("deviceorientation", handler);
    listening.value = false;
  };

  onBeforeMount(() => {
    if (isMobile()) {
      start();
    }
  });

  onBeforeUnmount(() => {
    stop();
  });

  return {
    alpha,
    beta,
    gamma,
    supported,
    permissionGranted,
    listening,
    isMobile,
    requestPermission,
    start,
    stop,
  };
}