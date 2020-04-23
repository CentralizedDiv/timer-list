<script>
  import { fade, fly } from "svelte/transition";
  import { onMount, setContext } from "svelte";
  import { currentTimer } from "./store";
  import { registerNotifications, key } from "./notifications";
  import KeyPad from "./components/KeyPad.component.svelte";
  import Timer from "./components/Timer.component.svelte";

  setContext(key, {
    getRegistration: () => registration
  });

  let transitionsDuration = 0;
  let registration;
  let shouldShowTimer = $currentTimer.secondsLeft !== undefined;
  let shouldShowKeyPad = $currentTimer.secondsLeft === undefined;

  function toggleView(view) {
    if (view === "currentTimer") {
      shouldShowKeyPad = false;
      setTimeout(() => {
        shouldShowTimer = true;
      }, 200);
    } else if (view === "keyPad") {
      shouldShowTimer = false;
      setTimeout(() => {
        shouldShowKeyPad = true;
      }, 200);
    }
  }

  function handleConfirm({ detail }) {
    currentTimer.start(detail.time);
    currentTimer.startTimer();
    toggleView("currentTimer");
  }

  onMount(async () => {
    registration = await registerNotifications();
    currentTimer.startTimer();

    // Delay transitions declaration
    setTimeout(() => {
      transitionsDuration = 300;
    }, 100);
  });
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
        on:cancel={() => toggleView('currentTimer')}
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
          on:reset={currentTimer.reset}
          on:clickTimer={currentTimer.togglePlayPause}
          on:changeLabel={({ detail }) => currentTimer.setLabel(detail.label)}
          secondsLeft={$currentTimer.secondsLeft}
          totalSeconds={$currentTimer.totalSeconds}
          paused={$currentTimer.paused}
          label={$currentTimer.label} />
      </div>
      <div class="TimerList-actions">
        <button
          on:click={() => {
            toggleView('keyPad');
          }}>
          Add timer
        </button>
        <button on:click={() => currentTimer.togglePlayPause()}>
          {$currentTimer.paused ? 'Play' : 'Pause'}
        </button>
        <button
          on:click={() => {
            toggleView('keyPad');
            currentTimer.remove();
          }}>
          Delete
        </button>
      </div>
    </div>
  {/if}

</div>
