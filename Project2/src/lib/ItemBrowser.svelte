<script>
  export let items;
  export let favorites = false;
  export let onToggle = () => {};
  export let onSelect;

  const filters = [
    { type: 'All', label: 'All' },
    { type: 'Location', label: 'Locations', tone: 'location' },
    { type: 'Event', label: 'Events', tone: 'event' },
    { type: 'Organization', label: 'Orgs', tone: 'org' }
  ];
  const initialItems = favorites ? items.filter((item) => item.favorite) : null;
  const typeClass = { Location: 'location', Event: 'event', Organization: 'org' };
  let selectedType = 'All';

  $: visibleItems = items.filter((item) =>
    (!initialItems || initialItems.some((initial) => initial.name === item.name && initial.type === item.type)) &&
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
  <div class="recent-list" role="region" aria-label={favorites ? 'Favorite items' : 'Recent searches'}>
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
              <button class="recent-item-button" type="button" onclick={() => onSelect(item)}>{item.name}</button>
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
