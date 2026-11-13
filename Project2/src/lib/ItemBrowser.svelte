<script>
  export let items;
  export let favorites = false;
  export let onToggle = () => {};

  const filters = [
    { type: 'All', label: 'All' },
    { type: 'Location', label: 'Locations', tone: 'location' },
    { type: 'Event', label: 'Events', tone: 'event' },
    { type: 'Organization', label: 'Orgs', tone: 'org' }
  ];
  const initialNames = favorites ? items.filter((item) => item.favorite).map((item) => item.name) : null;
  const typeClass = { Location: 'location', Event: 'event', Organization: 'org' };
  let selectedType = 'All';

  $: visibleItems = items.filter((item) =>
    (!initialNames || initialNames.includes(item.name)) &&
    (selectedType === 'All' || item.type === selectedType)
  );
</script>

<div class="recent-browser">
  <div class="recent-filters" role="group" aria-label={favorites ? 'Favorite types' : 'Recent search types'}>
    {#each filters as filter}
      <button class="recent-filter" class:is-selected={selectedType === filter.type} type="button"
        aria-pressed={selectedType === filter.type} onclick={() => selectedType = filter.type}>
        {#if filter.tone}<span class={`dot dot-${filter.tone}`} aria-hidden="true"></span>{/if}
        {filter.label}
      </button>
    {/each}
  </div>
  <div class="recent-table-heading" aria-hidden="true"><span>Name</span><span>Type</span></div>
  <div class="recent-list" tabindex="0" role="region" aria-label={favorites ? 'Favorite items' : 'Recent searches'}>
    {#if visibleItems.length}
      <ul>
        {#each visibleItems as item}
          <li>
            <span class="recent-name">
              <span class={`dot dot-${typeClass[item.type]}`} aria-hidden="true"></span>
              {#if favorites}
                <button class="favorite-toggle" type="button" aria-pressed={item.favorite}
                  aria-label={`${item.favorite ? 'Remove' : 'Add'} ${item.name} ${item.favorite ? 'from' : 'to'} favorites`}
                  onclick={() => onToggle(item)}>{item.favorite ? '★' : '☆'}</button>
              {/if}
              {item.name}
            </span>
            <span class={`badge badge-${typeClass[item.type]}`}>{item.type}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty-recents">{favorites ? 'No matching favorites.' : 'No matching recent searches.'}</p>
    {/if}
  </div>
</div>
