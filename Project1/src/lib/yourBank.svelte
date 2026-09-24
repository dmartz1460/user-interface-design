<script>  
  // Destructure the props that Control passes
  // bind:activeScreen → needs $bindable() so we can write to it
  // totalBalance      → read-only, just display it
  // coin              → read-only, displays the current coin counts and capacities
  let { activeScreen = $bindable(), totalBalance, coin } = $props();
</script>

<section class="screen-template" >
  <div class="screen-header">
    <button class="back-btn" onclick={() => activeScreen = 'home'}>Back</button>
    <h1>Your Bank</h1>
  </div>
  <div>
    <p>Total: {totalBalance.toFixed(2)}</p>
    <ul>
      <li>Pennies: {coin.pennies.count * 0.01} cents, {coin.pennies.count}/{coin.pennies.capacity} </li>
      <li>Nickels: {coin.nickels.count * 0.05} cents, {coin.nickels.count}/{coin.nickels.capacity} </li>
      <li>Dimes: {coin.dimes.count * 0.10} cents, {coin.dimes.count}/{coin.dimes.capacity} </li>
      <li>Quarters: {coin.quarters.count * 0.25} cents, {coin.quarters.count}/{coin.quarters.capacity} </li>
    </ul>
  </div>
</section>
