<script>
  import Dashboard from './Dashboard.svelte';
  import Search from './Search.svelte';

  let route = window.location.hash.startsWith('#/search') ? 'search' : 'dashboard';
  let searchMode = new URLSearchParams(window.location.hash.split('?')[1] || '').get('mode') || 'locations';

  function updateRoute() {
    route = window.location.hash.startsWith('#/search') ? 'search' : 'dashboard';
    searchMode = new URLSearchParams(window.location.hash.split('?')[1] || '').get('mode') || 'locations';
  }

  window.addEventListener('popstate', updateRoute);
</script>

{#if route === 'search'}
  <Search initialCategory={searchMode} />
{:else}
  <Dashboard />
{/if}
