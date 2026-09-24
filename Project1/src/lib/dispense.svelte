<script>
  let { activeScreen = $bindable(), totalBalance = $bindable(), coin = $bindable(), lastDispensed = $bindable() } = $props();

  // Track how many of each coin the user wants to dispense
  let dispensedCoins = $state({
    quarters: 0,
    dimes: 0,
    nickels: 0,
    pennies: 0
  });

  // Coin metadata for rendering
  const coinTypes = [
    { key: 'quarters', label: 'Quarter', icon: '🪙', value: 0.25 },
    { key: 'dimes',    label: 'Dime',    icon: '🥈', value: 0.10 },
    { key: 'nickels',  label: 'Nickel',  icon: '🥉', value: 0.05 },
    { key: 'pennies',  label: 'Penny',   icon: '🟤', value: 0.01 }
  ];

  // Running total of what's being dispensed
  let dispenseTotal = $derived(
    dispensedCoins.quarters * 0.25 +
    dispensedCoins.dimes    * 0.10 +
    dispensedCoins.nickels  * 0.05 +
    dispensedCoins.pennies  * 0.01
  );

  // Can we add more of this coin? (grey out ▲ if not)
  function canIncrement(key) {
    return dispensedCoins[key] < coin[key].count;
  }

  // Can we remove one? (grey out ▼ if not)
  function canDecrement(key) {
    return dispensedCoins[key] > 0;
  }

  function increment(key) {
    if (canIncrement(key)) dispensedCoins[key] += 1;
  }

  function decrement(key) {
    if (canDecrement(key)) dispensedCoins[key] -= 1;
  }

  // --- Confirm dispense: subtract from bank, notify reactive display ---
  function confirmDispense() {
    if (dispenseTotal <= 0) return;

    // Subtract coins from bank
    for (const { key, value } of coinTypes) {
      coin[key].count -= dispensedCoins[key];
      totalBalance -= dispensedCoins[key] * value;
    }
    coin = { ...coin }; // trigger reactivity

    // Notify reactive display
    lastDispensed = { ...dispensedCoins, timestamp: Date.now() };

    // Reset and navigate home
    resetDispensed();
    activeScreen = 'home';
  }

  // --- Cancel: clear selections, go home ---
  function cancelDispense() {
    resetDispensed();
    activeScreen = 'home';
  }

  function resetDispensed() {
    dispensedCoins = { quarters: 0, dimes: 0, nickels: 0, pennies: 0 };
  }
</script>

<section class="screen-template">

  <div class="dispense-header">
    <button
      class="arrow-btn"
      onclick={() => increment(key)}
      disabled={!canIncrement(key)}
    >▲</button>
    
    <p class="dispense-total">
      ${dispenseTotal.toFixed(2)} / ${totalBalance.toFixed(2)}
    </p>

    <button
      class="arrow-btn"
      onclick={() => decrement(key)}
      disabled={!canDecrement(key)}
    >▼</button>

  </div>

  <!-- Per-coin columns: ▲ icon count ▼ -->
  <div class="dispense-grid">
    <button class="cancel-btn" onclick={cancelDispense}>Cancel</button>
    {#each coinTypes as { key, label, icon }}
      <div class="dispense-coin-col">
        <button
          class="arrow-btn"
          onclick={() => increment(key)}
          disabled={!canIncrement(key)}
        >▲</button>

        <span class="coin-icon">{icon}</span>
        <span class="coin-count">{dispensedCoins[key]}</span>
        <span class="coin-label">{label}</span>

        <button
          class="arrow-btn"
          onclick={() => decrement(key)}
          disabled={!canDecrement(key)}
        >▼</button>
      </div>
    {/each}
    <button class="enter-btn" onclick={confirmDispense} disabled={dispenseTotal <= 0}>Enter</button>
  </div>
</section>