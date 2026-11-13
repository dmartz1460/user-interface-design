<script>
  let { search_results = [], results_per_page, date, locations = [], weekStart } = $props();

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

  // ── Sample booked events ──
  // Format: { location, dayOffset (0=Sun … 6=Sat), startHour, endHour, name }
  const bookedEvents = [
    { location: 'Langsam 520',     dayOffset: 1, startHour: 10,   endHour: 11.5, name: 'Lecture'       },
    { location: 'Langsam 520',     dayOffset: 2, startHour: 13,   endHour: 14,   name: 'Study time'    },
    { location: 'Langsam 520',     dayOffset: 3, startHour: 11,   endHour: 12,   name: 'Org meeting'   },
    { location: 'Langsam 520',     dayOffset: 4, startHour: 9,    endHour: 9.5,  name: 'Tutoring'      },
    { location: 'Langsam 520',     dayOffset: 4, startHour: 14.5, endHour: 16,   name: 'Project'       },
    { location: 'Langsam 520',     dayOffset: 5, startHour: 13,   endHour: 14.5, name: 'Euchre night'  },
    { location: 'Braunstein 140A', dayOffset: 1, startHour: 9,    endHour: 11,   name: 'Physics Lab'   },
    { location: 'Braunstein 140A', dayOffset: 3, startHour: 13,   endHour: 15,   name: 'Office Hours'  },
    { location: 'Aronoff 6480A',   dayOffset: 2, startHour: 10,   endHour: 11,   name: 'Seminar'       },
    { location: 'Aronoff 6480A',   dayOffset: 4, startHour: 15,   endHour: 16,   name: 'Lab session'   },
    { location: 'Math 1061',       dayOffset: 1, startHour: 14,   endHour: 16,   name: 'Club meeting'  },
    { location: 'TUC Cinema',      dayOffset: 3, startHour: 10.5, endHour: 12,   name: 'Review session'},
    // Fallback entries keyed by generic names (matches sample data in search.svelte)
    { location: 'Location 1',      dayOffset: 1, startHour: 10,   endHour: 11.5, name: 'Lecture'       },
    { location: 'Location 1',      dayOffset: 3, startHour: 11,   endHour: 12,   name: 'Org meeting'   },
    { location: 'Location 2',      dayOffset: 1, startHour: 9,    endHour: 11,   name: 'Physics Lab'   },
    { location: 'Location 2',      dayOffset: 4, startHour: 14,   endHour: 15.5, name: 'Club meeting'  },
    { location: 'Location 3',      dayOffset: 2, startHour: 10,   endHour: 11,   name: 'Seminar'       },
    { location: 'Location 4',      dayOffset: 5, startHour: 13,   endHour: 14,   name: 'Study group'   },
    { location: 'Location 5',      dayOffset: 3, startHour: 10.5, endHour: 12,   name: 'Review'        },
  ];

  // Row height per hour in px
  const ROW_H = 40;

  // Events for a given location + day visible in the current hour range
  function eventsForCell(locationName, dayIndex) {
    const visStart = HOURS[startIndex];
    const visEnd   = HOURS[endIndex] + 1;
    return bookedEvents.filter(ev =>
      ev.location === locationName &&
      ev.dayOffset === dayIndex    &&
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
    const dow    = new Date().getDay();
    const events = bookedEvents.filter(e => e.location === locationName && e.dayOffset === dow);
    if (!events.length) return 'free';
    const hours  = events.reduce((s, e) => s + (e.endHour - e.startHour), 0);
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

      <!-- Row header (always visible, click to toggle) -->
      <div class="result-row">
        <button
          class="row-toggle"
          onclick={() => toggleRow(ri)}
          aria-expanded={isOpen}
          aria-controls="weekly-grid-{ri}"
        >
          <!-- Chevron -->
          <span class="chevron" class:open={isOpen} aria-hidden="true">›</span>

          <!-- Favorite star -->
          <span
            class="star"
            class:filled={result.favorite}
            aria-label={result.favorite ? 'Favorited' : 'Not favorited'}
          >{result.favorite ? '★' : '☆'}</span>

          <!-- Blue dot + name -->
          <span class="loc-dot" aria-hidden="true"></span>
          <span class="row-name">{result.name}</span>

          <!-- Availability badge -->
          <span class="avail-badge avail-{status}">
            {#if status === 'free'}● Free today{/if}
            {#if status === 'partial'}◑ Partial{/if}
            {#if status === 'busy'}● Busy today{/if}
          </span>
        </button>

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
              aria-hidden="true"
            >
              {#each visibleDays as day, di}
                {@const col_events = eventsForCell(result.name, day.date.getDay())}
                <div
                  class="day-col-overlay"
                  style="left:calc(72px + {di} * var(--col-w)); width:var(--col-w);"
                >
                  {#each col_events as ev}
                    <div
                      class="event-block"
                      style={blockStyle(ev)}
                      title="{ev.name} ({hourLabel(Math.floor(ev.startHour))}–{hourLabel(Math.ceil(ev.endHour))})"
                    >
                      <span class="event-accent"></span>
                      <span class="event-label">{ev.name}</span>
                    </div>
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
    background: #2f6fed;
    border-radius: 3px;
  }
  .slider-thumb {
    position: absolute;
    top: 20px;
    width: 18px; height: 18px;
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
  .legend-swatch.booked    { background: rgba(22,163,74,.22); border-left: 3px solid #16a34a; }
  .legend-swatch.available { background: #f1f5f9; border: 1px solid #e3e3e6; }
  .legend-today-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #e00122;
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
  .row-toggle[aria-expanded="true"] {
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
  .star.filled { color: #e00122; }

  /* Blue dot */
  .loc-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #2f6fed;
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
  .avail-free    { background: #dcfce7; color: #16a34a; }
  .avail-partial { background: #fef9c3; color: #854d0e; }
  .avail-busy    { background: #fee2e2; color: #b91c1c; }

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
  .day-header.today   { color: #e00122; }
  .day-header.weekend { background: #fafafa; color: #94a3b8; }

  .today-pip {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #e00122;
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
  .hour-label.pm { color: #2f6fed; }

  .grid-cell {
    border-top: 1px solid #e3e3e6;
    border-left: 1px solid #e3e3e6;
    background: #fff;
    min-height: var(--row-h);
  }
  .grid-cell.today { background: #fffbfb; }

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
    background: rgba(22,163,74,0.18);
    border-radius: 5px;
    overflow: hidden;
    pointer-events: auto;
    cursor: default;
    transition: background 0.1s;
  }
  .event-block:hover { background: rgba(22,163,74,0.30); }

  .event-accent {
    display: block;
    width: 4px; min-width: 4px;
    background: #16a34a;
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
