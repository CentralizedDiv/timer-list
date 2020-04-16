<script>
  import { onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import KeyPad from "./components/KeyPad.component.svelte";
  import { formatTime } from "./_utils";

  let timer = 60;
  let shouldShowTimer = true;
  let shouldShowKeyPad = false;

  const timerInterval = setInterval(() => {
    timer--;
  }, 1000);

  function toggleView(view) {
    if (view === "keyPad") {
      shouldShowKeyPad = false;
      setTimeout(() => {
        shouldShowTimer = true;
      }, 200);
    } else if (view === "currentTimer") {
      shouldShowTimer = false;
      setTimeout(() => {
        shouldShowKeyPad = true;
      }, 200);
    }
  }

  function handleConfirm({ detail }) {
    timer = detail.time;
    toggleView("keyPad");
  }

  $: formattedTimer = formatTime(timer);

  onDestroy(() => clearInterval(timerInterval));
</script>

<style lang="scss" global>
  @import "./main.scss";

  .TimerList {
    text-align: center;
    height: 100%;

    &-header {
      z-index: 1000;
      position: relative;
      padding: 12px;
      border-bottom: 1px solid $color-mirage;
      color: $color-mystic;
      font-size: 18px;
      max-height: 46px;
    }

    &-currentTimer,
    &-keyPad {
      height: calc(100% - 46px);
    }
  }
</style>

<div class="TimerList">
  <div class="TimerList-header">
    <span>Timer List</span>
  </div>
  {#if shouldShowKeyPad}
    <div
      class="TimerList-keyPad"
      in:fly={{ y: -200, duration: 300 }}
      out:fly={{ y: -200, duration: 300 }}>
      <KeyPad
        on:cancel={() => toggleView('keyPad')}
        on:confirm={handleConfirm} />
    </div>
  {/if}
  {#if shouldShowTimer}
    <div
      class="TimerList-currentTimer"
      in:fly={{ y: 200, duration: 300 }}
      out:fly={{ y: 200, duration: 300 }}>
      <p>{formattedTimer}</p>
      <button on:click={() => toggleView('currentTimer')}>Add timer</button>
    </div>
  {/if}

</div>
