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

  let currentScreen = $state('lock')
  let popupScreen = $state(/** @type {string | null} */ (null))

  let pennies = $state(0)
  let nickels = $state(0)
  let dimes = $state(0)
  let quarters = $state(0)
  let total = $derived(pennies * 0.01 + nickels * 0.05 + dimes * 0.10 + quarters * 0.25)

  /** @param {string} screen */
  function goTo(screen) {
    currentScreen = screen
    popupScreen = null
  }

  function goBack() {
    popupScreen = null
    if (currentScreen !== 'home') currentScreen = 'home'
  }
</script>

<body>

<!-- Control Display -->
{#if currentScreen === 'home'}
  <Home />
{:else if currentScreen === 'lock'}
  <Lock />
{:else if currentScreen === 'yourBank'}
  <YourBank {total}/>``
{:else if currentScreen === 'goals'}
  <Goals />
{:else if currentScreen === 'dispense'}``
  <Dispense />
{:else if currentScreen === 'custom'}
  <Custom />
{/if}

<!-- Testing UI -->
<div class="testUI">
  <div class="row">
    <div class="testButton">
      <button onclick={() => quarters++}>Insert Quarter</button>
    </div>
    <div class="testButton">
      <button onclick={() => dimes++}>Insert Dime</button>
    </div>
    <div class="testButton">
      <button onclick={() => nickels++}>Insert Nickel</button>
    </div>
    <div class="testButton">
      <button onclick={() => pennies++}>Insert Penny</button>
    </div>
  </div>
</div>

</body>


