<script>
  // Destructure the props that Control passes
  // bind:activeScreen → needs $bindable() so we can write to it
  // totalBalance      → read-only, just display it
  // timeString        → read-only, displays the current time
  let { activeScreen = $bindable(), totalBalance, timeString } = $props();
</script>

<section class="screen-template">
  <!-- Top bar: Clock + navigation -->
  <div class="screen-header">
    <h1>{timeString}</h1>
    <button onclick={() => activeScreen = 'yourBank'}>Your Bank</button>
    <button onclick={() => activeScreen = 'lock'}>🔒</button>
  </div>

  <!-- Main content: 3-column layout matching Lock -->
  <div class="at-a-glance">
    <div>
      <p>${totalBalance.toFixed(2)}</p>
      <button onclick={() => activeScreen = 'dispense'}>Dispense</button>
    </div>
    <div>
      <p>Custom</p>
      <button onclick={() => activeScreen = 'custom'}>Custom Currency</button>
    </div>
    <div>
      <p>Goals</p>
      <button onclick={() => activeScreen = 'goals'}>Goals</button>
    </div>
  </div>
</section>