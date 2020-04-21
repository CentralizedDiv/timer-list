import { writable } from "svelte/store";

function createCurrentTimer() {
  let initialValue;
  const { subscribe, set, update } = writable({ FIRST_CHANGE: true });

  const _update = (v) => {
    update((curr) => ({ ...curr, FIRST_CHANGE: false }));
    return update(v);
  };
  return {
    subscribe,
    update: _update,
    set: (value) => {
      if (value === undefined) {
      }
      if (typeof value === "object") {
        _update((current) => ({ ...current, ...value }));
      } else {
        if (initialValue === undefined) {
          initialValue = value;
        }
        _update((current) => ({
          ...current,
          value,
          initialValue: value,
          DELETE: value === undefined,
        }));
      }
    },
    setLabel: (label) => {
      _update((current) => ({ ...current, label }));
    },
    reset: () => {
      _update((current) => ({ ...current, value: current.initialValue }));
      initialValue = undefined;
    },
  };
}

export const currentTimer = createCurrentTimer();
