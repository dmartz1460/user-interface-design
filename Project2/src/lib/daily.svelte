<script>
  let { search_results = [], results_per_page, date } = $props();

  // ── Hour columns: 7 AM – 9 PM ──
  // Each hour maps to a pixel-width slot in the timeline.
  const HOUR_START = 7;  // 7 AM
  const HOUR_END   = 21; // 9 PM (exclusive)
  const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

  // ── Sample booked events data ──
  // In a real app these would come from a prop or API call filtered by `date`.
  // event.startHour / endHour are decimal (e.g. 10.5 = 10:30 AM).
  const bookedEvents = [
    { location: 'Langsam 520',    name: 'Study time',  startHour: 12,   endHour: 13.5 },
    { location: 'Braunstein 140A', name: 'Lecture',    startHour: 10,   endHour: 12   },
    { location: 'Braunstein 140A', name: 'Org meeting', startHour: 14,  endHour: 16   },
    { location: 'Aronoff 6480A',   name: 'Project',    startHour: 15,   endHour: 17   },
    { location: 'Math 1061',       name: 'Calc review', startHour: 11,  endHour: 12.5 },
    { location: 'TUC Cinema',      name: 'Film night',  startHour: 13,  endHour: 15.5 },
    { location: 'Event 1',         name: 'Physics Lab', startHour: 9,   endHour: 10.5 },
    { location: 'Event 2',         name: 'Seminar',     startHour: 13,  endHour: 14   },
    { location: 'Event 3',         name: 'Office Hours', startHour: 15, endHour: 17   },
  ];

  // ── Slider state ──
  let startIndex = $state(0);
  let endIndex   = $state(HOURS.length - 1);
  let dragging   = $state(null); // 'start' | 'end' | null
  let trackEl;

  // Visible hours subset (by slider)
  let selectedHours = $derived(HOURS.slice(startIndex, endIndex + 1));

  // Percentage position for slider handle
  function pct(i) { return (i / (HOURS.length - 1)) * 100; }

  // Human-readable label: 7 → "7 AM", 13 → "1 PM"
  function hourLabel(h) {
    if (h === 12) return '12 PM';
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
  }
  function sliderLabel(i) { return hourLabel(HOURS[i]); }

  function isPM(h) { return h >= 12; }

  // ── Slider pointer handling ──
  function onPointerDown(handle, e) {
    dragging = handle;
    e.target.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging || !trackEl) return;
    const rect    = trackEl.getBoundingClientRect();
    const x       = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const snapped = Math.round((x / rect.width) * (HOURS.length - 1));
    if (dragging === 'start' && snapped <= endIndex)   startIndex = snapped;
    if (dragging === 'end'   && snapped >= startIndex) endIndex   = snapped;
  }
  function onPointerUp() { dragging = null; }

  // ── Grid geometry ──
  // Event block position as percentage of the visible hour range.
  function eventStyle(ev) {
    const visStart = HOURS[startIndex];
    const visEnd   = HOURS[endIndex] + 1;
    const rangeW   = visEnd - visStart;
    const left  = Math.max(0, (ev.startHour - visStart) / rangeW) * 100;
    const right = Math.min(1, (ev.endHour   - visStart) / rangeW) * 100;
    const width = right - left;
    if (width <= 0) return null;
    return `left:${left.toFixed(2)}%; width:${width.toFixed(2)}%; top:5px; bottom:5px;`;
  }

  // Events for a given location row (filtered to those visible in current time range)
  function eventsForRow(locationName) {
    return bookedEvents
      .filter(e => e.location === locationName)
      .filter(e => eventStyle(e) !== null);
  }
</script>

