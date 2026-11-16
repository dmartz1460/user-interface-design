<script>
  import { onMount } from 'svelte';
  import Dashboard from './Dashboard.svelte';
  import Search from './Search.svelte';

  let route = window.location.hash.startsWith('#/search') ? 'search' : 'dashboard';
  let searchParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  let searchMode = searchParams.get('mode') || 'locations';
  let searchQuery = searchParams.get('q') || '';

  function updateRoute() {
    route = window.location.hash.startsWith('#/search') ? 'search' : 'dashboard';
    searchParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    searchMode = searchParams.get('mode') || 'locations';
    searchQuery = searchParams.get('q') || '';
  }

  onMount(() => {
    window.addEventListener('popstate', updateRoute);
    window.addEventListener('hashchange', updateRoute);

    return () => {
      window.removeEventListener('popstate', updateRoute);
      window.removeEventListener('hashchange', updateRoute);
    };
  });
</script>

{#if route === 'search'}
  <Search initialCategory={searchMode} initialQuery={searchQuery} />
{:else}
  <Dashboard />
{/if}
