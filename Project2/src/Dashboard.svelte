<script>
  const recentItems = [
    { name: 'Langsam 520', type: 'Location', tone: 'blue' },
    { name: 'Euchre Club at UC', type: 'Organization', tone: 'gold' },
    { name: 'Math 1061', type: 'Event', tone: 'green' }
  ];

  const favoriteItems = [
    { name: 'Euchre Club at UC', type: 'Organization', tone: 'gold' },
    { name: 'Braunstein 140A', type: 'Location', tone: 'blue' },
    { name: 'Aronoff 6480A', type: 'Location', tone: 'blue' }
  ];

  const formatTestDate = (value) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // TODO: Make this an empty array when we no longer want to view test values.
  const testEvents = Array.from({ length: 40 }, (_, index) => {
    const eventNumber = index + 1;
    const eventDate = new Date(2026, 10, 3 + (index % 20));
    const date = [
      eventDate.getFullYear(),
      String(eventDate.getMonth() + 1).padStart(2, '0'),
      String(eventDate.getDate()).padStart(2, '0')
    ].join('-');
    const startHour = 8 + (index % 10);
    const startTime = `${startHour % 12 || 12}:${index % 2 === 0 ? '00' : '30'} ${startHour < 12 ? 'AM' : 'PM'}`;
    const endHour = startHour + 1;
    const endTime = `${endHour % 12 || 12}:${index % 2 === 0 ? '00' : '30'} ${endHour < 12 ? 'AM' : 'PM'}`;
    const locations = ['Langsam 520', 'Aronoff 6480A', 'Braunstein 140A'];

    return {
      name: `Test event ${eventNumber}`,
      location: locations[index % locations.length],
      date,
      time: `${formatTestDate(date)} · ${startTime}–${endTime}`
    };
  });

  let eventItems = testEvents;

  const times = Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2);
    const minutes = index % 2 === 0 ? '00' : '30';
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  });
  const locations = ['Langsam 520', 'Aronoff 6480A', 'Braunstein 140A'];

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');
  const nextInterval = new Date(now);
  nextInterval.setSeconds(0, 0);
  nextInterval.setMinutes(Math.ceil((now.getMinutes() + 1) / 30) * 30);
  const timeToLabel = (time) => {
    const hour = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hour % 12 || 12}:${minutes} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  let date = today;
  let startTime = timeToLabel(nextInterval);
  let endTime = timeToLabel(new Date(nextInterval.getTime() + 30 * 60 * 1000));
  let location = '';
  let eventName = '';
  let sortColumn = 'time';
  let sortDirection = 'asc';
  let currentPage = 1;
  let bookingMessage = '';
  let dateInput;
  let bookingMessageTimeout;
  const eventsPerPage = 4;

  function eventStartTime(event) {
    const [, range] = event.time.split(' · ');
    const [start] = range.split('–');
    return new Date(`${event.date} ${start.trim()}`);
  }

  function formatEventDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getPaginationItems(totalPages, page) {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (page <= 3) return [1, 2, 3, 'ellipsis', totalPages];
    if (page >= totalPages - 2) return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
    return [1, 'ellipsis', page, 'ellipsis', totalPages];
  }

  $: sortedEvents = [...eventItems].sort((a, b) => {
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
    if (!location || !eventName.trim()) {
      bookingMessage = 'Choose a location and enter an event name to continue.';
      return;
    }

    eventItems = [...eventItems, {
      name: eventName.trim(),
      location,
      date,
      time: `${formatEventDate(date)} · ${startTime}–${endTime}`
    }];
    bookingMessage = `${eventName.trim()} was added to Your Events.`;
    eventName = '';
    location = '';
    clearTimeout(bookingMessageTimeout);
    bookingMessageTimeout = setTimeout(() => {
      bookingMessage = '';
    }, 3000);
    // TODO: Replace this status message with the event scheduling popup when it is implemented.
  }

  function openDatePicker() {
    if (dateInput && dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      dateInput?.click();
    }
  }

  function openRecents() {
    // TODO: Replace this placeholder with the View all Recents popup.
    window.alert('The Recents popup will be connected here.');
  }

  function openFavorites() {
    // TODO: Replace this placeholder with the View all Favorites popup.
    window.alert('The Favorites popup will be connected here.');
  }

  function openMenu() {
    // TODO: Replace this placeholder with the menu component when it is implemented.
    window.alert('The menu will be connected here.');
  }

</script>

<svelte:head>
  <title>25LIVE Dashboard</title>
</svelte:head>

<header class="site-header">
  <a class="brand" href="/" aria-label="25LIVE dashboard">
    <span class="uc-mark">UC</span>
    <span>25LIVE</span>
  </a>
  <div class="header-actions">
    <button class="icon-button help-button" type="button" aria-label="Help" onclick={() => window.alert('Help will be connected here.')}>?</button>
    <button class="profile-button" type="button" aria-label="Open profile and menu" onclick={openMenu}>
      <span class="avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation"><circle cx="12" cy="8" r="3.25"></circle><path d="M5.5 19c.6-3.1 2.8-4.8 6.5-4.8s5.9 1.7 6.5 4.8"></path></svg>
      </span>
    </button>
  </div>
</header>

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
        {#each times as time}<option value={time}>{time}</option>{/each}
      </select>

      <label for="end-time">End time</label>
      <select id="end-time" class="field" bind:value={endTime}>
        {#each times as time}<option value={time}>{time}</option>{/each}
      </select>

      <label for="location">Location</label>
      <select id="location" class="field" bind:value={location}>
        <option value="" disabled>Select a location</option>
        {#each locations as item}<option value={item}>{item}</option>{/each}
      </select>

      <label for="event-name">Event name</label>
      <input id="event-name" class="field" type="text" bind:value={eventName} placeholder="Enter event name" />

      <button class="primary-button" type="button" onclick={bookEvent}>Book</button>
      {#if bookingMessage}<p class="form-message" role="status">{bookingMessage}</p>{/if}
    </div>
  </section>

  <div class="right-column">
    <div class="quick-lists">
      <section class="card list-card" aria-labelledby="recents-title">
        <h2 id="recents-title">Recents</h2>
        <div class="list-body">
          {#each recentItems as item}
            <button class="list-row" type="button" onclick={() => window.alert(`${item.name} will open here.`)}>
              <span>{item.name}</span><span class={`tag ${item.tone}`}>{item.type}</span>
            </button>
          {/each}
          <button class="text-button" type="button" onclick={openRecents}>View all</button>
        </div>
      </section>

      <section class="card list-card" aria-labelledby="favorites-title">
        <h2 id="favorites-title">Favorites</h2>
        <div class="list-body">
          {#each favoriteItems as item}
            <button class="list-row" type="button" onclick={() => window.alert(`${item.name} will open here.`)}>
              <span>{item.name}</span><span class={`tag ${item.tone}`}>{item.type}</span>
            </button>
          {/each}
          <button class="text-button" type="button" onclick={openFavorites}>View all</button>
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
            <button class="event-row" type="button" onclick={() => window.alert(`${event.name} will open here.`)}>
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