<!-- ── Daily Timeline View ── -->
<div class="daily-view">

  <!-- Time range slider -->
  <div class="slider-bar">
    <span class="slider-label-text">Time range:</span>
    <div
      class="time-slider"
      role="group"
      aria-label="Time range slider"
      bind:this={trackEl}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointerleave={onPointerUp}
    >
      <div class="slider-track">
        <div
          class="slider-range"
          style="left:{pct(startIndex)}%; width:{pct(endIndex) - pct(startIndex)}%;"
        ></div>
      </div>

      <div
        class="slider-thumb"
        style="left:{pct(startIndex)}%;"
        onpointerdown={(e) => onPointerDown('start', e)}
        role="slider"
        tabindex="0"
        aria-label="Start time"
        aria-valuemin={0}
        aria-valuemax={HOURS.length - 1}
        aria-valuenow={startIndex}
        aria-valuetext={sliderLabel(startIndex)}
      >
        <span class="thumb-label">{sliderLabel(startIndex)}</span>
      </div>

      <div
        class="slider-thumb"
        style="left:{pct(endIndex)}%;"
        onpointerdown={(e) => onPointerDown('end', e)}
        role="slider"
        tabindex="0"
        aria-label="End time"
        aria-valuemin={0}
        aria-valuemax={HOURS.length - 1}
        aria-valuenow={endIndex}
        aria-valuetext={sliderLabel(endIndex)}
      >
        <span class="thumb-label">{sliderLabel(endIndex)}</span>
      </div>
    </div>
  </div>

  <!-- Legend -->
  <div class="legend">
    <span class="legend-item">
      <span class="legend-swatch booked"></span> Booked
    </span>
    <span class="legend-item">
      <span class="legend-swatch available"></span> Available
    </span>
  </div>

  <!-- Timeline table -->
  <div class="timeline-wrap">
    <table class="daily-timeline" aria-label="Daily availability timeline">
      <thead>
        <tr>
          <th class="row-label-th" scope="col" aria-label="Location">Location</th>
          {#each selectedHours as h}
            <th class="hour-th" class:pm={isPM(h)} scope="col">{hourLabel(h)}</th>
          {/each}
        </tr>
      </thead>

      <tbody>
        {#each search_results as result}
          {@const rowEvents = eventsForRow(result.name)}
          <tr>
            <td class="row-label">
              <button
                class="fav-btn"
                onclick={() => result.favorite = !result.favorite}
                aria-label={result.favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span class="star" class:filled={result.favorite} aria-hidden="true">
                  {result.favorite ? '★' : '☆'}
                </span>
              </button>
              <span class="loc-dot" aria-hidden="true"></span>
              <span class="loc-name" title={result.name}>{result.name}</span>
            </td>

            <!-- Single timeline cell spanning all visible hour columns -->
            <td class="timeline-cell" colspan={selectedHours.length}>
              <div class="timeline-inner">
                <!-- Vertical hour separator lines -->
                {#each selectedHours as _, ci}
                  {#if ci > 0}
                    <div
                      class="hour-line"
                      style="left:{(ci / selectedHours.length) * 100}%"
                    ></div>
                  {/if}
                {/each}

                <!-- Booked event blocks -->
                {#each rowEvents as ev}
                  {@const style = eventStyle(ev)}
                  {#if style}
                    <div
                      class="event-block"
                      style={style}
                      title="{ev.name} ({hourLabel(Math.floor(ev.startHour))}–{hourLabel(Math.ceil(ev.endHour))})"
                    >
                      <span class="event-accent"></span>
                      <span class="event-label">{ev.name}</span>
                    </div>
                  {/if}
                {/each}
              </div>
            </td>
          </tr>
        {/each}

        {#if search_results.length === 0}
          <tr>
            <td class="empty-row" colspan={selectedHours.length + 1}>
              No results to display.
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style>
  /* ── Wrapper ── */
  .daily-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* ── Slider bar ── */
  .slider-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 4px 4px;
  }
  .slider-label-text {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
  }

  .time-slider {
    position: relative;
    flex: 1;
    height: 48px;
    user-select: none;
    touch-action: none;
  }

  .slider-track {
    position: absolute;
    top: 26px;
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
    background: #2f6fed;
    border-radius: 3px;
  }

  .slider-thumb {
    position: absolute;
    top: 20px;
    width: 18px;
    height: 18px;
    background: #fff;
    border: 3px solid #2f6fed;
    border-radius: 50%;
    transform: translateX(-50%);
    cursor: grab;
    z-index: 2;
  }
  .slider-thumb:active { cursor: grabbing; background: #2f6fed; }

  .thumb-label {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: 700;
    color: #334155;
    white-space: nowrap;
  }

  /* ── Legend ── */
  .legend {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #64748b;
    padding: 0 4px;
  }
  .legend-item { display: flex; align-items: center; gap: 5px; }
  .legend-swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 3px;
  }
  .legend-swatch.booked {
    background: rgba(22, 163, 74, 0.22);
    border-left: 3px solid #16a34a;
  }
  .legend-swatch.available {
    background: #f1f5f9;
    border: 1px solid #e3e3e6;
  }

  /* ── Timeline table ── */
  .timeline-wrap {
    overflow-x: auto;
    border: 1px solid #e3e3e6;
    border-radius: 10px;
  }

  .daily-timeline {
    width: 100%;
    min-width: 700px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .row-label-th {
    width: 190px;
    min-width: 190px;
    padding: 8px 12px;
    background: #f8fafc;
    border-bottom: 1px solid #e3e3e6;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 2;
  }

  .hour-th {
    padding: 8px 4px;
    background: #f8fafc;
    border-bottom: 1px solid #e3e3e6;
    border-left: 1px solid #e3e3e6;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-align: center;
    white-space: nowrap;
  }
  .hour-th.pm {
    background: #eef2fd;
    color: #2f6fed;
  }

  .row-label {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px 8px 8px;
    background: #fff;
    border-bottom: 1px solid #e3e3e6;
    white-space: nowrap;
    position: sticky;
    left: 0;
    z-index: 1;
    min-width: 190px;
    max-width: 190px;
    width: 190px;
    box-sizing: border-box;
  }

  .fav-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 15px;
    line-height: 1;
    display: flex;
    align-items: center;
  }
  .star        { color: #b5b5bb; }
  .star.filled { color: #e00122; }

  .loc-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #2f6fed;
    flex-shrink: 0;
  }

  .loc-name {
    font-size: 13px;
    font-weight: 600;
    color: #1c1c1e;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .timeline-cell {
    padding: 0;
    border-bottom: 1px solid #e3e3e6;
    height: 56px;
  }

  .timeline-inner {
    position: relative;
    width: 100%;
    height: 56px;
    background: #fafafa;
  }

  .hour-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #e3e3e6;
  }

  /* ── Event block ── */
  .event-block {
    position: absolute;
    display: flex;
    align-items: stretch;
    background: rgba(22, 163, 74, 0.18);
    border-radius: 6px;
    overflow: hidden;
    cursor: default;
    min-width: 28px;
    transition: background 0.1s;
  }
  .event-block:hover { background: rgba(22, 163, 74, 0.30); }

  .event-accent {
    display: block;
    width: 4px;
    min-width: 4px;
    background: #16a34a;
    border-radius: 4px 0 0 4px;
    flex-shrink: 0;
  }

  .event-label {
    font-size: 11px;
    font-weight: 600;
    color: #1c1c1e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 4px;
    display: flex;
    align-items: center;
  }

  /* ── Empty state ── */
  .empty-row {
    text-align: center;
    color: #64748b;
    font-size: 13px;
    padding: 24px;
    border-bottom: 1px solid #e3e3e6;
  }
</style>
