const hasNativePerformanceNow =
  typeof performance === "object" && typeof performance.now === "function";

const now = hasNativePerformanceNow
  ? () => performance.now()
  : () => Date.now();

type AnimationFrameID = ReturnType<typeof requestAnimationFrame>;

export type TimeoutID = {
  id: AnimationFrameID;
};

export function cancelTimeout(timeoutID: TimeoutID) {
  cancelAnimationFrame(timeoutID.id);
}

export function requestTimeout(callback: Function, delay: number): TimeoutID {
  const start = now();

  function tick() {
    if (now() - start >= delay) {
      callback.call(null);
    } else {
      timeoutID.id = requestAnimationFrame(tick);
    }
  }

  const timeoutID: TimeoutID = {
    id: requestAnimationFrame(tick),
  };

  return timeoutID;
}
