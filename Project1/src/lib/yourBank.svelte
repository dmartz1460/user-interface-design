<script>  
  let props = $props();
</script>

<section class="screenTemplate" >
  <h1>Your Bank</h1>
  <p class="homeScreenInfo" id="total">Total: ${props.balance.toFixed(2)}</p>
  <div class="coinContainer">
    <ul>
      <p>Pennies: {props.bankState.pennies * 0.01} cents, {props.bankState.pennies}/100 </p>
      <p>Nickels: {props.bankState.nickels * 0.05} cents, {props.bankState.nickels}/100 </p>
      <p>Dimes: {props.bankState.dimes * 0.10} cents, {props.bankState.dimes}/100 </p>
      <p>Quarters: {props.bankState.quarters * 0.25} cents, {props.bankState.quarters}/100 </p>
    </ul>
  </div>
</section>
