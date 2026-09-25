<script>
  // Destructure the props that Control passes
  // bind:activeScreen → needs $bindable() so we can write to it
  // totalBalance      → read-only, just display it
  // timeString        → read-only, displays the current time
  let { activeScreen = $bindable(), totalBalance, timeString } = $props();
</script>

<!-- Top: Clock centered, lock icon right -->
<div class="screen-header">
  <span></span>
  <h1 class="screen-time">{timeString}</h1>
  <p class="lock-icon">🔒</p>
</div>

<!-- Middle: At-a-glance info — same 3-box layout as Home -->
<div class="glance-row">
  <div class="glance-col">
    <div class="glance-box">
      <p class="glance-label">Balance</p>
      <p class="glance-value">${totalBalance.toFixed(2)}</p>
    </div>
  </div>

  <div class="glance-col">
    <div class="glance-box">
      <p class="glance-label">Custom</p>
      <p class="glance-value">—</p>
    </div>
  </div>

  <div class="glance-col">
    <div class="glance-box">
      <p class="glance-label">Goals</p>
      <p class="glance-value">—</p>
    </div>
  </div>
</div>

<!-- Bottom: Unlock action -->
<div class="screen-footer">
  <button class="unlock-button" onclick={() => activeScreen = 'pinpad'}>Unlock</button>
</div>
