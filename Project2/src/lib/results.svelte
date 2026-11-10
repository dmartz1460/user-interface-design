<script>
  import List from './list.svelte';
  import Daily from './daily.svelte';
  import Weekly from './weekly.svelte';

  // ── Props from parent Search component ──
  // searchResults:  the full array of result objects
  // activeFilters:  { spaces, features, layouts, capacity } from the filter bar
  // activeCategory: which search tab is active ('locations', 'events', etc.)
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
  // formatShortDate: compact like "11/10"
  function formatLongDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ── getWeekStart(d) ──
  // Returns the Sunday that starts the week containing date `d`.
  // Used to label the Weekly view header.
  function getWeekStart(d) {
    const copy = new Date(d);
    copy.setDate(copy.getDate() - copy.getDay());
    return copy;
  }

  let date = $derived(formatLongDate(currentDate));
  let weekStart = $derived(getWeekStart(currentDate));
  let weekLabel = $derived(formatLongDate(weekStart));

  // ── Day/week navigation ──
  // Each function creates a new Date offset by ±1 day or ±7 days,
  // which re-derives `date` and `weekLabel` automatically.
  function prevDay()  { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1); }
  function nextDay()  { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1); }
  function prevWeek() { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7); }
  function nextWeek() { currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7); }

  // ── View switcher ──
  // `views` is the static list of view modes; `viewBy` tracks which is active.
  const views = [
    { id: 'List',   icon: 'list' },
    { id: 'Daily',  icon: 'calendar-day' },
    { id: 'Weekly', icon: 'calendar-week' },
  ];
  let viewBy = $state(views[0]);

  // ── Locations (used by Weekly view) ──
  let locations = $state([
    { name: 'Location 1', formal_name: 'location 1', spaces: 'Type A', features: 'table', layouts: 'Layout 1', capacity: 100, favorite: true,  type: 'location' },
    { name: 'Location 2', formal_name: 'location 1', spaces: 'Type B', features: 'chair', layouts: 'Layout 2', capacity: 50,  favorite: false, type: 'location' },
    { name: 'Location 3', formal_name: 'location 1', spaces: 'Type A', features: 'table', layouts: 'Layout 1', capacity: 100, favorite: true,  type: 'location' },
    { name: 'Location 4', formal_name: 'location 1', spaces: 'Type C', features: 'stage', layouts: 'Layout 3', capacity: 200, favorite: false, type: 'location' },
    { name: 'Location 5', formal_name: 'location 1', spaces: 'Type B', features: 'chair', layouts: 'Layout 2', capacity: 50,  favorite: true,  type: 'location' },
  ]);

  // ── Pagination ──
  let results_per_page = $state(1);
  let current_page = $state(1);
</script>

<section class="results-container">
  <div class="results-header">
    <div class="results">
      <p style="font-size: 22px; font-weight: bold;">Results</p>
      <p class="result-count" style="font-size: 14px; font-weight: normal;">
        {searchResults.length} {activeCategory}
      </p>
    </div>

    {#if viewBy.id === 'Daily'}
      <div class="date-header">
        <a href="#" onclick={(e) => { e.preventDefault(); prevDay(); }}>&laquo;</a>
        <p>{date}</p>
        <a href="#" onclick={(e) => { e.preventDefault(); nextDay(); }}>&raquo;</a>
      </div>
    {:else if viewBy.id === 'Weekly'}
      <div class="date-header">
        <p>Week of:</p>
        <a href="#" onclick={(e) => { e.preventDefault(); prevWeek(); }}>&laquo;</a>
        <p>{weekLabel}</p>
        <a href="#" onclick={(e) => { e.preventDefault(); nextWeek(); }}>&raquo;</a>
      </div>
    {/if}

    <div class="view-by">
      <p>View As:</p>
      <div class="view-by-buttons">
        {#each views as view}
          <button class:active={viewBy.id === view.id} onclick={() => viewBy = view}>
            <i class={view.icon}></i> {view.id}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="results-body">
    {#if viewBy.id === 'List'}
      <List search_results={searchResults} {results_per_page} />
    {:else if viewBy.id === 'Daily'}
      <Daily search_results={searchResults} {results_per_page} {date} />
    {:else if viewBy.id === 'Weekly'}
      <Weekly search_results={searchResults} {results_per_page} {date} {locations} {weekStart} />
    {/if}
  </div>

  <div class="results-pagination">
    <a href="#" onclick={(e) => { e.preventDefault(); current_page = Math.max(1, current_page - 1); }}>&laquo;</a>
    <p>{current_page}</p>
    <p>of</p>
    <p>{Math.ceil(searchResults.length / results_per_page)}</p>
    <a href="#" onclick={(e) => { e.preventDefault(); current_page = Math.min(Math.ceil(searchResults.length / results_per_page), current_page + 1); }}>&raquo;</a>
  </div>
</section>

<style>
  .date-header {
    display: flex;
    justify-content: left;
    flex-direction: row;
    align-items: center;
  }

  .date-header a {
    margin: 0 5px;
    text-decoration: none;
    color: black;
    font-weight: bold;
  }

  .date-header p {
    margin: 0 5px;
    border: 1px solid black;
    background-color: red;
    color: white;
    border-radius: 30px;
    padding: 8px 12px;
  }

  .results-container {
    display: flex;
    flex-direction: column;
    padding: 15px;
    border: 2px solid rgb(180, 206, 207);
    border-radius: 15px;
    margin: 10px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  .results-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .results-body {
    width: 100%;
  }

  .results {
    display: flex;
    flex-direction: row;
  }

  .results p {
    margin: 0 10px;
    font-weight: bold;
  }

  .result-count {
    border: 1px solid rgb(180, 206, 207);
    border-radius: 15px;
    padding: 2px 6px;
    background-color: rgb(194, 189, 236);
    color: rgb(152, 42, 241);
  }

  .view-by {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .view-by-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-left: 10px;
    border: 2px solid rgb(180, 206, 207);
    border-radius: 5px;
    padding: 2px;
    background-color: rgb(212, 230, 226);
  }

  .view-by button.active {
    background-color: red;
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
    padding: 5px;
  }

  .view-by p {
    font-weight: bold;
  }

  .results-pagination {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .results-pagination a {
    margin: 0 5px;
    text-decoration: none;
    color: black;
    font-weight: bold;
  }

  .results-pagination p {
    margin: 0 5px;
    border: 1px solid black;
    background-color: red;
    color: white;
    border-radius: 30px;
    padding: 8px 12px;
  }
</style>
