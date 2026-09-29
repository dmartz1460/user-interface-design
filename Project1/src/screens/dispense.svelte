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

  // Bulk increment by $1.00 using largest available coins first
  function bulkIncrement() {
    let remaining = 100; // work in cents to avoid floating point
    for (const { key } of coinTypes) {
      const available = coin[key].count - dispensedCoins[key]; // coins not yet selected
      const coinCents = Math.round(coin[key].value * 100);
      const toAdd = Math.min(available, Math.floor(remaining / coinCents));
      dispensedCoins[key] += toAdd;
      remaining -= toAdd * coinCents;
      if (remaining <= 0) break;
    }
  }

  // Bulk decrement by $1.00, removing largest selected coins first
  function bulkDecrement() {
    let remaining = 100;
    for (const { key } of coinTypes) {
      const coinCents = Math.round(coin[key].value * 100);
      const toRemove = Math.min(dispensedCoins[key], Math.floor(remaining / coinCents));
      dispensedCoins[key] -= toRemove;
      remaining -= toRemove * coinCents;
      if (remaining <= 0) break;
    }
  }

  // Can we add at least 1¢ more? (for disabling arrow)
  function canBulkIncrement() {
    return coinTypes.some(({ key }) => dispensedCoins[key] < coin[key].count);
  }

  // Do we have at least 1¢ selected? (for disabling arrow)
  function canBulkDecrement() {
    return dispenseTotal > 0;
  }

  // Can we add more of this coin? (grey out arrow if not)
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

<!-- Dispense header with total and increment/decrement buttons -->
<div class="dispense-header">
  <button
    class="arrow-btn"
    onclick={bulkIncrement}
    disabled={!canBulkIncrement()}
  >▲</button>

  <p class="dispense-total">
    ${dispenseTotal.toFixed(2)} / ${totalBalance.toFixed(2)}
  </p>

  <button
    class="arrow-btn"
    onclick={bulkDecrement}
    disabled={!canBulkDecrement()}
  >▼</button>
</div>

<!-- Coin dispense columns -->
<div class="dispense-grid">
  <div class="cancel-enter"><button class="cancel-btn" onclick={cancelDispense}>Cancel</button></div>
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
  <div class="cancel-enter"><button class="enter-btn" onclick={confirmDispense} disabled={dispenseTotal <= 0}>Enter</button></div>
</div>
