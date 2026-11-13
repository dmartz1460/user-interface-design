<script>
  import Popup from './Popup.svelte';
  import ItemBrowser from './ItemBrowser.svelte';
  export let items;
  export let onToggle;
  export let onClose;
</script>

<Popup titleId="favorites-popup-title" variant="recents" {onClose} let:close>
  <header class="recents-header">
    <div><h1 id="favorites-popup-title">Favorites</h1><p>Your saved items</p></div>
    <button class="close-button" type="button" aria-label="Close favorites" onclick={close}>&times;</button>
  </header>
  <ItemBrowser {items} favorites {onToggle} />
</Popup>
