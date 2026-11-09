<script>
  let { search_results, results_per_page, date } = $props();

  let hours = $state([
    '7am', '8am', '9am', '10am', '11am', '12pm', '1pm',
    '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'
  ]);

  // Slider state (indices into hours[])
  let startIndex = $state(0);
  let endIndex = $state(14);

  // Dragging state
  let dragging = $state(null); // 'start' | 'end' | null
  let trackEl;

  // Derived: selected hours subset
  let selectedHours = $derived(hours.slice(startIndex, endIndex + 1));

  // Convert index to display label (uppercase)
  function label(i) {
    return hours[i].toUpperCase();
  }

  // Check if hour index is PM (index 5 = 12pm onward)
  function isPM(i) {
    return i >= 5;
  }

  // Get the percentage position for a given index
  function pct(i) {
    return (i / (hours.length - 1)) * 100;
  }

  // Pointer event handlers for dragging
  function onPointerDown(handle, e) {
    dragging = handle;
    e.target.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging || !trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const snapped = Math.round(ratio * (hours.length - 1));

    if (dragging === 'start' && snapped <= endIndex) {
      startIndex = snapped;
    } else if (dragging === 'end' && snapped >= startIndex) {
      endIndex = snapped;
    }
  }

  function onPointerUp() {
    dragging = null;
  }
</script>

<!-- Results Table (only selected hours) -->
<table class="daily-results">
  <thead>
    <tr>
      <th style="width: 10%"><div
          class="time-slider"
          bind:this={trackEl}
          onpointermove={onPointerMove}
          onpointerup={onPointerUp}
          onpointerleave={onPointerUp}
        >
          <!-- Track background -->
          <div class="slider-track">
            <!-- Active range fill -->
            <div
              class="slider-range"
              style="left: {pct(startIndex)}%; width: {pct(endIndex) - pct(startIndex)}%;"
            ></div>
          </div>

          <!-- Start handle -->
          <div
            class="slider-thumb"
            style="left: {pct(startIndex)}%;"
            onpointerdown={(e) => onPointerDown('start', e)}
            role="slider"
            tabindex="0"
            aria-label="Start time"
            aria-valuemin={0}
            aria-valuemax={hours.length - 1}
            aria-valuenow={startIndex}
            aria-valuetext={label(startIndex)}
          >
            <span class="thumb-label">{label(startIndex)}</span>
          </div>

          <!-- End handle -->
          <div
            class="slider-thumb"
            style="left: {pct(endIndex)}%;"
            onpointerdown={(e) => onPointerDown('end', e)}
            role="slider"
            tabindex="0"
            aria-label="End time"
            aria-valuemin={0}
            aria-valuemax={hours.length - 1}
            aria-valuenow={endIndex}
            aria-valuetext={label(endIndex)}
          >
            <span class="thumb-label">{label(endIndex)}</span>
          </div>
        </div>
      </th>
      {#each selectedHours as hour}
        <th class:pm-header={isPM(hours.indexOf(hour))}>{hour}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each search_results as result}
      <tr>
        <td>
          <button onclick={() => result.favorite = !result.favorite}>
            {result.favorite ? '★' : '☆'}
          </button>{result.name}
        </td>
        {#each selectedHours as hour}
          <td>{result[hour] ?? ''}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  /* ── Time Slider ── */
  .time-slider {
    position: relative;
    height: 60px;
    user-select: none;
    touch-action: none;
  }

  .slider-track {
    position: absolute;
    top: 28px;
    left: 0;
    right: 0;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
  }

  .slider-range {
    position: absolute;
    top: 0;
    height: 100%;
    background: #5b8def;
    border-radius: 3px;
  }

  .slider-thumb {
    position: absolute;
    top: 22px;
    width: 18px;
    height: 18px;
    background: white;
    border: 3px solid #5b8def;
    border-radius: 50%;
    transform: translateX(-50%);
    cursor: grab;
    z-index: 2;
  }

  .slider-thumb:active {
    cursor: grabbing;
    background: #5b8def;
  }

  .thumb-label {
    position: absolute;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: bold;
    color: #333;
    white-space: nowrap;
  }

  /* ── Results Table ── */
  .daily-results {
    border-top: 2px;
    border-bottom: 2px;
    border-color: black;
  }

  table {
    width: 100%;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-top: 2px solid #ddd;
  }

  .pm-header {
    background: #dce6f5;
    color: #3a6bc5;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
</style>
