<script>
  import Home from './lib/home.svelte'
  import Lock from './lib/lock.svelte'
  import YourBank from './lib/yourBank.svelte'
  import Pinpad from './lib/pinpad.svelte'
  import Keyboard from './lib/keyboard.svelte'
  import Goals from './lib/goals.svelte'
  import Dispense from './lib/dispense.svelte'
  import Custom from './lib/custom.svelte'
  import ReactiveDisplay from './Reactive.svelte'

  // Screen state management
  let currentScreen = $state('lock')
  let popupScreen = $state(/** @type {string | null} */ (null))

  // Centralized state for change-dispensing and accounts
  let bankState = $state({
    pennies: 0,
    nickels: 0,
    dimes: 0,
    quarters: 0,
  });

  let balance = $derived(() => {
    const { pennies, nickels, dimes, quarters } = bankState;
    return pennies * 0.01 + nickels * 0.05 + dimes * 0.10 + quarters * 0.25;
  });

  // Triggered by child components
  /** @param {string} screen */
  function navigate(screen) {
    currentScreen = screen;
  }
</script>

<main class="mainContainer">

  <!-- Control Display -->
  <section class="controlDisplay">
    {#if currentScreen === 'home'}
      <Home />
    {:else if currentScreen === 'lock'}
      <Lock {navigate}/>
    {:else if currentScreen === 'yourBank'}
      <YourBank />
    {:else if currentScreen === 'goals'}
      <Goals />
    {:else if currentScreen === 'dispense'}
      <Dispense />
    {:else if currentScreen === 'custom'}
      <Custom />
    {/if}
  </section>

  <!-- Testing UI -->
  <aside class="testUI">
    <details class="testDetails">
      <summary>Testing Controls</summary>
      <p>To simulate a coin insertion, click the buttons below</p>
    </details>
    <div class="testButtons">
      <div class="testButton">
        <button onclick={() => bankState.quarters++}>Insert Quarter</button>
      </div>
      <div class="testButton">
        <button onclick={() => bankState.dimes++}>Insert Dime</button>
      </div>
      <div class="testButton">
        <button onclick={() => bankState.nickels++}>Insert Nickel</button>
      </div>
      <div class="testButton">
        <button onclick={() => bankState.pennies++}>Insert Penny</button>
      </div>
    </div>
  </aside>
</main>
