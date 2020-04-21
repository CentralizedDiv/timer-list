import { onDestroy, onMount } from "svelte";
import { writable as SvelteWriteble } from "svelte/store";
import { generateId } from "..";

export function persistStore(stores) {
  onMount(() => {
    Object.entries(stores).forEach(([key, value]) => {
      const id = generateId(key);
      const persistedValue = localStorage.getItem(id);
      if (persistedValue) {
        value.set(JSON.parse(persistedValue));
      }
    });
  });

  Object.entries(stores).forEach(([key, value]) => {
    const id = generateId(key);
    const unsubscribe = value.subscribe((obj) => {
      if (!obj.$$first && obj.value) {
        localStorage.setItem(id, JSON.stringify(obj.value));
      }
      if (obj.$$delete) {
        localStorage.removeItem(id);
      }
    }, false);
  });
}

export const writable = (initialValue, callBack) => {
  const { subscribe, set, update } = SvelteWriteble(
    { value: initialValue, $$first: true },
    callBack
  );

  return {
    subscribe: (subCallBack, trimPersist = true) =>
      subscribe((obj) => {
        if (trimPersist) obj = obj.value;
        subCallBack(obj);
      }),
    set: (value) => {
      return set({ $$first: false, value });
    },
    update: (upCallBack) => {
      return update((curr) => {
        const { value } = curr;
        return { $$first: false, value: upCallBack(value) };
      });
    },
    remove: () => {
      return set({ $$delete: true, $$first: true, value: initialValue });
    },
  };
};
