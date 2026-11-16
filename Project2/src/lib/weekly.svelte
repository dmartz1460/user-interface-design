<script>
  import { events, favoriteItems, isFavorite, searchItem, timelineHours, dateKey } from './items.js';
  let { search_results = [], results_per_page, date, locations = [], weekStart, onSelect, onToggleFavorite } = $props();

  // ── Day columns ──
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let showWeekends = $state(false);

  // Build all 7 day headers with real dates from weekStart
  let allDays = $derived(
    DAY_NAMES.map((abbr, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return {
        abbr,
        date: d,
        label: `${abbr} ${d.getDate()}`,
        isToday: isSameDay(d, new Date()),
        isWeekend: i === 0 || i === 6,
      };
    })
  );

  let visibleDays = $derived(showWeekends ? allDays : allDays.filter(d => !d.isWeekend));

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth()    === b.getMonth()
        && a.getDate()     === b.getDate();
  }

  // ── Hour rows: 7 AM – 9 PM ──
  const HOUR_START = 7;
  const HOUR_END   = 21;
  const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

  // Shared slider (applies to all grids)
  let startIndex = $state(1);  // 8 AM
  let endIndex   = $state(10); // 5 PM
  let dragging   = $state(null);
  let trackEl;

  let selectedHours = $derived(HOURS.slice(startIndex, endIndex + 1));

  function pct(i) { return (i / (HOURS.length - 1)) * 100; }

  function hourLabel(h) {
    if (h === 12) return '12 PM';
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
  }
  function sliderLabel(i) { return hourLabel(HOURS[i]); }

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

  // ── Per-result collapse state ──
  // Map from result index → boolean (true = expanded)
  // All results start expanded.
  let expanded = $state(search_results.map(() => true));

  // Keep expanded array in sync when search_results changes length
  $effect(() => {
    const len = search_results.length;
    if (expanded.length !== len) {
      expanded = search_results.map((_, i) => expanded[i] ?? true);
    }
  });

  function toggleRow(i) {
    expanded[i] = !expanded[i];
  }

  function expandAll()   { expanded = expanded.map(() => true);  }
  function collapseAll() { expanded = expanded.map(() => false); }

  let bookedEvents = $derived($events.map(timelineHours));

  const ROW_H = 40;

  // Events for a given location + day visible in the current hour range
  function eventsForCell(locationName, day) {
    const visStart = HOURS[startIndex];
    const visEnd   = HOURS[endIndex] + 1;
    return bookedEvents.filter(ev =>
      ev.location === locationName &&
      ev.date === dateKey(day)     &&
      ev.endHour   > visStart      &&
      ev.startHour < visEnd
    );
  }

  // Top/height of an event block within the visible hour range
  function blockStyle(ev) {
    const visStart     = HOURS[startIndex];
    const clampedStart = Math.max(ev.startHour, visStart);
    const clampedEnd   = Math.min(ev.endHour, HOURS[endIndex] + 1);
    const top          = (clampedStart - visStart) * ROW_H;
    const height       = Math.max(ROW_H * 0.4, (clampedEnd - clampedStart) * ROW_H - 4);
    return `top:${top + 2}px; height:${height}px;`;
  }

  // Availability badge for the row header
  // Returns 'free' | 'partial' | 'busy' based on today's bookings
  function todayStatus(locationName) {
    const todayEvents = bookedEvents.filter(e => e.location === locationName && e.date === dateKey(new Date()));
    if (!todayEvents.length) return 'free';
    const hours  = todayEvents.reduce((s, e) => s + (e.endHour - e.startHour), 0);
    return hours >= 4 ? 'busy' : 'partial';
  }

  // Grid top offset (px): one header row of 40px
  const GRID_TOP = 40;
</script>

