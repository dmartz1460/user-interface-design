<script>
  let { coin, insertedCoin, lastDispensed } = $props();

  // Capacity calculation
  let totalCount = $derived(
    coin.quarters.count + coin.dimes.count +
    coin.nickels.count + coin.pennies.count
  );

  let totalCapacity = $derived(
    coin.quarters.capacity + coin.dimes.capacity +
    coin.nickels.capacity + coin.pennies.capacity
  );

  let capacityPercent = $derived(
    Math.round((totalCount / totalCapacity) * 100)
  );

  // Warning if within 10% of max 
  let isWarning = $derived(capacityPercent >= 90);

  // Coin insertion popup
  let showInsertPopup = $state(false);

  $effect(() => {
    if (insertedCoin) {
      showInsertPopup = true;
      const timeout = setTimeout(() => { showInsertPopup = false; }, 3000);
      return () => clearTimeout(timeout);
    }
  });

  // Dispense popup
  let showDispensePopup = $state(false);

  $effect(() => {
    if (lastDispensed) {
      showDispensePopup = true;
      const timeout = setTimeout(() => { showDispensePopup = false; }, 4000);
      return () => clearTimeout(timeout);
    }
  });
</script>

<aside class="reactive-display">

  <!-- Capacity Bar -->
  <div class="capacity-section">
    <p class="capacity-label">Bank Capacity</p>
    <div class="capacity-bar-outer">
      <div
        class="capacity-bar-inner"
        class:warning={isWarning}
        style="width: {capacityPercent}%"
      ></div>
    </div>
    <p class="capacity-text" class:warning={isWarning}>
      {capacityPercent}%
    </p>
  </div>

  <!-- Coin Insertion Popup -->
  {#if showInsertPopup && insertedCoin}
    <div class="coin-popup">
      <p class="popup-title">Coin Inserted!</p>
      <p class="popup-coin">{insertedCoin.type}</p>
      <p class="popup-count">
        {insertedCoin.count} / {insertedCoin.capacity}
      </p>
    </div>
  {/if}

  <!-- Dispense Popup -->
  {#if showDispensePopup && lastDispensed}
    <div class="coin-popup dispense-popup">
      <p class="popup-title">Dispensed!</p>
      {#if lastDispensed.quarters > 0}
        <p class="popup-coin">🪙 Quarters × {lastDispensed.quarters}</p>
      {/if}
      {#if lastDispensed.dimes > 0}
        <p class="popup-coin">🥈 Dimes × {lastDispensed.dimes}</p>
      {/if}
      {#if lastDispensed.nickels > 0}
        <p class="popup-coin">🥉 Nickels × {lastDispensed.nickels}</p>
      {/if}
      {#if lastDispensed.pennies > 0}
        <p class="popup-coin">🟤 Pennies × {lastDispensed.pennies}</p>
      {/if}
    </div>
  {/if}
</aside>