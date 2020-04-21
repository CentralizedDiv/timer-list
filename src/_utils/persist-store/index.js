import { onDestroy, onMount } from "svelte";
import { writable as SvelteWriteble } from "svelte/store";
import { generateId } from "..";

export const writable = (storeName, initialValue, callBack) => {
  const id = generateId(storeName);
  const persistedValue = localStorage.getItem(id);

  const { subscribe, set, update } = SvelteWriteble(
    persistedValue ? JSON.parse(persistedValue) : initialValue,
    callBack
  );

  const sub = () => {
    return subscribe((value) => {
      console.log(value);
      localStorage.setItem(id, JSON.stringify(value));
    });
  };

  let unsubscribe = sub();

  let $$deleted = false;

  const forceRestart = () => {
    if ($$deleted) {
      $$deleted = false;
      unsubscribe = sub();
    }
  };

  return {
    subscribe,
    forceRestart,
    set: (value) => {
      if (!$$deleted) {
        return set(value);
      }
    },
    update: (upCb) => {
      forceRestart();
      return update((curr) => upCb(curr));
    },
    remove: () => {
      localStorage.removeItem(id);
      $$deleted = true;
      unsubscribe();
      return set(initialValue);
    },
  };
};
