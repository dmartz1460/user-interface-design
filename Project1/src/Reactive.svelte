<script>
  import warningIcon from "./assets/warning.png";
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
  let capacityWarning = $derived(capacityPercent >= 90);
  let coinFullWarning = $derived(insertedCoin && coin[insertedCoin.type].full);

  // Warning, insertion, and dispense popups
  let showInsertPopup = $state(false);
  let showWarningPopup = $state(false);
  let showDispensePopup = $state(false);

  $effect(() => {
    if (capacityWarning || coinFullWarning) {
      showWarningPopup = true;
      const timeout = setTimeout(() => { showWarningPopup = false; capacityWarning = false; coinFullWarning = false; }, 3000);
      return () => clearTimeout(timeout);
    }
  });

  $effect(() => {
    if (insertedCoin) {
      showInsertPopup = true;
      const timeout = setTimeout(() => { showInsertPopup = false; }, 3000);
      return () => clearTimeout(timeout);
    }
  });

  $effect(() => {
    if (lastDispensed) {
      showDispensePopup = true;
      const timeout = setTimeout(() => { showDispensePopup = false; }, 4000);
      return () => clearTimeout(timeout);
    }
  });
</script>

<aside class="reactive-display">

  <!-- Capacity Warning Popups -->
  {#if capacityWarning && showWarningPopup}
    <div class="capacity-warning">
      <img src={warningIcon} alt="Warning" style="width: 40px; height: 40px;"/>
      <p>Warning: Bank capacity is almost full!</p>
    </div>
  {/if}
  {#if coinFullWarning && showWarningPopup}
    <div class="capacity-warning">
      <img src={warningIcon} alt="Warning" style="width: 40px; height: 40px;"/>
      <p>Warning: {insertedCoin.type} compartment is full!</p>
    </div>
  {/if}

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

  <!-- Capacity Bar -->
  <div class="capacity-section">
    <p class="capacity-label">Bank Capacity</p>
    <div class="capacity-bar-outer">
      <div
        class="capacity-bar-inner"
        style="width: {capacityPercent}%"
      ></div>
    </div>
    <p class="capacity-text">
      {capacityPercent}%
    </p>
  </div>

</aside>