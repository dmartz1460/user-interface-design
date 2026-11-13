<script>
  import ucLogo from './assets/UC_monogram_logo.png';
  import Menu from './lib/menu.svelte';

  export let initialCategory = 'locations';

  const categories = [
    { id: 'locations', label: 'Locations', tone: 'location' },
    { id: 'events', label: 'Events', tone: 'event' },
    { id: 'organizations', label: 'Organizations', tone: 'org' },
    { id: 'history', label: 'History', tone: '' }
  ];

  let category = categories.some((item) => item.id === initialCategory) ? initialCategory : 'locations';
  let query = '';
  let menuTrigger;

  $: placeholder = category === 'history' ? 'Search history' : `Search ${category}`;

  function showDashboard() {
    window.history.pushState({}, '', '#/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
</script>

<svelte:head>
  <title>25LIVE Search</title>
</svelte:head>

<header class="site-header">
  <button class="brand" type="button" aria-label="25LIVE dashboard" onclick={showDashboard}>
    <img class="uc-logo" src={ucLogo} alt="University of Cincinnati" />
    <span>25LIVE</span>
  </button>
  <div class="header-actions">
    <button class="icon-button help-button" type="button" aria-label="Help">?</button>
    <button class="profile-button" type="button" aria-label="Open profile and menu" popovertarget="profile-menu" bind:this={menuTrigger}>
      <span class="avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation"><circle cx="12" cy="8" r="3.25"></circle><path d="M5.5 19c.6-3.1 2.8-4.8 6.5-4.8s5.9 1.7 6.5 4.8"></path></svg>
      </span>
    </button>
  </div>
</header>

<Menu trigger={menuTrigger} />

<main class="search-page">
  <section class="search-card" aria-label="Search">
    <nav class="search-tabs" aria-label="Search categories">
      {#each categories as item}
        <button class:is-active={category === item.id} class="search-tab" type="button" aria-current={category === item.id ? 'page' : undefined} onclick={() => category = item.id}>
          {#if item.tone}<span class={`dot dot-${item.tone}`} aria-hidden="true"></span>{/if}{item.label}
        </button>
      {/each}
    </nav>
    <div class="search-content">
      <form class="search-input" role="search" onsubmit={(event) => event.preventDefault()}>
        <button class="search-submit" type="submit" aria-label="Search">
          <span class="search-icon" aria-hidden="true"></span>
        </button>
        <input type="search" bind:value={query} aria-label={placeholder} placeholder={placeholder} />
      </form>

      {#if category === 'locations'}
        <div class="location-filters" aria-label="Location filters">
          <details class="filter-menu"><summary>Spaces: 2</summary><fieldset><legend>Spaces</legend><label><input type="checkbox" checked /> Single space</label><label><input type="checkbox" checked /> Multiple spaces</label></fieldset></details>
          <details class="filter-menu"><summary>Features +</summary><fieldset><legend>Features</legend><label><input type="checkbox" /> Projector</label><label><input type="checkbox" /> Whiteboard</label><label><input type="checkbox" /> Zoom</label></fieldset></details>
          <details class="filter-menu"><summary>Layouts +</summary><fieldset><legend>Layouts</legend><label><input type="checkbox" /> Classroom</label><label><input type="checkbox" /> Lecture</label><label><input type="checkbox" /> Seminar</label></fieldset></details>
          <details class="filter-menu"><summary>Capacity +</summary><fieldset><legend>Minimum capacity</legend><label><input type="radio" name="capacity" /> 10</label><label><input type="radio" name="capacity" /> 25</label><label><input type="radio" name="capacity" /> 50</label></fieldset></details>
          <button class="clear-filters" type="button">Clear</button>
        </div>
      {:else if category === 'history'}
        <section class="search-history">
          <h1>History</h1>
          <p>Your 10 latest searches</p>
        </section>
      {/if}
    </div>
  </section>
</main>
