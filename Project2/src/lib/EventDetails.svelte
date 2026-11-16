<script>
  import Popup from './Popup.svelte';
  import { locations, organizations, eventTime } from './items.js';
  export let item;
  export let event;
  export let owned = false;
  export let isFavorite = false;
  export let onToggleFavorite;
  export let onCancel;
  export let onClose;

  let confirmation;
  $: date = event?.date ? formatDate(event.date) : '';
  $: time = event?.time ? eventTime(event.time) : '';
  $: locationDetails = item.type === 'Location' ? $locations.find((location) => location.id === item.id) : undefined;
  $: organizationDetails = item.type === 'Organization' ? $organizations.find((organization) => organization.id === item.id) : undefined;
  $: dotClass = { Location: 'location', Event: 'event', Organization: 'org' }[item.type];

  function formatDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

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
    <h1 id="event-popup-title">{item.type} details</h1>
    <button class="close-button" type="button" aria-label={`Close ${item.type.toLowerCase()} details`} onclick={close}>&times;</button>
  </header>
  <dl class="event-fields">
    <div class="event-field"><dt>Name</dt><dd class="marker-value">
      <span class={`dot dot-${dotClass}`} aria-hidden="true"></span><strong>{item.name}</strong>
      <button class="favorite-toggle" type="button" aria-pressed={isFavorite}
        aria-label={`${isFavorite ? 'Remove' : 'Add'} ${item.name} ${isFavorite ? 'from' : 'to'} favorites`}
        onclick={onToggleFavorite}>{isFavorite ? '★' : '☆'}</button>
    </dd></div>
    {#if item.type === 'Event'}
      {#if event?.location || date || time}
        {#if event?.location}<div class="event-field"><dt>Location</dt><dd class="marker-value location-value"><span class="dot dot-location" aria-hidden="true"></span><strong>{event.location}</strong></dd></div>{/if}
        {#if date}<div class="event-field"><dt>Date</dt><dd>{date}</dd></div>{/if}
        {#if time}<div class="event-field"><dt>Time</dt><dd>{time}</dd></div>{/if}
      {:else}
        <div class="event-field"><dt>Details</dt><dd>No schedule information available.</dd></div>
      {/if}
    {:else if item.type === 'Location'}
      <div class="event-field"><dt>Features</dt><dd>{locationDetails?.features?.join(', ') || 'Not specified'}</dd></div>
      <div class="event-field"><dt>Layout</dt><dd>{locationDetails?.layout || 'Not specified'}</dd></div>
      <div class="event-field"><dt>Capacity</dt><dd>{locationDetails?.capacity ?? 'Not specified'}</dd></div>
    {:else if item.type === 'Organization'}
      <div class="event-field"><dt>Type</dt><dd>{organizationDetails?.orgType || 'Not specified'}</dd></div>
      <div class="event-field"><dt>Category</dt><dd>{organizationDetails?.category || 'Not specified'}</dd></div>
    {/if}
  </dl>
  {#if item.type === 'Event' && owned && event}
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
  {/if}
</Popup>
