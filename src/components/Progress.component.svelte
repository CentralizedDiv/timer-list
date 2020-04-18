<script>
  import { onMount, onDestroy } from "svelte";
  import { formatTime } from "../_utils";

  export let timer;

  const radius = 48.5;
  const circumference = radius * 2 * Math.PI;

  let totalTimer;
  let timerInterval;
  let line;
  let marker;

  function setProgress(percent) {
    if (line && marker) {
      const offset = circumference + (percent / 100) * circumference;
      line.style.strokeDashoffset = offset;
      marker.style.transform = `rotate(-${(percent * 360) / 100}deg)`;
    }
  }

  $: percentage = 100 - (timer * 100) / totalTimer;
  $: if (timer > -1) setProgress(percentage);
  $: formatted = timer ? formatTime(timer) : "";

  onMount(() => {
    if (line) {
      line.style.strokeDasharray = `${circumference} ${circumference}`;
      line.style.strokeDashoffset = circumference;

      // Delays transition declaration to prevent user seeing the first strokeDasharray change
      setTimeout(() => {
        line.style.transition = "stroke-dashoffset 1.2s ease-in-out";
      }, 999);
    }

    if (timer) {
      totalTimer = timer;
      timerInterval = setInterval(() => {
        timer--;
      }, 1000);
    }
  });
  onDestroy(() => clearInterval(timerInterval));
</script>

<style lang="scss">
  @import "../_utils/styles/main";

  .Progress {
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
      transition: transform 1.2s ease-in-out;
    }

    &-text {
      @include flex-center;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      font-size: 32px;
      font-weight: 500;
      color: $color-boston-blue;
    }
  }
</style>

<div class="Progress">
  <svg width="200px" viewBox="-5 -5 110 110">
    <circle class="Progress-back" r="48.5" cx="50" cy="50" />
    <circle bind:this={line} class="Progress-line" r="48.5" cx="50" cy="50" />
    <circle bind:this={marker} class="Progress-marker" r="3" cx="50" cy="1.5" />
  </svg>
  <div class="Progress-text">{formatted}</div>
</div>
