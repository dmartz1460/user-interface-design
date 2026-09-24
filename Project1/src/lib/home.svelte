<script>
  let props = $props();
</script>

<section class="screenTemplate">
  <div>
    <h1>{props.time}</h1>
    <button onclick={() => props.navigate('yourBank')}>Your Bank</button>
    <button onclick={() => props.navigate('lock')}>lock</button>
  </div>
  <div class="row">
    <div class="column" id="balance">
      <section>{props.balance}</section>
      <button onclick={() => props.navigate('dispense')}>Dispense</button>
    </div>
    <div class="column" id="customEntries">
      <section></section>
      <button onclick={() => props.navigate('custom')}>Custom Currency</button>
    </div>
    <div class="column" id="goals">
      <section></section>
      <button onclick={() => props.navigate('goals')}>Goals</button>
    </div>
  </div>
</section>