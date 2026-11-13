<script>
  // ── Props ──
  // search_results:  paged array of result objects
  // results_per_page: number of rows per page (unused here but kept for parity)
  // activeCategory:  'locations' | 'events' | 'organizations' | 'history'
  let { search_results, results_per_page, activeCategory = 'locations' } = $props();
</script>

<table class="list-results">
  <thead>
    <tr>
      <!-- ── Column headers change based on the active search category ── -->
      {#if activeCategory === 'locations'}
        <th>Name</th>
        <th>Formal Name</th>
        <th>Building</th>
        <th>Features</th>
        <th>Layout</th>
        <th>Capacity</th>
      {:else if activeCategory === 'events'}
        <th>Name</th>
        <th>Formal Name</th>
        <th>Organization</th>
        <th>Category</th>
        <th>Type</th>
        <th>Date</th>
      {:else if activeCategory === 'organizations'}
        <th>Name</th>
        <th>Formal Name</th>
        <th>Type</th>
        <th>Category</th>
        <th>Status</th>
      {:else}
        <!-- history / fallback -->
        <th>Name</th>
        <th>Type</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each search_results as result}
      <tr>
        {#if activeCategory === 'locations'}
          <td>
            <button onclick={() => result.favorite = !result.favorite} aria-label="Toggle favorite">
              {result.favorite ? '★' : '☆'}
            </button>
            {result.name}
          </td>
          <td style="font-weight: bold;">{result.formal_name}</td>
          <td>{result.building ?? '—'}</td>
          <td>{result.features ?? '—'}</td>
          <td>{result.layouts ?? '—'}</td>
          <td>{result.capacity ?? '—'}</td>

        {:else if activeCategory === 'events'}
          <td>
            <button onclick={() => result.favorite = !result.favorite} aria-label="Toggle favorite">
              {result.favorite ? '★' : '☆'}
            </button>
            {result.name}
          </td>
          <td style="font-weight: bold;">{result.formal_name}</td>
          <td>{result.organization ?? '—'}</td>
          <td>{result.category ?? '—'}</td>
          <td><span class="badge badge-{result.eventType}">{result.eventType ?? '—'}</span></td>
          <td>{result.date ?? '—'}</td>

        {:else if activeCategory === 'organizations'}
          <td>
            <button onclick={() => result.favorite = !result.favorite} aria-label="Toggle favorite">
              {result.favorite ? '★' : '☆'}
            </button>
            {result.name}
          </td>
          <td style="font-weight: bold;">{result.formal_name}</td>
          <td>{result.orgType ?? '—'}</td>
          <td>{result.category ?? '—'}</td>
          <td><span class="badge badge-status-{result.status}">{result.status ?? '—'}</span></td>

        {:else}
          <td>{result.name}</td>
          <td><span class="badge badge-{result.type}">{result.type}</span></td>
        {/if}
      </tr>
    {/each}

    {#if search_results.length === 0}
      <tr>
        <td colspan="6" class="empty-state">No results found.</td>
      </tr>
    {/if}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 10px 8px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 2px solid #e3e3e6;
    white-space: nowrap;
  }

  td {
    padding: 10px 8px;
    text-align: left;
    font-size: 14px;
    color: #1c1c1e;
    border-bottom: 1px solid #f0f0f2;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: #f8faff;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 15px;
    color: #94a3b8;
    margin-right: 4px;
    padding: 0;
    line-height: 1;
    vertical-align: middle;
  }
  button:hover { color: #2f6fed; }

  .empty-state {
    text-align: center;
    color: #64748b;
    padding: 32px 0;
    font-size: 14px;
  }

  /* ── Type / status badges ── */
  .badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 9px;
    border-radius: 10px;
    text-transform: capitalize;
  }

  /* event type */
  .badge-class        { background: #dbeafe; color: #1e40af; }
  .badge-organization { background: #fef9c3; color: #854d0e; }

  /* org status */
  .badge-status-active   { background: #dcfce7; color: #166534; }
  .badge-status-inactive { background: #fee2e2; color: #991b1b; }
  .badge-status-pending  { background: #fef3c7; color: #92400e; }
</style>