<!-- ── Weekly View ── -->
<div class="weekly-view">

  <!-- Global controls bar -->
  <div class="controls-bar">
    <!-- Hour slider -->
    <div class="slider-wrap">
      <span class="slider-label-text">Hours:</span>
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
          role="slider" tabindex="0"
          aria-label="Start hour"
          aria-valuemin={0} aria-valuemax={HOURS.length - 1}
          aria-valuenow={startIndex} aria-valuetext={sliderLabel(startIndex)}
        >
          <span class="thumb-label">{sliderLabel(startIndex)}</span>
        </div>

        <div
          class="slider-thumb"
          style="left:{pct(endIndex)}%;"
          onpointerdown={(e) => onPointerDown('end', e)}
          role="slider" tabindex="0"
          aria-label="End hour"
          aria-valuemin={0} aria-valuemax={HOURS.length - 1}
          aria-valuenow={endIndex} aria-valuetext={sliderLabel(endIndex)}
        >
          <span class="thumb-label">{sliderLabel(endIndex)}</span>
        </div>
      </div>
    </div>

    <!-- Right-side controls -->
    <div class="right-controls">
      <!-- Legend -->
      <div class="legend">
        <span class="legend-item"><span class="legend-swatch booked"></span>Booked</span>
        <span class="legend-item"><span class="legend-swatch available"></span>Available</span>
        <span class="legend-item"><span class="legend-today-dot"></span>Today</span>
      </div>

      <!-- Weekend toggle -->
      <label class="weekend-toggle">
        <input type="checkbox" bind:checked={showWeekends} />
        Weekends
      </label>

      <!-- Expand / Collapse all -->
      <div class="bulk-actions">
        <button class="bulk-btn" onclick={expandAll}>Expand all</button>
        <button class="bulk-btn" onclick={collapseAll}>Collapse all</button>
      </div>
    </div>
  </div>

  <!-- One collapsible row per search result -->
  <div class="result-list">
    {#each search_results as result, ri}
      {@const isOpen   = expanded[ri] ?? true}
      {@const status   = todayStatus(result.name)}
      {@const favorite = isFavorite($favoriteItems, searchItem(result))}

      <!-- Row header (always visible, click to toggle) -->
      <div class="result-row">
        <div class="row-toggle">
          <button class="expand-toggle" type="button" onclick={() => toggleRow(ri)}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${result.name}`}
            aria-expanded={isOpen} aria-controls="weekly-grid-{ri}">
          <!-- Chevron -->
          <span class="chevron" class:open={isOpen} aria-hidden="true">›</span>
          </button>
          <button class="star" class:filled={favorite} type="button" onclick={() => onToggleFavorite(result)}
            aria-pressed={favorite}
            aria-label={`${favorite ? 'Remove' : 'Add'} ${result.name} ${favorite ? 'from' : 'to'} favorites`}>{favorite ? '★' : '☆'}</button>

          <!-- Blue dot + name -->
          <span class="loc-dot" aria-hidden="true"></span>
          <button class="row-name" type="button" onclick={() => onSelect(result)}>{result.name}</button>

          <!-- Availability badge -->
          <span class="avail-badge avail-{status}">
            {#if status === 'free'}● Free today{/if}
            {#if status === 'partial'}◑ Partial{/if}
            {#if status === 'busy'}● Busy today{/if}
          </span>
        </div>

        <!-- Collapsible weekly grid -->
        {#if isOpen}
          <div class="grid-wrap" id="weekly-grid-{ri}">
            <div
              class="week-grid"
              style="--row-h:{ROW_H}px; --num-days:{visibleDays.length};"
            >
              <!-- Corner cell -->
              <div class="grid-corner"></div>

              <!-- Day column headers -->
              {#each visibleDays as day}
                <div class="day-header" class:today={day.isToday} class:weekend={day.isWeekend}>
                  {day.label}
                  {#if day.isToday}<span class="today-pip" aria-label="Today"></span>{/if}
                </div>
              {/each}

              <!-- Hour rows -->
              {#each selectedHours as h}
                <div class="hour-label" class:pm={h >= 12}>{hourLabel(h)}</div>
                {#each visibleDays as day}
                  <div
                    class="grid-cell"
                    class:today={day.isToday}
                    aria-label="{day.label} {hourLabel(h)}"
                  ></div>
                {/each}
              {/each}
            </div>

            <!-- Event block overlay -->
            <div
              class="events-overlay"
              style="--grid-top:{GRID_TOP}px; --col-w:calc((100% - 72px) / {visibleDays.length}); --row-h:{ROW_H}px;"
            >
              {#each visibleDays as day, di}
                {@const col_events = eventsForCell(result.name, day.date)}
                <div
                  class="day-col-overlay"
                  style="left:calc(72px + {di} * var(--col-w)); width:var(--col-w);"
                >
                  {#each col_events as ev}
                    <button
                      class="event-block"
                      type="button"
                      onclick={() => onSelect(ev)}
                      style={blockStyle(ev)}
                      title="{ev.name} ({hourLabel(Math.floor(ev.startHour))}–{hourLabel(Math.ceil(ev.endHour))})"
                    >
                      <span class="event-accent"></span>
                      <span class="event-label">{ev.name}</span>
                    </button>
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/each}

    {#if search_results.length === 0}
      <p class="empty-msg">No results to display.</p>
    {/if}
  </div>
</div>

<style>
  /* ── Wrapper ── */
  .weekly-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* ── Controls bar ── */
  .controls-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    padding: 0 4px 4px;
  }

  /* Slider section */
  .slider-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 200px;
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
    left: 0; right: 0;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
  }
  .slider-range {
    position: absolute;
    top: 0; height: 100%;
    background: #2F6FED;
    border-radius: 3px;
  }
  .slider-thumb {
    position: absolute;
    top: 20px;
    width: 18px; height: 18px;
    background: #fff;
    border: 3px solid #2F6FED;
    border-radius: 50%;
    transform: translateX(-50%);
    cursor: grab;
    z-index: 2;
  }
  .slider-thumb:active { cursor: grabbing; background: #2F6FED; }
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

  /* Right-side controls */
  .right-controls {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  /* Legend */
  .legend {
    display: flex;
    gap: 10px;
    font-size: 11px;
    color: #64748b;
  }
  .legend-item { display: flex; align-items: center; gap: 4px; }
  .legend-swatch {
    display: inline-block;
    width: 12px; height: 12px;
    border-radius: 3px;
  }
  .legend-swatch.booked    { background: rgb(22 163 74 / 22%); border-left: 3px solid #16A34A; }
  .legend-swatch.available { background: #f1f5f9; border: 1px solid #e3e3e6; }
  .legend-today-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #E00122;
  }

  /* Weekend toggle */
  .weekend-toggle {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #64748b;
    cursor: pointer;
  }
  .weekend-toggle input { cursor: pointer; }

  /* Expand/Collapse all */
  .bulk-actions {
    display: flex;
    gap: 6px;
  }
  .bulk-btn {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border: 1px solid #e3e3e6;
    border-radius: 6px;
    background: #f8fafc;
    color: #334155;
    cursor: pointer;
  }
  .bulk-btn:hover { background: #e2e8f0; }

  /* ── Result list ── */
  .result-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ── Individual result row ── */
  .result-row {
    border: 1px solid #e3e3e6;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  /* Row toggle button (the header strip) */
  .row-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: #f8fafc;
    border: none;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: background 0.1s;
  }
  .row-toggle:hover { background: #f0f4f8; }
  /* Show bottom border only when expanded */
  .row-toggle:has([aria-expanded="true"]) {
    border-bottom-color: #e3e3e6;
  }

  /* Chevron rotates when expanded */
  .chevron {
    font-size: 16px;
    font-weight: 700;
    color: #64748b;
    transform: rotate(0deg);
    transition: transform 0.18s ease;
    display: inline-block;
    line-height: 1;
  }
  .chevron.open { transform: rotate(90deg); }

  /* Favorite star */
  .star        { font-size: 15px; color: #b5b5bb; line-height: 1; }
  .star.filled { color: #E00122; }
  .expand-toggle, .star, .row-name { border: 0; padding: 0; background: transparent; cursor: pointer; }

  /* Blue dot */
  .loc-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #2F6FED;
    flex-shrink: 0;
  }

  /* Location name */
  .row-name {
    font-size: 14px;
    font-weight: 700;
    color: #1c1c1e;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  /* Availability badge */
  .avail-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 9px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .avail-free    { background: #DCFCE7; color: #166534; }
  .avail-partial { background: #FEF9C3; color: #854D0E; }
  .avail-busy    { background: #F3F3F3; color: #B8011C; }

  /* ── Grid wrapper ── */
  .grid-wrap {
    position: relative;
    overflow-x: auto;
  }

  /* ── CSS Grid layout ── */
  .week-grid {
    display: grid;
    /* col 0 = time labels (72px), then N day columns */
    grid-template-columns: 72px repeat(var(--num-days), 1fr);
    grid-template-rows: 40px repeat(auto-fill, var(--row-h));
    background: #fff;
    min-width: 500px;
  }

  .grid-corner {
    background: #f8fafc;
    border-bottom: 1px solid #e3e3e6;
    border-right: 1px solid #e3e3e6;
  }

  .day-header {
    background: #f8fafc;
    border-bottom: 1px solid #e3e3e6;
    border-left: 1px solid #e3e3e6;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    padding: 0 4px;
  }
  .day-header.today   { color: #E00122; }
  .day-header.weekend { background: #fafafa; color: #94a3b8; }

  .today-pip {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #E00122;
    flex-shrink: 0;
  }

  .hour-label {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 3px 6px 0 0;
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    border-top: 1px solid #e3e3e6;
    border-right: 1px solid #e3e3e6;
    background: #f8fafc;
  }
  .hour-label.pm { color: #1E40AF; }

  .grid-cell {
    border-top: 1px solid #e3e3e6;
    border-left: 1px solid #e3e3e6;
    background: #fff;
    min-height: var(--row-h);
  }
  .grid-cell.today { background: #F3F3F3; }

  /* ── Event overlay ── */
  .events-overlay {
    position: absolute;
    top: var(--grid-top);
    left: 0; right: 0; bottom: 0;
    pointer-events: none;
  }

  .day-col-overlay {
    position: absolute;
    top: 0; bottom: 0;
  }

  .event-block {
    position: absolute;
    left: 2px; right: 2px;
    display: flex;
    align-items: stretch;
    background: rgb(22 163 74 / 18%);
    border-radius: 5px;
    overflow: hidden;
    pointer-events: auto;
    cursor: pointer;
    padding: 0;
    border: 0;
    text-align: left;
    transition: background 0.1s;
  }
  .event-block:hover { background: rgb(22 163 74 / 30%); }

  .event-accent {
    display: block;
    width: 4px; min-width: 4px;
    background: #16A34A;
    border-radius: 4px 0 0 4px;
    flex-shrink: 0;
  }

  .event-label {
    font-size: 10px;
    font-weight: 600;
    color: #1c1c1e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px 4px;
    display: flex;
    align-items: center;
  }

  /* ── Empty state ── */
  .empty-msg {
    text-align: center;
    color: #64748b;
    font-size: 13px;
    padding: 24px;
  }
</style>
