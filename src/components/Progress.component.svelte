<script>
  import { onMount, onDestroy } from "svelte";

  const width = Math.min(window.innerWidth * 0.6, 200);
  const strokeWidth = "4";
  const radius = width / 2 - strokeWidth * 2;
  const circumference = radius * 2 * Math.PI;
  let innerCircle;
  let outerCircle;
  let timer = 0;
  const timerInterval = setInterval(() => {
    timer++;
  }, 100);

  function setProgress(percent) {
    if (innerCircle && outerCircle) {
      const offset = circumference + (percent / 100) * circumference;
      innerCircle.style.strokeDashoffset = offset;

      outerCircle.style.strokeDashoffset = offset - circumference;
    }
  }

  $: setProgress(timer);
  $: if (timer === 100) {
    clearInterval(timerInterval);
  }

  onMount(() => {
    innerCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    innerCircle.style.strokeDashoffset = circumference;

    outerCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    outerCircle.style.strokeDashoffset = 0;
  });
  onDestroy(() => clearInterval(timerInterval));
</script>

<style lang="scss">
  @import "../_utils/styles/main";

  .Progress {
    .progress-ring__circle {
      transition: stroke-dashoffset 0.35s;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
    input {
      display: block;
    }
  }
</style>

<div class="Progress">
  <svg class="progress-ring" {width} height={width}>
    <circle
      bind:this={outerCircle}
      class="progress-ring__circle"
      stroke="#dde4e9"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      fill="transparent"
      r={radius}
      cx={width / 2}
      cy={width / 2} />
    <circle
      bind:this={innerCircle}
      class="progress-ring__circle"
      stroke="#3282b8"
      stroke-linecap="round"
      stroke-width={strokeWidth}
      fill="transparent"
      r={radius}
      cx={width / 2}
      cy={width / 2} />
  </svg>
  <input
    type="number"
    min="0"
    max="100"
    on:change={ev => setProgress(ev.target.value)} />
</div>
