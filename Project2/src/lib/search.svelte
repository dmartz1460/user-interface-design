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
  // Location filters (Spaces, Features, Layouts, Capacity)
  let locationFilters = $state([
    {
      name: 'Buildings',   mode: 'checkbox', open: false,
      options: [
        { label: 'Langsam',           value: 'langsam',          checked: false },
        { label: 'Braunstein Hall',   value: 'braunstein hall',  checked: false },
        { label: 'Aronoff',           value: 'aronoff',          checked: false },
        { label: 'Old Chem',          value: 'old chem',         checked: false },
        { label: 'Lindner Hall',      value: 'lindner hall',     checked: false },
        { label: '60 West Charlton',  value: '60 west charlton', checked: false },
        { label: 'Tangeman',          value: 'tangeman',         checked: false },
        { label: 'Math Sciences',     value: 'math sciences',    checked: false },
      ],
    },
    {
      name: 'Features', mode: 'checkbox', open: false,
      options: [
        { label: 'Projector',              value: 'projector',        checked: false },
        { label: 'Whiteboard',             value: 'white board',      checked: false },
        { label: 'A/V Camera',             value: 'camera',           checked: false },
        { label: 'Tables and Chairs',      value: 'tables and chairs', checked: false },
      ],
    },
    {
      name: 'Layouts',  mode: 'checkbox', open: false,
      options: [
        { label: 'Classroom', value: 'classroom', checked: false },
        { label: 'Lecture',   value: 'lecture',   checked: false },
        { label: 'Seminar',   value: 'seminar',   checked: false },
      ],
    },
    {
      name: 'Capacity', mode: 'range', open: false,
    },
  ]);

  // Events filters
  let eventFilters = $state([
    {
      name: 'Organizations', mode: 'search', open: false,
      options: [
        { label: 'Euchre Club',      value: 'euchre club',    checked: false },
        { label: 'IEEE',             value: 'ieee',           checked: false },
        { label: 'Chess Club',       value: 'chess club',     checked: false },
        { label: 'Star Wars Club',   value: 'star wars club', checked: false },
      ],
    },
    {
      name: 'Types', mode: 'checkbox', open: false,
      options: [
        { label: 'Class',        value: 'class',        checked: false },
        { label: 'Organization', value: 'organization', checked: false },
      ],
    },
  ]);

  // Organizations filters
  let orgFilters = $state([
    {
      name: 'Types', mode: 'checkbox', open: false,
      options: [
        { label: 'Internal', value: 'internal', checked: false },
        { label: 'External', value: 'external', checked: false },
      ],
    },
    {
      name: 'Categories', mode: 'checkbox', open: false,
      options: [
        { label: 'Clubs', value: 'clubs', checked: false },
        { label: 'CEAS',  value: 'ceas',  checked: false },
      ],
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
      const hasMin = capacityMin !== '';
      const hasMax = capacityMax !== '';
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
    capacityMin:    capacityMin !== '' ? Number(capacityMin) : null,
    capacityMax:    capacityMax !== '' ? Number(capacityMax) : null,
    organizations:  eventFilters[0].options.filter(o => o.checked).map(o => o.value),
    eventTypes:     eventFilters[1].options.filter(o => o.checked).map(o => o.value),
    orgTypes:       orgFilters[0].options.filter(o => o.checked).map(o => o.value),
    categories:     orgFilters[1].options.filter(o => o.checked).map(o => o.value),
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
  // Rich dataset covering all filter dimensions so every filter can be tested:
  //   Locations  → building, features, layouts, capacity (range)
  //   Events     → organization (search/multi-select), eventType (class | organization)
  //   Organizations → orgType (internal | external), category (clubs | ceas)
  let searchResults = $state([

    // ── Locations ─────────────────────────────────────────────────────────
    {
      name: 'Langsam 520',       formal_name: 'Langsam Library 520',
      building: 'langsam',       features: 'projector',          layouts: 'classroom',
      capacity: 30,              favorite: true,                  type: 'location',
    },
    {
      name: 'Langsam 220',       formal_name: 'Langsam Library 220',
      building: 'langsam',       features: 'white board',         layouts: 'seminar',
      capacity: 18,              favorite: false,                 type: 'location',
    },
    {
      name: 'Braunstein 140A',   formal_name: 'Braunstein Hall 140A',
      building: 'braunstein hall', features: 'white board',      layouts: 'seminar',
      capacity: 20,              favorite: false,                 type: 'location',
    },
    {
      name: 'Braunstein 310',    formal_name: 'Braunstein Hall 310',
      building: 'braunstein hall', features: 'camera',           layouts: 'classroom',
      capacity: 45,              favorite: false,                 type: 'location',
    },
    {
      name: 'Aronoff 6480A',     formal_name: 'Aronoff Center 6480A',
      building: 'aronoff',       features: 'camera',              layouts: 'lecture',
      capacity: 80,              favorite: true,                  type: 'location',
    },
    {
      name: 'Aronoff 1220',      formal_name: 'Aronoff Center 1220',
      building: 'aronoff',       features: 'tables and chairs',   layouts: 'seminar',
      capacity: 35,              favorite: false,                 type: 'location',
    },
    {
      name: 'Old Chem 400',      formal_name: 'Old Chemistry 400',
      building: 'old chem',      features: 'projector',           layouts: 'lecture',
      capacity: 150,             favorite: false,                 type: 'location',
    },
    {
      name: 'Old Chem 112',      formal_name: 'Old Chemistry 112',
      building: 'old chem',      features: 'white board',         layouts: 'seminar',
      capacity: 24,              favorite: false,                 type: 'location',
    },
    {
      name: '60 WC Room A',      formal_name: '60 West Charlton Room A',
      building: '60 west charlton', features: 'tables and chairs', layouts: 'classroom',
      capacity: 40,              favorite: false,                 type: 'location',
    },
    {
      name: 'TUC Cinema',        formal_name: 'Tangeman Cinema Hall',
      building: 'tangeman',      features: 'projector',           layouts: 'lecture',
      capacity: 200,             favorite: false,                 type: 'location',
    },
    {
      name: 'TUC Great Hall',    formal_name: 'Tangeman Great Hall',
      building: 'tangeman',      features: 'tables and chairs',   layouts: 'lecture',
      capacity: 500,             favorite: false,                 type: 'location',
    },
    {
      name: 'Lindner 110',       formal_name: 'Lindner Hall 110',
      building: 'lindner hall',  features: 'camera',              layouts: 'lecture',
      capacity: 90,              favorite: true,                  type: 'location',
    },
    {
      name: 'Lindner 215',       formal_name: 'Lindner Hall 215',
      building: 'lindner hall',  features: 'projector',           layouts: 'classroom',
      capacity: 55,              favorite: false,                 type: 'location',
    },
    {
      name: 'Math 1061',         formal_name: 'Math Sciences 1061',
      building: 'math sciences', features: 'projector',           layouts: 'lecture',
      capacity: 120,             favorite: false,                 type: 'location',
    },

    // ── Events ────────────────────────────────────────────────────────────
    {
      name: 'Euchre Club at UC',    formal_name: 'Weekly Euchre Club Meeting',
      organization: 'euchre club',  category: 'social',   eventType: 'organization',
      date: 'Mon Nov 18 2026',      favorite: false,      type: 'event',
    },
    {
      name: 'Calculus Review',      formal_name: 'Math 1061 Review Session',
      organization: 'ieee',         category: 'academic', eventType: 'class',
      date: 'Tue Nov 19 2026',      favorite: true,       type: 'event',
    },
    {
      name: 'Chess Club Meet',      formal_name: 'UC Chess Club Weekly Meeting',
      organization: 'chess club',   category: 'social',   eventType: 'organization',
      date: 'Wed Nov 20 2026',      favorite: false,      type: 'event',
    },
    {
      name: 'Dance Team Practice',  formal_name: 'UC Dance Team Rehearsal',
      organization: 'chess club',   category: 'arts',     eventType: 'organization',
      date: 'Thu Nov 21 2026',      favorite: false,      type: 'event',
    },
    {
      name: 'Star Wars Film Night',  formal_name: 'Star Wars Club Screening',
      organization: 'star wars club', category: 'social', eventType: 'organization',
      date: 'Fri Nov 22 2026',       favorite: false,     type: 'event',
    },
    {
      name: 'IEEE Workshop',         formal_name: 'IEEE Intro to PCB Design',
      organization: 'ieee',          category: 'academic', eventType: 'organization',
      date: 'Sat Nov 23 2026',       favorite: false,      type: 'event',
    },
    {
      name: 'Intro to Circuits',     formal_name: 'EECE 2070 Lab Section',
      organization: 'ieee',          category: 'academic', eventType: 'class',
      date: 'Mon Nov 18 2026',       favorite: false,      type: 'event',
    },
    {
      name: 'Linear Algebra Lecture', formal_name: 'MATH 2076 Lecture',
      organization: 'euchre club',    category: 'academic', eventType: 'class',
      date: 'Tue Nov 19 2026',        favorite: false,      type: 'event',
    },

    // ── Organizations ─────────────────────────────────────────────────────
    {
      name: 'Chess Club',      formal_name: 'UC Chess Club',
      orgType: 'internal',     category: 'clubs',    status: 'active',
      favorite: false,         type: 'org',
    },
    {
      name: 'Dance Team',      formal_name: 'UC Dance Team',
      orgType: 'internal',     category: 'clubs',    status: 'active',
      favorite: false,         type: 'org',
    },
    {
      name: 'Math Society',    formal_name: 'Math Academic Society',
      orgType: 'internal',     category: 'ceas',     status: 'active',
      favorite: true,          type: 'org',
    },
    {
      name: 'IEEE UC Chapter', formal_name: 'Institute of Electrical & Electronics Engineers — UC',
      orgType: 'external',     category: 'ceas',     status: 'active',
      favorite: false,         type: 'org',
    },
    {
      name: 'Euchre Club',     formal_name: 'UC Euchre Club',
      orgType: 'internal',     category: 'clubs',    status: 'active',
      favorite: false,         type: 'org',
    },
    {
      name: 'Star Wars Club',  formal_name: 'UC Star Wars Appreciation Society',
      orgType: 'internal',     category: 'clubs',    status: 'pending',
      favorite: false,         type: 'org',
    },
    {
      name: 'Cincinnati ACM',  formal_name: 'ACM Student Chapter Cincinnati',
      orgType: 'external',     category: 'ceas',     status: 'active',
      favorite: false,         type: 'org',
    },
    {
      name: 'Campus Ministry', formal_name: 'UC Campus Ministry',
      orgType: 'internal',     category: 'clubs',    status: 'inactive',
      favorite: false,         type: 'org',
    },
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
                    ? (capacityMin !== '' || capacityMax !== '')
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
