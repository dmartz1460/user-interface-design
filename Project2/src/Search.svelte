<script>
  import ucLogo from './assets/UC_monogram_logo.png';
  import Menu from './lib/menu.svelte';
  import Search from './lib/search.svelte'

  let { initialCategory = 'locations', initialQuery = '' } = $props();
  let menuTrigger;

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
<Search {initialCategory} {initialQuery} />