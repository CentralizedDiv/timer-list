import { writable } from "../_utils/persist-store";

function createCurrentTimer() {
  const { subscribe, set, update, remove } = writable("currentTimer", {});

  const setProperty = (property, value) => {
    update((curr) => ({
      ...curr,
      [property]: value,
    }));
  };

  return {
    subscribe,
    set,
    remove,
    setSecondsLeft: (v) => setProperty("secondsLeft", v),
    setTotalSeconds: (v) => setProperty("totalSeconds", v),
    setLabel: (v) => setProperty("label", v),
    reset: () =>
      update((curr) => ({ ...curr, secondsLeft: curr.totalSeconds })),
  };
}

export const currentTimer = createCurrentTimer();
