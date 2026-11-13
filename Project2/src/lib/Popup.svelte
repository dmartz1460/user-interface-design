<script>
  import { onMount } from 'svelte';

  export let titleId;
  export let onClose;
  export let variant = '';
  let dialog;

  onMount(() => {
    dialog.showModal();
  });

  function close() {
    dialog.close();
  }

  function closeOnBackdrop(event) {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      close();
    }
  }
</script>

<dialog class={`popup ${variant}`} aria-labelledby={titleId} bind:this={dialog} onclose={onClose} onclick={closeOnBackdrop}>
  <slot {close} />
</dialog>
