<script>
  import {
    onMount,
    onDestroy,
    getContext,
    createEventDispatcher
  } from "svelte";
  import { formatTime } from "../_utils";
  import { key } from "../notifications";
  import DialogInput from "./DialogInput.component.svelte";

  const dispatch = createEventDispatcher();
  const radius = 48.5;
  const circumference = radius * 2 * Math.PI;

  export let secondsLeft;
  export let totalSeconds;
  export let paused;
  export let label = undefined;

  let timerInterval;
  let line;
  let marker;
  let showDialogInput;

  $: percentage = 100 - (secondsLeft * 100) / totalSeconds;
  $: if (secondsLeft > -1) setProgress(percentage);
  $: formatted = secondsLeft !== undefined ? formatTime(secondsLeft) : "";
  $: {
    if (secondsLeft < 0) {
      const context = getContext(key);
      const registration = context.getRegistration();
      if (registration) {
        // Get Notification and replace
        registration.showNotification(
          `Time's up! ${label ? ` - ${label}` : ""}`,
          {
            badge: "/alarm-clock.png",
            tag: "times-up",
            renotify: true,
            body: formatted,
            vibrate: [1000],
            requireInteraction: true
          }
        );
      }
    }
  }

  function setProgress(percent) {
    if (line && marker) {
      const offset = circumference + (percent / 100) * circumference;
      line.style.strokeDashoffset = offset;
      marker.style.transform = `rotate(-${(percent * 360) / 100}deg)`;
    }
  }

  function handleReset() {
    dispatch("reset");
  }

  onMount(() => {
    if (line) {
      line.style.strokeDasharray = `${circumference} ${circumference}`;
      line.style.strokeDashoffset = circumference;

      if (secondsLeft > -1) {
        setProgress(percentage);
      } else {
        setProgress(100);
      }

      // Delays transition declaration to prevent user seeing the first strokeDasharray change
      setTimeout(() => {
        line.style.transition = "stroke-dashoffset 1.2s ease-in-out";
        marker.style.transition = "transform 1.2s ease-in-out";
      }, 999);
    }
  });

  onDestroy(() => clearInterval(timerInterval));
</script>

<style lang="scss">
  @import "../_utils/styles/main";

  .Timer {
    position: relative;

    &-back {
      stroke: $color-white;
      stroke-width: 1;
      fill: transparent;
    }

    &-line {
      transform: rotate(-90deg);
      transform-origin: 50px 50px;

      stroke: $color-boston-blue;
      stroke-width: 2;
      fill: transparent;
      stroke-linecap: round;
    }

    &-marker {
      fill: $color-boston-blue;
      transform-origin: 50px 50px;
      transform: rotate(0deg);
    }

    &-text {
      @include flex-center;
      position: absolute;
      width: 300px;
      height: 300px;
      top: 0;
      font-size: 50px;
      font-weight: 500;
      color: $color-boston-blue;

      &.isPaused {
        @include blink;
      }
    }

    &-resetButton {
      position: absolute;
      left: calc(50% - 26px);
      bottom: 60px;
      width: 52px;
    }

    &-labelButton {
      color: $color-gray;
      position: absolute;
      left: calc(50% - 90px);
      top: 60px;
      width: 180px;
      z-index: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

<div class="Timer">
  {#if showDialogInput}
    <DialogInput
      on:cancel={() => (showDialogInput = false)}
      on:ok={({ detail }) => {
        label = detail.label;
        showDialogInput = false;
      }}
      {label} />
  {/if}
  <svg width="300px" viewBox="-5 -5 110 110">
    <circle class="Timer-back" r="48.5" cx="50" cy="50" />
    <circle bind:this={line} class="Timer-line" r="48.5" cx="50" cy="50" />
    <circle bind:this={marker} class="Timer-marker" r="3" cx="50" cy="1.5" />
  </svg>
  <button class="Timer-labelButton" on:click={() => (showDialogInput = true)}>
    {label || 'Label'}
  </button>
  <div class="Timer-text" class:isPaused={paused}>{formatted}</div>
  <button class="Timer-resetButton" on:click={handleReset}>Reset</button>
</div>
