<script>  
  // Destructure the props that Control passes
  // bind:activeScreen → needs $bindable() so we can write to it
  // totalBalance      → read-only, just display it
  // coin              → read-only, displays the current coin counts and capacities
  let { activeScreen = $bindable(), totalBalance, coin } = $props();
</script>

<div class="screen-header">
  <div><button class="cancel-btn" onclick={() => activeScreen = 'home'}>Back</button></div>
  <h1>Your Bank</h1>
</div>
<div class="your-bank">
  <p>Total: {totalBalance.toFixed(2)}</p>
  <p>Pennies: {coin.pennies.count * 0.01} cents, {coin.pennies.count}/{coin.pennies.capacity} </p>
  <p>Nickels: {coin.nickels.count * 0.05} cents, {coin.nickels.count}/{coin.nickels.capacity} </p>
  <p>Dimes: {coin.dimes.count * 0.10} cents, {coin.dimes.count}/{coin.dimes.capacity} </p>
  <p>Quarters: {coin.quarters.count * 0.25} cents, {coin.quarters.count}/{coin.quarters.capacity} </p>
</div>
