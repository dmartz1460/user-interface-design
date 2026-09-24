<script>
  let props = $props();
</script>

<section class="screenTemplate">
  <div>
    <h1>{props.time}</h1>
    <p>locked</p>
  </div>
  <div class="row">
    <div class="column" id="balance">
      <p>{props.balance}</p>
    </div>
    <div class="column" id="customEntries">
      <p></p>
    </div>
    <div class="column" id="goals">
      <p></p>
    </div>
  </div>
  <div class="unlockButton">
    <button onclick={() => props.navigate('home')}>Unlock</button>
  </div>
</section>