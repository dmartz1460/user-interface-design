<script>
  let props = $props();

  // Calculate new dispense target based on coin type and current bank state
  /** @param {string | null} coin */
  let dispenseTarget = $derived.by((coin) => {
    if (coin === null) {
      if (props.quarters > 0) {
        return props.bankState.dispenseTarget + 0.25;
      } else if (props.dimes > 0) {
        return props.bankState.dispenseTarget + 0.10;
      } else if (props.nickels > 0) {
        return props.bankState.dispenseTarget + 0.05;
      } else if (props.pennies > 0) {
        return props.bankState.dispenseTarget + 0.01;
      }
    }
    else if (coin === 'quarter') {
      return props.bankState.dispenseTarget + 0.25;
    } else if (coin === 'dime') {
      return props.bankState.dispenseTarget + 0.10;
    } else if (coin === 'nickel') {
      return props.bankState.dispenseTarget + 0.05;
    } else if (coin === 'penny') {
      return props.bankState.dispenseTarget + 0.01;
    }
  });
</script>

<section class="screenTemplate">
  <div> 
    <button onclick={() => dispenseTarget(null)}>arrowup</button>
    <p>{props.bankState.dispenseTarget} / {props.bankState.balance}</p>
    <button onclick={() => dispenseTarget(null)}>arrowdown</button>
  </div>
  <div class="row">
    <div class="column" id="balance">
      <section>{props.bankState.balance}</section>
      <button onclick={() => dispenseTarget('quarter')}>Dispense Quarter</button>
      <button onclick={() => dispenseTarget('dime')}>Dispense Dime</button>
      <button onclick={() => dispenseTarget('nickel')}>Dispense Nickel</button>
      <button onclick={() => dispenseTarget('penny')}>Dispense Penny</button>
    </div>
  </div>
</section>