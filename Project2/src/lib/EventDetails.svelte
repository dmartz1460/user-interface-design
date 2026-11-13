<script>
  import Popup from './Popup.svelte';
  export let event;
  export let onCancel;
  export let onClose;

  let confirmation;
  const [year, month, day] = event.date.split('-').map(Number);
  const date = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  const time = event.time.split(' · ')[1];

  function confirmCancellation(close) {
    confirmation.close();
    onCancel(event);
    close();
  }

  function closeConfirmationOnBackdrop(event, close) {
    if (event.target !== confirmation) return;
    const bounds = confirmation.getBoundingClientRect();
    if (event.clientX >= bounds.left && event.clientX <= bounds.right &&
        event.clientY >= bounds.top && event.clientY <= bounds.bottom) return;

    confirmation.close();
    const popupBounds = confirmation.closest('.popup').getBoundingClientRect();
    if (event.clientX < popupBounds.left || event.clientX > popupBounds.right ||
        event.clientY < popupBounds.top || event.clientY > popupBounds.bottom) close();
  }
</script>

<Popup titleId="event-popup-title" variant="event-details" {onClose} let:close>
  <header class="popup-header">
    <h1 id="event-popup-title">Event details</h1>
    <button class="close-button" type="button" aria-label="Close event details" onclick={close}>&times;</button>
  </header>
  <dl class="event-fields">
    <div class="event-field"><dt>Name</dt><dd><span class="event-marker" aria-hidden="true"></span><strong>{event.name}</strong></dd></div>
    <div class="event-field"><dt>Location</dt><dd class="location-value"><span class="dot dot-location" aria-hidden="true"></span><strong>{event.location}</strong></dd></div>
    <div class="event-field"><dt>Date</dt><dd>{date}</dd></div>
    <div class="event-field"><dt>Time</dt><dd>{time}</dd></div>
  </dl>
  <footer class="popup-actions">
    <button class="action action-modify" type="button" disabled>Modify</button>
    <button class="action action-cancel" type="button" onclick={() => confirmation.showModal()}>Cancel event</button>
  </footer>
  <dialog class="confirm-dialog" bind:this={confirmation} aria-labelledby="confirm-title" aria-describedby="confirm-description" onclick={(event) => closeConfirmationOnBackdrop(event, close)}>
    <h2 id="confirm-title">Cancel event?</h2>
    <p id="confirm-description">Are you sure you want to cancel {event.name}?</p>
    <div class="confirm-actions">
      <button class="action action-secondary" type="button" onclick={() => confirmation.close()}>Keep event</button>
      <button class="action action-cancel" type="button" onclick={() => confirmCancellation(close)}>Cancel event</button>
    </div>
  </dialog>
</Popup>
