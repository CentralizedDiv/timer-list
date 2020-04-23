import { writable } from "../_utils/persist-store";

function createCurrentTimer() {
  let timerInterval,
    secondsLeft,
    totalSeconds,
    label,
    paused = false;

  const { subscribe, update, remove, get } = writable(
    "currentTimer",
    {
      totalSeconds,
      secondsLeft,
      paused,
      label,
    },
    undefined,
    (persistedValue) => {
      secondsLeft = persistedValue.secondsLeft;
      totalSeconds = persistedValue.totalSeconds;
      label = persistedValue.label;
      paused = persistedValue.paused || false;
    }
  );

  const setProperty = (property, value) => {
    update((curr) => ({
      ...curr,
      [property]: value,
    }));
  };

  return {
    startTimer: () => {
      if (secondsLeft) {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          if (!paused) {
            setProperty("secondsLeft", --secondsLeft);
          }
        }, 1000);
      }
    },

    start: (seconds) => {
      secondsLeft = totalSeconds = seconds;
      setProperty("totalSeconds", seconds);
      setProperty("secondsLeft", seconds);
    },

    pause: () => {
      setProperty("paused", true);
      paused = true;
    },

    play: () => {
      setProperty("paused", false);
      paused = false;
    },

    togglePlayPause: () => {
      setProperty("paused", !paused);
      paused = !paused;
    },

    reset: () => {
      const wasPaused = paused;
      paused = true;
      secondsLeft = totalSeconds;
      setProperty("secondsLeft", secondsLeft);

      setTimeout(() => {
        if (!wasPaused) paused = false;
      }, 1000);
    },

    setLabel: (label) => setProperty("label", label),

    remove: () => {
      clearInterval(timerInterval);
      return remove();
    },

    subscribe,
  };
}

export const currentTimer = createCurrentTimer();
