// Replace this sample data with recent searches from the application.
// The recents renderer expects each item to have a name and a type from typeLabels.
const recentItems = [
  { name: 'Langsam 520', type: 'location' },
  { name: 'Euchre Club at UC', type: 'org' },
  { name: 'Math 1061', type: 'event' },
  { name: 'The Meaning of Life', type: 'event' },
  { name: 'Langsam 620', type: 'location' },
  { name: 'Aronoff 6480A', type: 'location' },
  { name: 'Chess Club', type: 'org' },
  { name: 'Calculus review', type: 'event' },
  { name: 'Braunstein 140A', type: 'location' },
  { name: 'Dance Team', type: 'org' },
];

const typeLabels = { location: 'Location', event: 'Event', org: 'Organization' };

// Shared by the recents popup and the search History tab; each instance has its own filter state.
function createRecents(container) {
  container.innerHTML = `
    <div class="recent-filters" role="group" aria-label="Recent search types">
      <button class="recent-filter is-selected" type="button" data-type="all" aria-pressed="true">All</button>
      <button class="recent-filter" type="button" data-type="location" aria-pressed="false"><span class="dot dot-location" aria-hidden="true"></span>Locations</button>
      <button class="recent-filter" type="button" data-type="event" aria-pressed="false"><span class="dot dot-event" aria-hidden="true"></span>Events</button>
      <button class="recent-filter" type="button" data-type="org" aria-pressed="false"><span class="dot dot-org" aria-hidden="true"></span>Orgs</button>
    </div>
    <div class="recent-table-heading" aria-hidden="true"><span>Name</span><span>Type</span></div>
    <div class="recent-list" tabindex="0" aria-label="Recent searches"><ul></ul><p class="empty-recents" hidden>No matching recent searches.</p></div>
  `;
  const list = container.querySelector('ul');
  const empty = container.querySelector('.empty-recents');
  const buttons = container.querySelectorAll('.recent-filter');
  let selectedType = 'all';
  let query = '';

  for (const item of recentItems) {
    const row = document.createElement('li');
    row.dataset.type = item.type;
    row.dataset.name = item.name.toLowerCase();
    row.innerHTML = `<span class="recent-name"><span class="dot dot-${item.type}" aria-hidden="true"></span></span><span class="badge badge-${item.type}"></span>`;
    row.querySelector('.recent-name').append(document.createTextNode(item.name));
    row.querySelector('.badge').textContent = typeLabels[item.type];
    list.append(row);
  }

  function updateRows() {
    let visibleCount = 0;
    for (const row of list.children) {
      const visible = (selectedType === 'all' || row.dataset.type === selectedType)
        && row.dataset.name.includes(query);
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    }
    empty.hidden = visibleCount !== 0;
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      selectedType = button.dataset.type;
      for (const filter of buttons) {
        const selected = filter === button;
        filter.classList.toggle('is-selected', selected);
        filter.setAttribute('aria-pressed', String(selected));
      }
      updateRows();
    });
  }

  return {
    setQuery(value) {
      query = value.trim().toLowerCase();
      updateRows();
    },
  };
}

const recents = new Map();
for (const container of document.querySelectorAll('[data-recents]')) {
  recents.set(container, createRecents(container));
}

const cancelEvent = document.querySelector('#cancel-event');
if (cancelEvent) {
  const dialog = document.querySelector('.confirm-dialog');
  cancelEvent.addEventListener('click', () => dialog.showModal());
  document.querySelector('#keep-event').addEventListener('click', () => dialog.close());
  document.querySelector('#confirm-cancel').addEventListener('click', () => {
    // Replace this local-only state change with event cancellation and explicit success/error handling.
    dialog.close();
    cancelEvent.disabled = true;
    const status = document.querySelector('.event-status');
    status.textContent = 'Event cancelled in this mockup.';
    status.hidden = false;
  });
}

const searchCard = document.querySelector('.search-card');
if (searchCard) {
  const input = searchCard.querySelector('.search-input input');
  const filters = searchCard.querySelector('.location-filters');
  const history = searchCard.querySelector('.search-history');
  const historyRecents = recents.get(history.querySelector('[data-recents]'));
  const tabs = searchCard.querySelectorAll('.search-tab');
  const menus = filters.querySelectorAll('.filter-menu');

  // Tabs only change the mockup's visible controls; connect category selection to search results.
  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      for (const item of tabs) {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        if (active) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      }
      const category = tab.dataset.category;
      const label = category === 'history' ? 'Search history' : `Search ${category}`;
      input.placeholder = label;
      input.setAttribute('aria-label', label);
      filters.hidden = category !== 'locations';
      history.hidden = category !== 'history';
      for (const menu of menus) menu.open = false;
      historyRecents.setQuery(input.value);
    });
  }

  // Typing filters the sample history only; other categories do not perform a search yet.
  input.addEventListener('input', () => historyRecents.setQuery(input.value));

  // Filter choices update the chip labels only. Connect their values to the location query.
  function updateFilter(menu) {
    const selected = menu.querySelectorAll('input:checked');
    const name = menu.dataset.filter;
    const value = name === 'Capacity' && selected.length ? selected[0].value : selected.length;
    menu.querySelector('summary span').textContent = selected.length ? `${name}: ${value}` : `${name} +`;
    menu.classList.toggle('has-selection', selected.length > 0);
  }

  for (const menu of menus) {
    updateFilter(menu);
    menu.addEventListener('change', () => updateFilter(menu));
    menu.addEventListener('toggle', () => {
      if (menu.open) {
        for (const other of menus) {
          if (other !== menu) other.open = false;
        }
      }
    });
  }

  filters.querySelector('.clear-filters').addEventListener('click', () => {
    for (const input of filters.querySelectorAll('input')) input.checked = false;
    for (const menu of menus) {
      menu.open = false;
      updateFilter(menu);
    }
  });
}
