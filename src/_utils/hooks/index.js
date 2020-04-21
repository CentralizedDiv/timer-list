import { onDestroy, onMount } from "svelte";
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
    value.subscribe((v) => {
      if (!v.FIRST_CHANGE) {
        localStorage.setItem(id, JSON.stringify(v));
      }
    });
  });
}
