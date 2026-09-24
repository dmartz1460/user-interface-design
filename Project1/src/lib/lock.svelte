<script>
  // Destructure the props that Control passes
  // bind:activeScreen → needs $bindable() so we can write to it
  // totalBalance      → read-only, just display it
  // timeString        → read-only, displays the current time
  let { activeScreen = $bindable(), totalBalance, timeString } = $props();
</script>

<section class="screen-template">
  <!-- Top: Clock -->
  <div class="screen-header">
    <h1>{timeString}</h1>
    <p>🔒</p>
  </div>

  <!-- Middle: At-a-glance info -->
  <div class="at-a-glance">
    <div>
      <p>${totalBalance.toFixed(2)}</p>
    </div>
    <div>
      <p>Custom</p>
    </div>
    <div>
      <p>Goals</p>
    </div>
  </div>

  <!-- Bottom: Unlock action -->
  <div class="unlock-button">
    <button onclick={() => activeScreen = 'pinpad'}>Unlock</button>
  </div>
</section>