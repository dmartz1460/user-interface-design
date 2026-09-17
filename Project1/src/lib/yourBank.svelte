<script>  
  let pennies = $state(0)
  let nickels = $state(0)
  let dimes = $state(0)
  let quarters = $state(0)
  let total = $derived(pennies * 0.01 + nickels * 0.05 + dimes * 0.10 + quarters * 0.25)
</script>

<body class="screenTemplate" >
  <h1>Your Bank</h1>
  <p class="homeScreenInfo" id="total">Total: ${total.toFixed(2)}</p>
  <div class="coinContainer">
    <ul>
      <button onclick={() => {pennies++}}>Penny</button>
      <p>Pennies: {pennies * 0.01}, {pennies}/100 </p>
      <button onclick={() => {nickels++}}>Nickel</button>
      <p>Nickels: {nickels * 0.05}, {nickels}/100 </p>
      <button onclick={() => {dimes++}}>Dime</button>
      <p>Dimes: {dimes * 0.10}, {dimes}/100 </p>
      <button onclick={() => {quarters++}}>Quarter</button>
      <p>Quarters: {quarters * 0.25}, {quarters}/100 </p>
    </ul>
  </div>
</body>
