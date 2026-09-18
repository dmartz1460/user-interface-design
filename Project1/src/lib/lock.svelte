<script>
  let props = $props();
</script>

<div>
  <div class="screenTemplate">
    <h1>{props.time}</h1>
    <p>locked</p>
  </div>
  <div class="row" id="totalCounter">
    <div class="column">
      <p>{props.total}</p>
    </div>
    <div class="column" id="customEntries">
      <p></p>
    </div>
    <div class="column" id="goals">
      <p></p>
    </div>
  </div>
  <div class="unlockButton">
    <button>Unlock</button>
  </div>
</div>