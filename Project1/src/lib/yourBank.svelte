<script>  
  let props = $props();
</script>

<div class="screenTemplate" >
  <h1>Your Bank</h1>
  <p class="homeScreenInfo" id="total">Total: ${props.total.toFixed(2)}</p>
  <div class="coinContainer">
    <ul>
      <p>Pennies: {props.pennies * 0.01}, {props.pennies}/100 </p>
      <p>Nickels: {props.nickels * 0.05}, {props.nickels}/100 </p>
      <p>Dimes: {props.dimes * 0.10}, {props.dimes}/100 </p>
      <p>Quarters: {props.quarters * 0.25}, {props.quarters}/100 </p>
    </ul>
  </div>
</div>
