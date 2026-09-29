<script>
  // Destructure the props that Control passes
  // bind:activeScreen → needs $bindable() so we can write to it
  // totalBalance      → read-only, just display it
  // timeString        → read-only, displays the current time
  let { activeScreen = $bindable(), totalBalance, timeString } = $props();
</script>

<!-- Top bar: Clock + navigation -->
<div class="screen-header">
  <p class="screen-time">{timeString}</p>
  <button class="your-bank-btn" onclick={() => activeScreen = 'yourBank'}>Your Bank</button>
  <button class="lock-icon" onclick={() => activeScreen = 'lock'}>🔒</button>
</div>

<!-- Main content: 3 equal columns, each with box above button -->
<div class="glance-row">
  <div class="glance-col">
    <div class="glance-box">
      <p class="glance-label">Balance</p>
      <p class="glance-value">${totalBalance.toFixed(2)}</p>
    </div>
    <button class="glance-btn" onclick={() => activeScreen = 'dispense'}>Dispense</button>
  </div>

  <div class="glance-col">
    <div class="glance-box">
      <p class="glance-label">Custom</p>
      <p class="glance-value">—</p>
    </div>
    <button class="glance-btn" onclick={() => activeScreen = 'home'}>Custom Currency</button>
  </div>

  <div class="glance-col">
    <div class="glance-box">
      <p class="glance-label">Goals</p>
      <p class="glance-value">—</p>
    </div>
    <button class="glance-btn" onclick={() => activeScreen = 'home'}>Goals</button>
  </div>
</div>