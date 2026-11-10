<script>
  import Results from './results.svelte';

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

  // ── Search query ──
  // Bound to the <input> via `bind:value`. Every keystroke updates this,
  // which reactively filters `filteredRecents` below.
  let searchQuery = $state('');

  // ── Placeholder ──
  // Derived from activeCategory so the input hint always matches the tab.
  let placeholder = $derived(
    activeCategory === 'history' ? 'Search history' : `Search ${activeCategory}`
  );

  // ── Filter definitions ──
  // Each filter group has a name, a mode ('checkbox' or 'radio'), and its
  // options. The `checked` field on each option is reactive state that the
  // checkboxes/radios bind to directly.
  let filters = $state([
    {
      name: 'Spaces',   mode: 'checkbox', open: false,
      options: [
        { label: 'Single space',    value: 'single',   checked: true },
        { label: 'Multiple spaces', value: 'multiple',  checked: true },
      ],
    },
    {
      name: 'Features', mode: 'checkbox', open: false,
      options: [
        { label: 'Projector',  value: 'projector',  checked: false },
        { label: 'Whiteboard', value: 'whiteboard', checked: false },
        { label: 'Zoom',       value: 'zoom',       checked: false },
      ],
    },
    {
      name: 'Layouts',  mode: 'checkbox', open: false,
      options: [
        { label: 'Classroom', value: 'classroom', checked: false },
        { label: 'Lecture',   value: 'lecture',    checked: false },
        { label: 'Seminar',   value: 'seminar',   checked: false },
      ],
    },
    {
      name: 'Capacity', mode: 'radio',    open: false,
      options: [
        { label: '10', value: '10', checked: false },
        { label: '25', value: '25', checked: false },
        { label: '50', value: '50', checked: false },
      ],
    },
  ]);

  // ── chipLabel(filter) ──
  // Builds the text shown on each filter chip. For Capacity (radio) it
  // shows the selected value; for checkboxes it shows the count.
  // Called inline in the {#each filters} template block.
  function chipLabel(filter) {
    const selected = filter.options.filter(o => o.checked);
    if (!selected.length) return `${filter.name} +`;
    if (filter.name === 'Capacity') return `${filter.name}: ${selected[0].value}`;
    return `${filter.name}: ${selected.length}`;
  }

  // ── toggleMenu(index) ──
  // Opens one filter dropdown and closes the rest. Bound to each <summary>
  // click so only one dropdown is open at a time.
  function toggleMenu(index) {
    filters = filters.map((f, i) => ({ ...f, open: i === index ? !f.open : false }));
  }

  // ── clearFilters() ──
  // Unchecks every option across all filter groups and closes dropdowns.
  // Bound to the "Clear" button in the filter bar.
  function clearFilters() {
    filters = filters.map(f => ({
      ...f,
      open: false,
      options: f.options.map(o => ({ ...o, checked: false })),
    }));
  }

  // ── selectRadio(filterIndex, optionIndex) ──
  // For radio-mode filters, ensures only one option is checked at a time.
  // Bound to onclick on radio inputs inside the Capacity filter.
  function selectRadio(filterIndex, optionIndex) {
    filters[filterIndex].options = filters[filterIndex].options.map((o, i) => ({
      ...o,
      checked: i === optionIndex,
    }));
  }

  // ── Active filter values ──
  // Derived object that summarizes current filter selections. This is
  // passed down to the <Results> child component so it knows what filters
  // are applied without reaching back up into this component.
  let activeFilters = $derived({
    spaces:   filters[0].options.filter(o => o.checked).map(o => o.value),
    features: filters[1].options.filter(o => o.checked).map(o => o.value),
    layouts:  filters[2].options.filter(o => o.checked).map(o => o.value),
    capacity: filters[3].options.find(o => o.checked)?.value ?? null,
  });

  // ── Recent-search history ──
  // Static sample data. The `typeLabels` map is used when rendering badges.
  const recentItems = [
    { name: 'Langsam 520',        type: 'location' },
    { name: 'Euchre Club at UC',  type: 'org' },
    { name: 'Math 1061',          type: 'event' },
    { name: 'The Meaning of Life',type: 'event' },
    { name: 'Langsam 620',        type: 'location' },
    { name: 'Aronoff 6480A',      type: 'location' },
    { name: 'Chess Club',         type: 'org' },
    { name: 'Calculus review',    type: 'event' },
    { name: 'Braunstein 140A',    type: 'location' },
    { name: 'Dance Team',         type: 'org' },
  ];
  const typeLabels = { location: 'Location', event: 'Event', org: 'Organization' };

  // ── History type filter ──
  // Tracks which type filter pill is active in the History tab.
  let historyType = $state('all');

  // ── filteredRecents ──
  // Derived list that filters `recentItems` by both the active type pill
  // and the search query. This powers the history list in the template.
  let filteredRecents = $derived(
    recentItems.filter(item =>
      (historyType === 'all' || item.type === historyType) &&
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
  );

  // ── Search results (sample data) ──
  // This is the master list passed down to <Results>. In a real app you
  // would fetch this from an API based on `searchQuery` and `activeFilters`.
  let searchResults = $state([
    { name: 'Event 1', formal_name: 'event 1', spaces: 'Type A', features: 'table', layouts: 'Layout 1', capacity: 100, favorite: true,  type: 'location' },
    { name: 'Event 2', formal_name: 'event 1', spaces: 'Type B', features: 'chair', layouts: 'Layout 2', capacity: 50,  favorite: false, type: 'location' },
    { name: 'Event 3', formal_name: 'event 1', spaces: 'Type A', features: 'table', layouts: 'Layout 1', capacity: 100, favorite: true,  type: 'location' },
    { name: 'Event 4', formal_name: 'event 1', spaces: 'Type C', features: 'stage', layouts: 'Layout 3', capacity: 200, favorite: false, type: 'location' },
    { name: 'Event 5', formal_name: 'event 1', spaces: 'Type B', features: 'chair', layouts: 'Layout 2', capacity: 50,  favorite: true,  type: 'location' },
  ]);
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

      <!-- ── Location filters ──
           Only shown when the "locations" tab is active.
           Each filter group renders as a <details>-like chip that toggles
           its dropdown. Checkbox/radio inputs bind to option.checked. -->
      {#if activeCategory === 'locations'}
        <div class="location-filters" aria-label="Location filters">
          {#each filters as filter, fi}
            <div class="filter-menu" class:is-open={filter.open}>
              <button
                class="filter-chip"
                class:has-selection={filter.options.some(o => o.checked)}
                type="button"
                onclick={() => toggleMenu(fi)}
              >
                <span>{chipLabel(filter)}</span>
              </button>

              {#if filter.open}
                <fieldset>
                  {#each filter.options as option, oi}
                    <label>
                      {#if filter.mode === 'radio'}
                        <input
                          type="radio"
                          name={filter.name}
                          checked={option.checked}
                          onclick={() => selectRadio(fi, oi)}
                        >
                      {:else}
                        <input type="checkbox" bind:checked={option.checked}>
                      {/if}
                      {option.label}
                    </label>
                  {/each}
                </fieldset>
              {/if}
            </div>
          {/each}
          <button class="clear-filters" type="button" onclick={clearFilters}>Clear</button>
        </div>
      {/if}

      <!-- ── History panel ──
           Only shown when the "history" tab is active.
           Type-filter pills set `historyType`, which drives `filteredRecents`. -->
      {#if activeCategory === 'history'}
        <section class="search-history" aria-labelledby="history-title">
          <h1 id="history-title">History</h1>
          <p>Your 10 latest searches</p>

          <div class="recent-browser">
            <div class="recent-filters" role="group" aria-label="Recent search types">
              {#each [
                { type: 'all',      label: 'All',       dot: null },
                { type: 'location', label: 'Locations',  dot: 'dot-location' },
                { type: 'event',    label: 'Events',     dot: 'dot-event' },
                { type: 'org',      label: 'Orgs',       dot: 'dot-org' },
              ] as pill}
                <button
                  class="recent-filter"
                  class:is-selected={historyType === pill.type}
                  type="button"
                  aria-pressed={historyType === pill.type}
                  onclick={() => historyType = pill.type}
                >
                  {#if pill.dot}<span class="dot {pill.dot}" aria-hidden="true"></span>{/if}
                  {pill.label}
                </button>
              {/each}
            </div>

            <div class="recent-table-heading" aria-hidden="true">
              <span>Name</span><span>Type</span>
            </div>

            <div class="recent-list" tabindex="0" aria-label="Recent searches">
              {#if filteredRecents.length === 0}
                <p class="empty-recents">No matching recent searches.</p>
              {:else}
                <ul>
                  {#each filteredRecents as item}
                    <li>
                      <span class="recent-name">
                        <span class="dot dot-{item.type}" aria-hidden="true"></span>
                        {item.name}
                      </span>
                      <span class="badge badge-{item.type}">{typeLabels[item.type]}</span>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          </div>
        </section>
      {/if}
    </div>
  </div>
</section>

<!-- ── Child component ──
     Passes the full search results array, the derived filter summary,
     the active category, and the search query down to Results. -->
<Results
  {searchResults}
  {activeFilters}
  {activeCategory}
  {searchQuery}
/>

<style>
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
    padding: 88px 40px 40px;
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
    bottom: -1px;
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

  /* ── History section ── */
  .search-history {
    margin: 24px -24px -24px;
  }

  .search-history h1 {
    margin: 0 28px;
    font-size: 20px;
  }

  .search-history > p {
    margin: 6px 28px 20px;
    color: #64748b;
    font-size: 13px;
  }

  .recent-browser {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .recent-filters {
    display: flex;
    gap: 8px;
    padding: 0 28px 12px;
  }

  .recent-filter {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1px solid #e3e3e6;
    border-radius: 18px;
    background: transparent;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }

  .recent-filter.is-selected {
    background: #2f6fed;
    color: #fff;
    border-color: #2f6fed;
  }

  .recent-table-heading {
    display: flex;
    justify-content: space-between;
    padding: 8px 28px;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
    border-bottom: 1px solid #e3e3e6;
  }

  .recent-list {
    padding: 0 28px;
  }

  .recent-list ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .recent-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f2;
  }

  .recent-name {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 10px;
  }

  .badge-location { background: #dbeafe; color: #1e40af; }
  .badge-event    { background: #dcfce7; color: #166534; }
  .badge-org      { background: #fef9c3; color: #854d0e; }

  .empty-recents {
    padding: 20px 0;
    color: #64748b;
    text-align: center;
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
</style>
