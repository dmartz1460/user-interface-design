<script>
  import List from './list.svelte';
  import Daily from './daily.svelte';
  import Weekly from './weekly.svelte';

  // ── Props from parent Search component ──
  // searchResults:  the full array of result objects
  // activeFilters:  { spaces, features, layouts, capacity, dateRange, category, status, orgType, orgStatus }
  // activeCategory: which search tab is active ('locations', 'events', 'organizations', 'history')
  // searchQuery:    the current text in the search input
  let {
    searchResults = [],
    activeFilters = { spaces: [], features: [], layouts: [], capacity: null },
    activeCategory = 'locations',
    searchQuery = '',
  } = $props();

  let currentDate = $state(new Date());

  // ── Date formatting helpers ──
  // formatLongDate: full display like "Monday, Nov 10, 2026"
  function formatLongDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ── getWeekStart(d) ──
  // Returns the Sunday that starts the week containing date `d`.
  function getWeekStart(d) {
    const copy = new Date(d);
    copy.setDate(copy.getDate() - copy.getDay());
    return copy;
  }

  let date = $derived(formatLongDate(currentDate));
  let weekStart = $derived(getWeekStart(currentDate));
  let weekLabel = $derived(formatLongDate(weekStart));

  // ── Day/week navigation ──
  function prevDay()  { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1); }
  function nextDay()  { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1); }
  function prevWeek() { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7); }
  function nextWeek() { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7); }

    // ── View switcher ──
  let allViews = [
    { id: 'List',   icon: 'list' },
    { id: 'Daily',  icon: 'calendar-day' },
    { id: 'Weekly', icon: 'calendar-week' },
  ];

  let defaultView = [
    { id: 'List',   icon: 'list' },
  ];

  let availableViews = $derived(
    activeCategory ===  'locations' ? allViews : defaultView
  );

  // viewBy is state so the view buttons can reassign it.
  // An effect resets it to the first available view whenever the category changes
  // (which may remove Daily/Weekly from the available set).
  let viewBy = $state({ id: 'List', icon: 'list' });
  $effect(() => {
    // Re-read availableViews to track the dependency; reset to first view.
    const first = availableViews[0];
    if (!availableViews.some(v => v.id === viewBy?.id)) {
      viewBy = first;
    }
  });

  // ── Filtered results by category + search query + active filters ──
  let filteredResults = $derived(() => {
    // 1. Filter by category type
    const typeMap = { locations: 'location', events: 'event', organizations: 'org' };
    const targetType = typeMap[activeCategory];
    let results = targetType
      ? searchResults.filter(r => r.type === targetType)
      : searchResults;

    // 2. Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      results = results.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.formal_name && r.formal_name.toLowerCase().includes(q))
      );
    }

    // 3. Location-specific filters
    if (activeCategory === 'locations') {
      if (activeFilters.buildings?.length) {
        results = results.filter(r => activeFilters.buildings.some(b => r.name?.toLowerCase().includes(b)));
      }
      if (activeFilters.features?.length) {
        results = results.filter(r => activeFilters.features.includes(r.features));
      }
      if (activeFilters.layouts?.length) {
        results = results.filter(r => activeFilters.layouts.includes(r.layouts));
      }
      // Capacity range: capacityMin and capacityMax are numbers or null
      if (activeFilters.capacityMin != null) {
        results = results.filter(r => r.capacity >= activeFilters.capacityMin);
      }
      if (activeFilters.capacityMax != null) {
        results = results.filter(r => r.capacity <= activeFilters.capacityMax);
      }
    }

    // 4. Event-specific filters
    if (activeCategory === 'events') {
      if (activeFilters.eventTypes?.length) {
        results = results.filter(r => activeFilters.eventTypes.includes(r.category));
      }
      // Organizations filter: array of selected org values
      if (activeFilters.organizations?.length) {
        results = results.filter(r => activeFilters.organizations.includes(r.organization));
      }
    }

    // 5. Organization-specific filters
    if (activeCategory === 'organizations') {
      if (activeFilters.orgTypes?.length) {
        results = results.filter(r => activeFilters.orgTypes.includes(r.orgType));
      }
      if (activeFilters.categories?.length) {
        results = results.filter(r => activeFilters.categories.includes(r.category));
      }
    }

    return results;
  });

  // ── Pagination ──
  // Weekly view: 25 results/page. List and Daily: 50 results/page.
  let results_per_page = $derived(viewBy?.id === 'Weekly' ? 25 : 50);
  let current_page = $state(1);

  // Locations array for Weekly view (location-type results only)
  let locations = $derived(filteredResults().filter(r => r.type === 'location'));

  // Reset to page 1 whenever the filtered set changes
  $effect(() => {
    filteredResults();
    current_page = 1;
  });

  let totalPages = $derived(Math.max(1, Math.ceil(filteredResults().length / results_per_page)));
  let pagedResults = $derived(
    filteredResults().slice((current_page - 1) * results_per_page, current_page * results_per_page)
  );

  // Count pill label for each category
  const categoryLabels = {
    locations: 'locations',
    events: 'events',
    organizations: 'organizations',
    history: 'results',
  };
