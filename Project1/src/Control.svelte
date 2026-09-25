<script>
  import Home from './lib/home.svelte'
  import Lock from './lib/lock.svelte'
  import YourBank from './lib/yourBank.svelte'
  import Pinpad from './lib/pinpad.svelte'
  import Dispense from './lib/dispense.svelte'
  import ReactiveDisplay from './Reactive.svelte'
  import Keyboard from './lib/keyboard.svelte'
  import Goals from './lib/goals.svelte'
  import Custom from './lib/custom.svelte'

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
  let totalBalance = $state(23.51);
  let coin = $state({
    quarters: { count: 27, capacity: 100, value: 0.25 },
    dimes: { count: 15, capacity: 100, value: 0.10 },
    nickels: { count: 14, capacity: 100, value: 0.05 },
    pennies: { count: 13, capacity: 100, value: 0.01 }
  });

  // Track the last inserted coin for the reactive display popup
  let insertedCoin = $state(null);
  let lastDispensed = $state(null);

  // Coin insertion simulation function
  function simulateCoinDrop(coinType) {
    // Do not accept coins if the partition is full
    if (coin[coinType].count < coin[coinType].capacity) {
      coin[coinType].count += 1;
      totalBalance += coin[coinType].value;
      
      // Reassign the object to trigger Svelte's reactivity engine 
      // so child components (like YourBank and Goals) re-render immediately.
      coin = { ...coin };

      // Notify reactive display of the insertion
      insertedCoin = {
        type: coinType,
        count: coin[coinType].count,
        capacity: coin[coinType].capacity,
        timestamp: Date.now()
      };
    } else {
      alert(`Physical capacity reached for ${coinType}!`);
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
    <button onclick={() => simulateCoinDrop('quarters')}>25¢</button>
    <button onclick={() => simulateCoinDrop('dimes')}>10¢</button>
    <button onclick={() => simulateCoinDrop('nickels')}>5¢</button>
    <button onclick={() => simulateCoinDrop('pennies')}>1¢</button>
  </div>
</aside>
