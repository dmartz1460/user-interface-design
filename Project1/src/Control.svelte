<script>
  import Home from './screens/home.svelte'
  import Lock from './screens/lock.svelte'
  import YourBank from './screens/yourBank.svelte'
  import Pinpad from './screens/pinpad.svelte'
  import Dispense from './screens/dispense.svelte'
  import ReactiveDisplay from './Reactive.svelte'
  import Keyboard from './screens/keyboard.svelte'
  import Goals from './screens/goals.svelte'
  import Custom from './screens/custom.svelte'

  let now = $state(new Date());
  $effect(() => {
    const interval = setInterval(() => { now = new Date(); }, 1000);
    return () => clearInterval(interval);
  });

  // Format time as HH:MM
  let timeString = $derived(
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // Variable to track screen state
  let activeScreen = $state('lock');

  // Variables to track coin state
  let coin = $state({
    quarters: { count: 27, capacity: 100, value: 0.25, full: false},
    dimes: { count: 15, capacity: 100, value: 0.10, full: false },
    nickels: { count: 14, capacity: 100, value: 0.05, full: false },
    pennies: { count: 13, capacity: 100, value: 0.01, full: false }
  });

  let totalBalance = $derived(
    coin["quarters"].count * coin["quarters"].value +
    coin["dimes"].count * coin["dimes"].value +
    coin["nickels"].count * coin["nickels"].value +
    coin["pennies"].count * coin["pennies"].value
  );


  // Track the last inserted coin for the reactive display popup
  let insertedCoin = $state(null);
  let lastDispensed = $state(null);

  // Coin insertion simulation function
  function simulateCoinDrop(coinType, amount) {
    // Do not accept coins if the partition is full
    if (coin[coinType].count < coin[coinType].capacity && amount <= (coin[coinType].capacity - coin[coinType].count)) {

      coin[coinType].count += amount;
      coin[coinType].full = coin[coinType].count === coin[coinType].capacity;

      // Reassign the object to trigger Svelte's reactivity engine 
      // so child components (like YourBank and Goals) re-render immediately.
      coin = { ...coin };

      // Notify reactive display of the insertion
      insertedCoin = {
        type: coinType,
        count: coin[coinType].count,
        capacity: coin[coinType].capacity,
        timestamp: Date.now(),
      };
    } else {
      // Insert pop-up at the top of the reactive display
      insertedCoin = {
        type: coinType,
        count: coin[coinType].count,
        capacity: coin[coinType].capacity,
        timestamp: Date.now(),
      };
    }
  }
</script>

<!-- Device Simulation: two screens side by side -->
<div class="device-wrapper">

  <!-- Control Display (main screen) -->
  <section class="control-display">
    {#if activeScreen === 'lock'}
      <Lock bind:activeScreen {totalBalance} {timeString} />
    {:else if activeScreen === 'pinpad'}
      <Pinpad bind:activeScreen />
    {:else if activeScreen === 'home'}
      <Home bind:activeScreen {totalBalance} {timeString} />
    {:else if activeScreen === 'dispense'}
      <Dispense bind:activeScreen bind:totalBalance bind:coin bind:lastDispensed />
    {:else if activeScreen === 'yourBank'}
      <YourBank bind:activeScreen {totalBalance} {coin} />
    <!-- {:else if activeScreen === 'goals'}
      <Goals />
    {:else if activeScreen === 'custom'}
      <Custom /> 
    {:else if activeScreen === 'keyboard'}
      <Keyboard /> -->
    {/if}
  </section>

  <!-- Reactive Display -->
  <ReactiveDisplay {coin} {insertedCoin} {lastDispensed} />
</div>

<!-- Testing UI -->
<aside class="testing-ui">
  <details class="testDetails">
    <summary>Testing Controls</summary>
    <p>To simulate a coin insertion, click the buttons below</p>
  </details>
  <div class="coin-buttons">
    <button onclick={() => simulateCoinDrop('quarters', 1)}>25¢</button>
    <button onclick={() => simulateCoinDrop('dimes', 1)}>10¢</button>
    <button onclick={() => simulateCoinDrop('nickels', 1)}>5¢</button>
    <button onclick={() => simulateCoinDrop('pennies', 1)}>1¢</button>
  </div>
  <div class="coin-buttons">
    <button onclick={() => simulateCoinDrop('quarters', 10)}>25¢ * 10</button>
    <button onclick={() => simulateCoinDrop('dimes', 10)}>10¢ * 10</button>
    <button onclick={() => simulateCoinDrop('nickels', 10)}>5¢ * 10</button>
    <button onclick={() => simulateCoinDrop('pennies', 10)}>1¢ * 10</button>
  </div>
</aside>
