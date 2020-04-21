<script>
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { currentTimer } from "./store";
  import { persistStore } from "./_utils/hooks";
  import KeyPad from "./components/KeyPad.component.svelte";
  import Timer from "./components/Timer.component.svelte";

  let transitionsDuration = 0;
  let pauseTimer = false;
  $: label = $currentTimer && $currentTimer.label;
  $: shouldShowTimer = $currentTimer && $currentTimer.value !== undefined;
  $: shouldShowKeyPad = $currentTimer && $currentTimer.value === undefined;

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
    currentTimer.set({ value: detail.time });
    toggleView("keyPad");
  }

  onMount(() => {
    // Delay transitions declaration
    setTimeout(() => {
      transitionsDuration = 300;
    }, 100);
  });

  persistStore({ currentTimer });
</script>

<style lang="scss">
  @import "./_utils/styles/main";

  .TimerList {
    text-align: center;
    height: 100%;
    max-width: 600px;
    margin: 0 auto;

    &-header {
      z-index: 1000;
      position: relative;
      padding: 12px;
      border-bottom: 1px solid $color-mirage;
      background-color: $color-mirage;
      color: $color-mystic;
      font-size: 18px;
      max-height: 46px;
    }

    &-currentTimer,
    &-keyPad {
      height: calc(100% - 46px);
    }

    &-currentTimer {
      display: grid;
      grid-template-rows: auto 80px;
    }

    &-timer {
      @include flex-center;
    }

    &-actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
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
      in:fly={{ y: -200, duration: transitionsDuration }}
      out:fly={{ y: -200, duration: transitionsDuration }}>
      <KeyPad
        on:cancel={() => toggleView('keyPad')}
        on:confirm={handleConfirm} />
    </div>
  {/if}
  {#if shouldShowTimer}
    <div
      class="TimerList-currentTimer"
      in:fly={{ y: 200, duration: transitionsDuration }}
      out:fly={{ y: 200, duration: transitionsDuration }}>
      <div class="TimerList-timer">
        <Timer
          bind:value={$currentTimer.value}
          {pauseTimer}
          bind:label
          on:changeLabel={({ detail }) => currentTimer.setLabel(detail.label)} />
      </div>
      <div class="TimerList-actions">
        <button on:click={() => toggleView('currentTimer')}>Add timer</button>
        <button on:click={() => (pauseTimer = !pauseTimer)}>
          {pauseTimer ? 'Play' : 'Pause'}
        </button>
        <button on:click={() => currentTimer.set()}>Delete</button>
      </div>
    </div>
  {/if}

</div>
