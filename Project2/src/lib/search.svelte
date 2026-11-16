<script>
  import Results from './results.svelte';
  import EventDetails from './EventDetails.svelte';
  import { recentItems, favoriteItems, searchResults, filterOptions, searchItem, isFavorite, toggleFavorite, recordView, findEvent, cancelEvent } from './items.js';

  let { initialCategory = 'locations', initialQuery = '' } = $props();

  // ── Category tabs ──
  // Each tab has an id (used for logic), a label (displayed text), and a dot
  // color class. The `activeCategory` state tracks which tab is selected.
  const categories = [
    { id: 'locations',     label: 'Locations',     dot: 'dot-location' },
    { id: 'events',        label: 'Events',         dot: 'dot-event' },
    { id: 'organizations', label: 'Organizations',  dot: 'dot-org' },
    { id: 'history',       label: 'History',        dot: null },
  ];
  let activeCategory = $state('locations');
  $effect(() => {
    activeCategory = initialCategory;
  });

  // ── Search query ──
  // Bound to the <input> via `bind:value`. Every keystroke updates this,
  // which reactively filters `filteredRecents` below.
  let searchQuery = $state('');
  $effect(() => {
    searchQuery = initialQuery;
  });

  // ── Placeholder ──
  // Derived from activeCategory so the input hint always matches the tab.
  let placeholder = $derived(
    activeCategory === 'history' ? 'Search history' : `Search ${activeCategory}`
  );

  // ── Filter definitions ──
  // Location filters (Spaces, Features, Layouts, Capacity)
  const options = (values) => values.map((value) => ({ label: value, value, checked: false }));
  let locationFilters = $state([
    {
      name: 'Buildings',   mode: 'checkbox', open: false,
      options: options(filterOptions.locations.buildings),
    },
    {
      name: 'Features', mode: 'checkbox', open: false,
      options: options(filterOptions.locations.features),
    },
    {
      name: 'Layouts',  mode: 'checkbox', open: false,
      options: options(filterOptions.locations.layouts),
    },
    {
      name: 'Capacity', mode: 'range', open: false,
    },
  ]);

  // Events filters
  let eventFilters = $state([
    {
      name: 'Organizations', mode: 'search', open: false,
      options: options(filterOptions.events.organizations),
    },
    {
      name: 'Types', mode: 'checkbox', open: false,
      options: options(filterOptions.events.types),
    },
  ]);

  // Organizations filters
  let orgFilters = $state([
    {
      name: 'Types', mode: 'checkbox', open: false,
      options: options(filterOptions.organizations.types),
    },
    {
      name: 'Categories', mode: 'checkbox', open: false,
      options: options(filterOptions.organizations.categories),
    },
  ]);

  // Active filter set for current category
  let filters = $derived(
    activeCategory === 'locations'     ? locationFilters :
    activeCategory === 'events'        ? eventFilters :
    activeCategory === 'organizations' ? orgFilters :
    []
  );

  // ── Capacity range state (for the 'range' mode filter) ──
  let capacityMin = $state('');
  let capacityMax = $state('');

  // ── Org search query state (for the 'search' mode filter under Events) ──
  let orgSearchQuery = $state('');

  // ── chipLabel(filter) ──
  // Builds the text shown on each filter chip based on its mode.
  function chipLabel(filter) {
    if (filter.mode === 'range') {
      const hasMin = capacityMin != null && capacityMin !== '';
      const hasMax = capacityMax != null && capacityMax !== '';
      if (!hasMin && !hasMax) return `${filter.name} +`;
      if (hasMin && hasMax)   return `${filter.name}: ${capacityMin}–${capacityMax}`;
      if (hasMin)             return `${filter.name}: ≥${capacityMin}`;
      return                         `${filter.name}: ≤${capacityMax}`;
    }
    if (filter.mode === 'search') {
      const selected = filter.options.filter(o => o.checked);
      if (!selected.length) return `${filter.name} +`;
      return `${filter.name}: ${selected.length}`;
    }
    // checkbox
    const selected = filter.options.filter(o => o.checked);
    if (!selected.length) return `${filter.name} +`;
    return `${filter.name}: ${selected.length}`;
  }

  // ── toggleMenu(index) ──
  // Opens one filter dropdown and closes the rest.
  function toggleMenu(index) {
    const src =
      activeCategory === 'locations'     ? locationFilters :
      activeCategory === 'events'        ? eventFilters :
      activeCategory === 'organizations' ? orgFilters : [];
    const updated = src.map((f, i) => ({ ...f, open: i === index ? !f.open : false }));
    if (activeCategory === 'locations')          locationFilters = updated;
    else if (activeCategory === 'events')        eventFilters    = updated;
    else if (activeCategory === 'organizations') orgFilters      = updated;
    // Reset org search box when closing
    if (!updated[index]?.open) orgSearchQuery = '';
  }

  // ── clearFilters() ──
  // Resets all filter groups and clears range / search state.
  function clearFilters() {
    const reset = (arr) => arr.map(f => ({
      ...f,
      open: false,
      options: f.options ? f.options.map(o => ({ ...o, checked: false })) : f.options,
    }));
    locationFilters = reset(locationFilters);
    eventFilters    = reset(eventFilters);
    orgFilters      = reset(orgFilters);
    capacityMin     = '';
    capacityMax     = '';
    orgSearchQuery  = '';
  }

  // ── filteredOrgOptions ──
  // The org search filter's option list, narrowed by the in-dropdown search box.
  let filteredOrgOptions = $derived(() => {
    const q = orgSearchQuery.trim().toLowerCase();
    const orgFilter = eventFilters[0]; // first event filter is 'Organizations'
    if (!q) return orgFilter.options;
    return orgFilter.options.filter(o => o.label.toLowerCase().includes(q));
  });

  // ── Active filter values ──
  // Derived object summarizing current filter selections, passed to <Results>.
  let activeFilters = $derived({
    buildings:      locationFilters[0].options.filter(o => o.checked).map(o => o.value),
    features:       locationFilters[1].options.filter(o => o.checked).map(o => o.value),
    layouts:        locationFilters[2].options.filter(o => o.checked).map(o => o.value),
    capacityMin:    capacityMin != null && capacityMin !== '' ? Number(capacityMin) : null,
    capacityMax:    capacityMax != null && capacityMax !== '' ? Number(capacityMax) : null,
    organizations:  eventFilters[0].options.filter(o => o.checked).map(o => o.value),
    eventTypes:     eventFilters[1].options.filter(o => o.checked).map(o => o.value),
    orgTypes:       orgFilters[0].options.filter(o => o.checked).map(o => o.value),
    categories:     orgFilters[1].options.filter(o => o.checked).map(o => o.value),
  });

  const typeClasses = { Location: 'location', Event: 'event', Organization: 'org' };
  let selectedItem = $state.raw(null);
  let selectedEvent = $state.raw(null);
  let selectedOwned = $state(false);

  function openItem(item) {
    selectedItem = item;
    selectedEvent = findEvent(item);
    selectedOwned = !!selectedEvent?.owned;
    recordView(item);
  }

  function openResult(result) {
    openItem(searchItem(result));
  }

  function toggleResultFavorite(result) {
    toggleFavorite(searchItem(result));
  }

  // ── History type filter ──
  // Tracks which type filter pill is active in the History tab.
  let historyType = $state('all');

  // ── filteredRecents ──
  // Derived list that filters `recentItems` by both the active type pill
  // and the search query. This powers the history list in the template.
  let filteredRecents = $derived(
    $recentItems.filter(item =>
      (historyType === 'all' || typeClasses[item.type] === historyType) &&
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
  );

</script>

<section class="search-preview">
  <div class="search-card" aria-label="Search">

    <!-- ── Tab navigation ──
         Each button calls a simple assignment to `activeCategory`.
         The `class:is-active` directive and `aria-current` toggle based
         on whether this tab matches the active category. -->
    <nav class="search-tabs" aria-label="Search categories">
      {#each categories as cat}
        <button
          class="search-tab"
          class:is-active={activeCategory === cat.id}
          type="button"
          aria-current={activeCategory === cat.id ? 'page' : undefined}
          onclick={() => activeCategory = cat.id}
        >
          {#if cat.dot}<span class="dot {cat.dot}" aria-hidden="true"></span>{/if}
          {cat.label}
        </button>
      {/each}
    </nav>

    <div class="search-content">

      <!-- ── Search input ──
           Bound to `searchQuery` with bind:value so typing instantly
           updates filteredRecents and can be read by any derived state. -->
      <label class="search-input">
        <span class="search-icon" aria-hidden="true"></span>
        <input
          type="search"
          aria-label={placeholder}
          placeholder={placeholder}
          bind:value={searchQuery}
        >
      </label>

      <!-- ── Category filters ──
           Shown for locations, events, and organizations tabs.
           Each filter chip toggles a dropdown. The dropdown content varies
           by filter.mode: 'checkbox', 'range', or 'search'. -->
      {#if activeCategory === 'locations' || activeCategory === 'events' || activeCategory === 'organizations'}
        <div class="location-filters" aria-label="{activeCategory} filters">
          {#each filters as filter, fi}
            <div class="filter-menu" class:is-open={filter.open}>

              <!-- Chip button — label adapts per mode -->
              <button
                class="filter-chip"
                class:has-selection={
                  filter.mode === 'range'
                    ? (activeFilters.capacityMin != null || activeFilters.capacityMax != null)
                    : filter.mode === 'search'
                      ? filter.options.some(o => o.checked)
                      : filter.options.some(o => o.checked)
                }
                type="button"
                onclick={() => toggleMenu(fi)}
              >
                <span>{chipLabel(filter)}</span>
              </button>

              <!-- ── Dropdown panel ── -->
              {#if filter.open}

                <!-- RANGE mode: min / max number inputs (Capacity) -->
                {#if filter.mode === 'range'}
                  <div class="filter-panel filter-panel--range">
                    <legend class="panel-legend">{filter.name}</legend>
                    <div class="range-row">
                      <label class="range-label">
                        Min
                        <input
                          class="range-input"
                          type="number"
                          min="0"
                          placeholder="0"
                          bind:value={capacityMin}
                          aria-label="Minimum capacity"
                        />
                      </label>
                      <span class="range-dash">–</span>
                      <label class="range-label">
                        Max
                        <input
                          class="range-input"
                          type="number"
                          min="0"
                          placeholder="∞"
                          bind:value={capacityMax}
                          aria-label="Maximum capacity"
                        />
                      </label>
                    </div>
                    <button
                      class="range-clear"
                      type="button"
                      onclick={() => { capacityMin = ''; capacityMax = ''; }}
                    >Clear range</button>
                  </div>

                <!-- SEARCH mode: search box + selectable list (Organizations) -->
                {:else if filter.mode === 'search'}
                  <div class="filter-panel filter-panel--search">
                    <legend class="panel-legend">{filter.name}</legend>

                    <!-- Search input inside the dropdown -->
                    <div class="org-search-wrap">
                      <span class="org-search-icon" aria-hidden="true"></span>
                      <input
                        class="org-search-input"
                        type="search"
                        placeholder="Search {filter.name.toLowerCase()}…"
                        bind:value={orgSearchQuery}
                        aria-label="Search {filter.name}"
                      />
                    </div>

                    <!-- Filtered org list -->
                    <ul class="org-option-list" role="listbox" aria-multiselectable="true">
                      {#each filteredOrgOptions() as option}
                        <li role="option" aria-selected={option.checked}>
                          <label class="org-option-label">
                            <input type="checkbox" bind:checked={option.checked} />
                            {option.label}
                          </label>
                        </li>
                      {/each}
                      {#if filteredOrgOptions().length === 0}
                        <li class="org-no-results">No results found</li>
                      {/if}
                    </ul>

                    <!-- Selected tags -->
                    {#if filter.options.some(o => o.checked)}
                      <div class="org-selected-tags">
                        {#each filter.options.filter(o => o.checked) as sel}
                          <span class="org-tag">
                            {sel.label}
                            <button
                              class="org-tag-remove"
                              type="button"
                              aria-label="Remove {sel.label}"
                              onclick={() => sel.checked = false}
                            >×</button>
                          </span>
                        {/each}
                      </div>
                    {/if}
                  </div>

                <!-- CHECKBOX mode: standard checkbox list -->
                {:else}
                  <fieldset>
                    {#each filter.options as option}
                      <label>
                        <input type="checkbox" bind:checked={option.checked} />
                        {option.label}
                      </label>
                    {/each}
                  </fieldset>
                {/if}

              {/if}
            </div>
          {/each}
          <button class="clear-filters" type="button" onclick={clearFilters}>Clear</button>
        </div>
      {/if}

      {#if activeCategory === 'history'}
        <div class="location-filters history-filters" role="group" aria-label="Recent search types">
          {#each [
            { type: 'all',      label: 'All',       dot: null },
            { type: 'location', label: 'Locations', dot: 'dot-location' },
            { type: 'event',    label: 'Events',    dot: 'dot-event' },
            { type: 'org',      label: 'Orgs',      dot: 'dot-org' },
          ] as pill}
            <button
              class="filter-chip"
              class:has-selection={historyType === pill.type}
              type="button"
              aria-pressed={historyType === pill.type}
              onclick={() => historyType = pill.type}
            >
              {#if pill.dot}<span class="dot {pill.dot}" aria-hidden="true"></span>{/if}
              {pill.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- ── Child component ──
     Passes the full search results array, the derived filter summary,
     the active category, and the search query down to Results. -->
<Results
  searchResults={$searchResults}
  historyResults={filteredRecents}
  {activeFilters}
  {activeCategory}
  {searchQuery}
  onSelect={activeCategory === 'history' ? openItem : openResult}
  onToggleFavorite={toggleResultFavorite}
/>

{#if selectedItem}
  <EventDetails item={selectedItem} event={selectedEvent} owned={selectedOwned}
    isFavorite={isFavorite($favoriteItems, selectedItem)}
    onToggleFavorite={() => toggleFavorite(selectedItem)}
    onCancel={cancelEvent} onClose={() => selectedItem = null} />
{/if}

<style>
  .history-filters .filter-chip { gap: 6px; }
  /* ── Color dots (shared across tabs & history) ── */
  .dot {
    display: inline-block;
    flex: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .dot-location { background: #2f6fed; }
  .dot-event    { background: #16a34a; }
  .dot-org      { background: #facc15; }

  /* ── Outer wrapper ── */
  .search-preview {
    padding: 40px 40px 40px;
  }

  /* ── Card container ── */
  .search-card {
    max-width: 1200px;
    margin: 0 auto;
    border: 1px solid #e3e3e6;
    border-radius: 14px;
    background: #fff;
  }

  /* ── Tab bar ── */
  .search-tabs {
    display: flex;
    gap: 32px;
    padding: 0 24px;
    overflow-x: auto;
    border-bottom: 1px solid #e3e3e6;
    border-radius: 14px 14px 0 0;
  }

  .search-tab {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: none;
    min-height: 46px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #6b6b73;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
  }

  .search-tab.is-active {
    color: #1c1c1e;
    font-weight: 700;
  }

  .search-tab.is-active::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 4px;
    border-radius: 2px;
    background: #2f6fed;
    content: "";
  }

  /* ── Search input area ── */
  .search-content {
    padding: 17px 24px 24px;
  }

  .search-input {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 44px;
    padding: 0 16px;
    border: 1px solid #e3e3e6;
    border-radius: 10px;
  }

  .search-icon {
    position: relative;
    flex: none;
    width: 16px;
    height: 16px;
    border: 2px solid #6b6b73;
    border-radius: 50%;
  }

  .search-icon::after {
    position: absolute;
    width: 8px;
    height: 2px;
    right: -6px;
    bottom: -3px;
    transform: rotate(45deg);
    background: #6b6b73;
    content: "";
  }

  .search-input input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #1c1c1e;
    font-size: 14px;
    font-family: inherit;
  }

  .search-input input::placeholder {
    color: #6b6b73;
    opacity: 1;
  }

  .search-input:focus-within {
    outline: 2px solid #2f6fed;
    outline-offset: 2px;
  }

  /* ── Filter bar (locations tab) ── */
  .location-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 12px;
    margin-top: 12px;
  }

  .filter-menu {
    position: relative;
  }

  .filter-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    min-width: 100px;
    padding: 0 18px;
    border: 1px solid #e3e3e6;
    border-radius: 18px;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    transition: border-color 0.15s, background 0.15s;
  }

  .filter-chip.has-selection {
    background: #eef2fd;
    border-color: #2f6fed;
    color: #2f6fed;
  }

  .filter-menu fieldset {
    position: absolute;
    z-index: 1;
    top: 40px;
    left: 0;
    min-width: 190px;
    margin: 0;
    padding: 12px;
    border: 1px solid #e3e3e6;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
  }

  .filter-menu label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    font-size: 14px;
  }

  .clear-filters {
    min-height: 36px;
    padding: 0 12px;
    border: 0;
    background: transparent;
    color: #6b6b73;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .search-preview {
      padding: 24px 16px;
    }
    .search-tabs {
      gap: 24px;
    }
    .filter-menu fieldset {
      position: static;
      margin-top: 4px;
    }
  }

  /* ── Filter panel (shared card styles for range & search modes) ── */
  .filter-panel {
    position: absolute;
    z-index: 1;
    top: 40px;
    left: 0;
    min-width: 220px;
    background: #fff;
    border: 1px solid #e3e3e6;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
    padding: 14px 16px 12px;
  }

  .panel-legend {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6b6b73;
    margin-bottom: 10px;
  }

  /* ── Range mode (Capacity) ── */
  .filter-panel--range {}

  .range-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .range-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #334155;
  }

  .range-input {
    width: 72px;
    padding: 5px 8px;
    border: 1px solid #e3e3e6;
    border-radius: 6px;
    font-size: 13px;
    font-family: inherit;
    color: #1c1c1e;
    outline: none;
  }

  .range-input:focus {
    border-color: #2f6fed;
    outline: 2px solid rgba(47, 111, 237, 0.2);
  }

  .range-dash {
    font-size: 16px;
    color: #94a3b8;
    margin-top: 16px;
    flex: none;
  }

  .range-clear {
    display: block;
    margin-top: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: #6b6b73;
    padding: 0;
    font-family: inherit;
  }
  .range-clear:hover { color: #e00122; }

  /* ── Search mode (Organizations) ── */
  .filter-panel--search {
    min-width: 240px;
  }

  .org-search-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 10px;
    border: 1px solid #e3e3e6;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  .org-search-wrap:focus-within {
    border-color: #2f6fed;
    outline: 2px solid rgba(47, 111, 237, 0.2);
  }

  .org-search-icon {
    position: relative;
    flex: none;
    width: 13px;
    height: 13px;
    border: 2px solid #6b6b73;
    border-radius: 50%;
  }
  .org-search-icon::after {
    position: absolute;
    width: 6px;
    height: 2px;
    right: -5px;
    bottom: -3px;
    transform: rotate(45deg);
    background: #6b6b73;
    content: "";
  }

  .org-search-input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: 13px;
    font-family: inherit;
    color: #1c1c1e;
  }
  .org-search-input::placeholder { color: #94a3b8; }

  .org-option-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 180px;
    overflow-y: auto;
  }

  .org-option-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    font-size: 14px;
    cursor: pointer;
  }
  .org-option-label:hover { color: #2f6fed; }

  .org-no-results {
    color: #64748b;
    font-size: 13px;
    padding: 8px 0;
    text-align: center;
  }

  .org-selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px solid #f0f0f2;
    margin-top: 6px;
  }

  .org-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #eef2fd;
    color: #2f6fed;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .org-tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: #2f6fed;
    font-size: 14px;
    line-height: 1;
    padding: 0;
    font-family: inherit;
  }
  .org-tag-remove:hover { color: #e00122; }
</style>
