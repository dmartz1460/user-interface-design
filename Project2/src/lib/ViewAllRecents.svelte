<script>
  import Popup from './Popup.svelte';
  import ItemBrowser from './ItemBrowser.svelte';
  export let items;
  export let onClose;
</script>

<Popup titleId="recents-popup-title" variant="recents" {onClose} let:close>
  <header class="recents-header">
    <div><h1 id="recents-popup-title">Recents</h1><p>Your 10 latest searches</p></div>
    <button class="close-button" type="button" aria-label="Close recents" onclick={close}>&times;</button>
  </header>
  <ItemBrowser {items} />
</Popup>