</script>

<section class="results-container">
  <div class="results-header">
    <div class="results">
      <p style="font-size: 22px; font-weight: bold;">Results</p>
      <p class="result-count" style="font-size: 14px; font-weight: normal;">
        {filteredResults().length} {categoryLabels[activeCategory] ?? activeCategory}
      </p>
    </div>

    <!-- Date navigator shown for Daily / Weekly views -->
    {#if viewBy.id === 'Daily'}
      <div class="date-header">
        <button class="date-nav-btn" onclick={prevDay} aria-label="Previous day">‹</button>
        <span class="date-pill">{date}</span>
        <button class="date-nav-btn" onclick={nextDay} aria-label="Next day">›</button>
      </div>
    {:else if viewBy.id === 'Weekly'}
      <div class="date-header">
        <span class="date-pill-label">Week of:</span>
        <button class="date-nav-btn" onclick={prevWeek} aria-label="Previous week">‹</button>
        <span class="date-pill">{weekLabel}</span>
        <button class="date-nav-btn" onclick={nextWeek} aria-label="Next week">›</button>
      </div>
    {/if}

    <div class="view-by">
      <p>View As:</p>
      <div class="{activeCategory === 'locations' ? 'all-view-buttons' : 'list-button'}">
        {#each availableViews as view}
          <button class:active={viewBy.id === view.id} onclick={() => viewBy = view}>
            {view.id}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="results-body">
    {#if viewBy.id === 'List'}
      <List search_results={pagedResults} {results_per_page} />
    {:else if viewBy.id === 'Daily'}
      <Daily search_results={pagedResults} {results_per_page} {date} />
    {:else if viewBy.id === 'Weekly'}
      <Weekly search_results={pagedResults} {results_per_page} {date} {locations} {weekStart} />
    {/if}
  </div>

  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="results-pagination">
      <button
        class="page-nav-btn"
        disabled={current_page === 1}
        onclick={() => { if (current_page > 1) current_page--; }}
        aria-label="Previous page"
      >«</button>

      {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
        <button
          class="page-btn"
          class:active={current_page === page}
          onclick={() => current_page = page}
          aria-current={current_page === page ? 'page' : undefined}
        >{page}</button>
      {/each}

      <button
        class="page-nav-btn"
        disabled={current_page === totalPages}
        onclick={() => { if (current_page < totalPages) current_page++; }}
        aria-label="Next page"
      >»</button>
    </div>
  {/if}
</section>

<style>
  .date-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .date-pill-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    margin-right: 2px;
  }

  .date-pill {
    padding: 5px 14px;
    background-color: #e00122;
    color: white;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  .date-nav-btn {
    background: #f1f5f9;
    border: 1px solid #e3e3e6;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    font-size: 16px;
    font-weight: 700;
    color: #334155;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .date-nav-btn:hover { background: #e2e8f0; }

  .results-container {
    display: flex;
    flex-direction: column;
    padding: 15px;
    border: 2px solid rgb(180, 206, 207);
    border-radius: 15px;
    margin: 10px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    gap: 12px;
  }

  .results-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .results-body {
    width: 100%;
  }

  .results {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .results p {
    margin: 0 10px;
    font-weight: bold;
  }

  .result-count {
    border: 1px solid rgb(180, 206, 207);
    border-radius: 15px;
    padding: 2px 10px;
    background-color: rgba(47, 111, 237, 0.12);
    color: #2f6fed;
    font-weight: 700;
  }

  .view-by {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .all-view-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-left: 10px;
    border: 2px solid rgb(180, 206, 207);
    border-radius: 5px;
    padding: 2px;
    background-color: rgb(212, 230, 226);
  }

  .list-button {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    border: 2px solid rgb(180, 206, 207);
    border-radius: 5px;
    padding: 2px;
    background-color: rgb(212, 230, 226);
  }

  .view-by button.active {
    background-color: #e00122;
    color: white;
    border: 1px solid black;
    border-radius: 5px;
  }

  .view-by button {
    background-color: rgb(212, 230, 226);
    color: black;
    margin: 2px;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 4px;
  }

  .view-by p {
    font-weight: bold;
    margin: 0;
  }

  /* ── Pagination ── */
  .results-pagination {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding-top: 8px;
  }

  .page-nav-btn {
    background: transparent;
    border: 1px solid #e3e3e6;
    border-radius: 6px;
    width: 32px;
    height: 32px;
    font-size: 15px;
    font-weight: 700;
    color: #334155;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .page-nav-btn:hover:not(:disabled) { background: #f1f5f9; }

  .page-btn {
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    background: transparent;
    border: 1px solid #e3e3e6;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
  }
  .page-btn:hover { background: #f1f5f9; }
  .page-btn.active {
    background: #e00122;
    color: white;
    border-color: #e00122;
  }
</style>
