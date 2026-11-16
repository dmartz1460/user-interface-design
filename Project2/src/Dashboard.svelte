<script>
  import ucLogo from './assets/UC_monogram_logo.png';
  import Menu from './lib/menu.svelte';
  import EventDetails from './lib/EventDetails.svelte';
  import ViewAllFavorites from './lib/ViewAllFavorites.svelte';
  import ViewAllRecents from './lib/ViewAllRecents.svelte';
  import { locations, events, recentItems, favoriteItems, ownedEvents, isFavorite, toggleFavorite, recordView, findEvent, bookEvent as saveEvent, cancelEvent, timelineHours, dateKey } from './lib/items.js';

  const OPEN_HOUR_START = 7;
  const OPEN_HOUR_END = 21;
  const times = Array.from({ length: (OPEN_HOUR_END - OPEN_HOUR_START) * 2 + 1 }, (_, index) => {
    const minuteOfDay = OPEN_HOUR_START * 60 + index * 30;
    const hour = Math.floor(minuteOfDay / 60);
    const minutes = String(minuteOfDay % 60).padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  });

  const now = new Date();
  const nextInterval = new Date(now);
  nextInterval.setSeconds(0, 0);
  nextInterval.setMinutes(Math.ceil((now.getMinutes() + 1) / 30) * 30);
  if (nextInterval.getHours() < OPEN_HOUR_START) {
    nextInterval.setHours(OPEN_HOUR_START, 0, 0, 0);
  } else if (nextInterval.getHours() >= OPEN_HOUR_END) {
    nextInterval.setDate(nextInterval.getDate() + 1);
    nextInterval.setHours(OPEN_HOUR_START, 0, 0, 0);
  }
  const timeToLabel = (time) => {
    const hour = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hour % 12 || 12}:${minutes} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  const timeToHour = (value) => {
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return NaN;
    const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
    return hour + Number(match[2]) / 60;
  };
  let date = dateKey(nextInterval);
  let startTime = timeToLabel(nextInterval);
  let endTime = timeToLabel(new Date(nextInterval.getTime() + 30 * 60 * 1000));
  let location = '';
  let eventName = '';
  let sortColumn = 'time';
  let sortDirection = 'asc';
  let currentPage = 1;
  let bookingError = '';
  let bookingToast = '';
  let dateInput;
  let bookingMessageTimeout;
  let searchQuery = '';
  let menuTrigger;
  let activePopup = '';
  let selectedItem;
  let selectedEvent;
  let selectedOwned = false;
  const eventsPerPage = 4;
  let searchMode = 'locations';


  function eventStartTime(event) {
    return Date.parse(`${event.date}T00:00:00Z`) + timelineHours(event).startHour * 3600000;
  }

  function formatEventDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function isOpenHours(startHour, endHour) {
    return Number.isFinite(startHour) && Number.isFinite(endHour) &&
      startHour >= OPEN_HOUR_START && endHour <= OPEN_HOUR_END && endHour > startHour;
  }

  $: requestedStartHour = timeToHour(startTime);
  $: requestedEndHour = timeToHour(endTime);
  $: validEndTimes = times.filter((time) => timeToHour(time) > requestedStartHour);
  $: if (validEndTimes.length && !validEndTimes.includes(endTime)) endTime = validEndTimes[0];
  $: availableLocations = isOpenHours(requestedStartHour, requestedEndHour)
    ? $locations.filter((item) => !$events.some((event) => {
        if (event.location !== item.name || event.date !== date) return false;
        const scheduled = timelineHours(event);
        return scheduled.startHour < requestedEndHour && scheduled.endHour > requestedStartHour;
      }))
    : [];
  $: if (location && !availableLocations.some((item) => item.name === location)) location = '';

  function getPaginationItems(totalPages, page) {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (page <= 3) return [1, 2, 3, 'ellipsis', totalPages];
    if (page >= totalPages - 2) return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
    return [1, 'ellipsis', page, 'ellipsis', totalPages];
  }

  $: sortedEvents = [...$ownedEvents].sort((a, b) => {
    const first = sortColumn === 'time' ? eventStartTime(a) : a[sortColumn].toLowerCase();
    const second = sortColumn === 'time' ? eventStartTime(b) : b[sortColumn].toLowerCase();
    return (first < second ? -1 : first > second ? 1 : 0) * (sortDirection === 'asc' ? 1 : -1);
  });
  $: pageCount = Math.max(1, Math.ceil(sortedEvents.length / eventsPerPage));
  $: visibleEvents = sortedEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
  $: paginationItems = getPaginationItems(pageCount, currentPage);
  $: if (currentPage > pageCount) currentPage = pageCount;

  function sortEvents(column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }

  function bookEvent() {
    if (!date || !eventName.trim()) {
      bookingError = 'Choose a date and enter an event name to continue.';
      return;
    }
    if (!isOpenHours(requestedStartHour, requestedEndHour)) {
      bookingError = 'Choose a time between 7:00 AM and 9:00 PM, with the end after the start.';
      return;
    }
    if (!availableLocations.some((item) => item.name === location)) {
      bookingError = 'Choose a room available for the selected date and time.';
      return;
    }

    saveEvent({
      name: eventName.trim(),
      location,
      date,
      time: `${formatEventDate(date)} · ${startTime}–${endTime}`
    });
    bookingError = '';
    bookingToast = `${eventName.trim()} was added to Your Events.`;
    eventName = '';
    location = '';
    clearTimeout(bookingMessageTimeout);
    bookingMessageTimeout = setTimeout(() => {
      bookingToast = '';
    }, 3000);
  }

  function openDatePicker() {
    if (dateInput && dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      dateInput?.click();
    }
  }

  function openDetails(item) {
    selectedItem = item;
    selectedEvent = findEvent(item);
    selectedOwned = !!selectedEvent?.owned;
    recordView(item);
    activePopup = 'details';
  }

  $: selectedIsFavorite = !!selectedItem && isFavorite($favoriteItems, selectedItem);

  function submitSearch() {
    const params = new URLSearchParams({ mode: searchMode, q: searchQuery.trim() });
    window.history.pushState({}, '', `#/search?${params}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

</script>

<svelte:head>
  <title>25LIVE Dashboard</title>
</svelte:head>

<header class="site-header">
  <button class="brand" type="button" aria-label="25LIVE dashboard">
    <img class="uc-logo" src={ucLogo} alt="University of Cincinnati" />
    <span>25LIVE</span>
  </button>
  <form class="header-search" role="search" onsubmit={(event) => { event.preventDefault(); submitSearch(); }}>
      <button class="search-submit" type="submit" aria-label="Search">
        <span class="search-icon" aria-hidden="true"></span>
      </button>
      <input type="search" bind:value={searchQuery} aria-label="Search locations, events, and organizations" placeholder="Search locations, events, and organizations" />
      <span class="header-search-divider" aria-hidden="true"></span>
      <select class="header-search-mode" bind:value={searchMode} aria-label="Search by">
        <option value="locations">By location</option>
        <option value="events">By event</option>
        <option value="organizations">By organization</option>
      </select>
  </form>
  <div class="header-actions">
    <button class="icon-button help-button" type="button" aria-label="Help">?</button>
    <button class="profile-button" type="button" aria-label="Open profile and menu" popovertarget="profile-menu" bind:this={menuTrigger}>
      <span class="avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation"><circle cx="12" cy="8" r="3.25"></circle><path d="M5.5 19c.6-3.1 2.8-4.8 6.5-4.8s5.9 1.7 6.5 4.8"></path></svg>
      </span>
    </button>
  </div>
</header>

{#if bookingToast}
  <div class="booking-toast" role="status">{bookingToast}</div>
{/if}
<Menu trigger={menuTrigger} />

<main class="dashboard">
  <section class="card scheduler-card" aria-labelledby="scheduler-title">
    <h1 id="scheduler-title">Express Scheduling</h1>
    <div class="card-body scheduler-body">
      <label for="schedule-date">Date</label>
      <span class="date-field">
        <input id="schedule-date" class="field" type="date" bind:this={dateInput} bind:value={date} />
        <button class="calendar-button" type="button" aria-label="Open date picker" onclick={openDatePicker}>
          <svg class="calendar-icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="2"></rect>
          <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17"></path>
          </svg>
        </button>
      </span>

      <label for="start-time">Start time</label>
      <select id="start-time" class="field" bind:value={startTime}>
        {#each times.filter((time) => timeToHour(time) < OPEN_HOUR_END) as time}<option value={time}>{time}</option>{/each}
      </select>

      <label for="end-time">End time</label>
      <select id="end-time" class="field" bind:value={endTime}>
        {#each validEndTimes as time}<option value={time}>{time}</option>{/each}
      </select>

      <label for="location">Location</label>
      <select id="location" class="field" bind:value={location}>
        <option value="" disabled>{availableLocations.length ? 'Select a location' : 'No rooms available for selected time'}</option>
        {#each availableLocations as item}<option value={item.name}>{item.name}</option>{/each}
      </select>

      <label for="event-name">Event name</label>
      <input id="event-name" class="field" type="text" bind:value={eventName} placeholder="Enter event name" />

      <button class="primary-button" type="button" onclick={bookEvent}>Book</button>
      {#if bookingError}<p class="form-message" role="alert">{bookingError}</p>{/if}
    </div>
  </section>

  <div class="right-column">
    <div class="quick-lists">
      <section class="card list-card" aria-labelledby="recents-title">
        <h2 id="recents-title">Recents</h2>
        <div class="list-body">
          {#each $recentItems.slice(0, 3) as item}
            <button class="list-row" type="button" onclick={() => openDetails(item)}>
              <span>{item.name}</span><span class={`tag ${item.tone}`}>{item.type}</span>
            </button>
          {/each}
          <button class="text-button" type="button" onclick={() => activePopup = 'recents'}>View all</button>
        </div>
      </section>

      <section class="card list-card" aria-labelledby="favorites-title">
        <h2 id="favorites-title">Favorites</h2>
        <div class="list-body">
          {#each $favoriteItems.filter((item) => item.favorite).slice(0, 3) as item}
            <button class="list-row" type="button" onclick={() => openDetails(item)}>
              <span>{item.name}</span><span class={`tag ${item.tone}`}>{item.type}</span>
            </button>
          {/each}
          <button class="text-button" type="button" onclick={() => activePopup = 'favorites'}>View all</button>
        </div>
      </section>
    </div>

    <section class="card events-card" aria-labelledby="events-title">
      <h2 id="events-title">Your Events</h2>
      <div class="events-table" role="table" aria-label="Your events">
        {#if sortedEvents.length === 0}
          <p class="empty-events">You don't currently have any events scheduled.</p>
        {:else}
          <div class="event-header" role="row">
            <button type="button" onclick={() => sortEvents('name')}>Name <span class="sort-icon" aria-label={sortColumn === 'name' ? `${sortDirection}ending` : 'not sorted'}>{#if sortColumn === 'name'}{sortDirection === 'asc' ? '▲' : '▼'}{:else}—{/if}</span></button>
            <button type="button" onclick={() => sortEvents('location')}>Location <span class="sort-icon" aria-label={sortColumn === 'location' ? `${sortDirection}ending` : 'not sorted'}>{#if sortColumn === 'location'}{sortDirection === 'asc' ? '▲' : '▼'}{:else}—{/if}</span></button>
            <button type="button" onclick={() => sortEvents('time')}>Time <span class="sort-icon" aria-label={sortColumn === 'time' ? `${sortDirection}ending` : 'not sorted'}>{#if sortColumn === 'time'}{sortDirection === 'asc' ? '▲' : '▼'}{:else}—{/if}</span></button>
          </div>
          {#each visibleEvents as event}
            <button class="event-row" type="button" onclick={() => openDetails({ id: event.id, name: event.name, type: 'Event' })}>
              <span class="event-name"><i></i>{event.name}</span>
              <span class="event-location">{event.location}</span>
              <span class="event-time">{event.time}</span>
            </button>
          {/each}
        {/if}
      </div>
      {#if sortedEvents.length > 0}
        <nav class="pagination" aria-label="Events pages">
          <button type="button" aria-label="Previous page" disabled={currentPage === 1} onclick={() => currentPage = Math.max(1, currentPage - 1)}>‹</button>
          {#each paginationItems as page}
            {#if page === 'ellipsis'}
              <span aria-hidden="true">…</span>
            {:else}
              <button type="button" class:active={currentPage === page} aria-current={currentPage === page ? 'page' : undefined} onclick={() => currentPage = page}>{page}</button>
            {/if}
          {/each}
          <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onclick={() => currentPage = Math.min(pageCount, currentPage + 1)}>›</button>
        </nav>
      {/if}
    </section>
  </div>
</main>

{#if activePopup === 'recents'}
  <ViewAllRecents items={$recentItems} onSelect={openDetails} onClose={() => activePopup = ''} />
{:else if activePopup === 'favorites'}
  <ViewAllFavorites items={$favoriteItems} onToggle={toggleFavorite} onSelect={openDetails} onClose={() => activePopup = ''} />
{:else if activePopup === 'details'}
  <EventDetails item={selectedItem} event={selectedEvent} owned={selectedOwned}
    isFavorite={selectedIsFavorite} onToggleFavorite={() => toggleFavorite(selectedItem)}
    onCancel={cancelEvent} onClose={() => activePopup = ''} />
{/if}
