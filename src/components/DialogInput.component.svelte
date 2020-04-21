<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const cancel = () => dispatch("cancel");
  const ok = () => dispatch("ok", { value });

  export let value = "";
</script>

<style lang="scss">
  @import "../_utils/styles/main";

  .DialogInput {
    &-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1000;
    }

    &-content {
      z-index: 10001;
      position: absolute;
      left: 50%;
      top: 50%;
      width: calc(100vw - 4em);
      max-width: 32em;
      max-height: calc(100vh - 4em);
      overflow: auto;
      transform: translate(-50%, -50%);
      padding: 1em;
      border-radius: 0.2em;
      background: $color-mirage;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;

      & > button {
        color: $color-boston-blue;
        margin: 0 8px;
        font-size: 12px;
      }
    }

    &-input {
      flex-basis: 100%;
      position: relative;
      height: 40px;
      margin-bottom: 1em;

      & > input {
        position: absolute;
        background: transparent;
        border-color: $color-boston-blue;
        outline: none;
        color: $color-white;
        font-size: 12px;
        width: 100%;
        padding: 12px;
        left: 0;
      }

      & > span {
        font-size: 12px;
        background-color: $color-mirage;
        color: $color-boston-blue;
        padding: 2px 4px;
        position: absolute;
        border-radius: 2px;
        left: 10px;
        top: -10px;
      }
    }
  }
</style>

<div class="DialogInput-background" on:click={cancel} />

<div class="DialogInput-content">
  <label class="DialogInput-input" for="DialogInput_input">
    <input id="DialogInput_input" type="text" bind:value placeholder="Label" />
    <span>Label</span>
  </label>
  <button on:click={cancel}>Cancel</button>
  <button on:click={ok}>OK</button>
</div>
