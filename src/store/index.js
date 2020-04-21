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
      if (initialValue === undefined) {
        initialValue = value;
      }
      if (typeof value === "object") {
        _update((current) => ({ ...current, ...value }));
      } else {
        _update((current) => ({ ...current, value }));
      }
    },
    setLabel: (label) => {
      _update((current) => ({ ...current, label }));
    },
    reset: () => {
      _update((current) => ({ ...current, value: initialValue }));
      initialValue = undefined;
    },
  };
}

export const currentTimer = createCurrentTimer();
