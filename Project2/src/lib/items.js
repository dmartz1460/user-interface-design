import { writable } from 'svelte/store';

export const recentItems = writable([
  { name: 'Langsam 520', type: 'Location', tone: 'blue' },
  { name: 'Euchre Club at UC', type: 'Organization', tone: 'gold' },
  { name: 'Math 1061', type: 'Event', tone: 'green' },
  { name: 'The Meaning of Life', type: 'Event', tone: 'green' },
  { name: 'Langsam 620', type: 'Location', tone: 'blue' },
  { name: 'Aronoff 6480A', type: 'Location', tone: 'blue' },
  { name: 'Chess Club', type: 'Organization', tone: 'gold' },
  { name: 'Calculus review', type: 'Event', tone: 'green' },
  { name: 'Braunstein 140A', type: 'Location', tone: 'blue' },
  { name: 'Dance Team', type: 'Organization', tone: 'gold' }
]);

export const favoriteItems = writable([
  { name: 'Euchre Club at UC', type: 'Organization', tone: 'gold', favorite: true },
  { name: 'Braunstein 140A', type: 'Location', tone: 'blue', favorite: true },
  { name: 'Aronoff 6480A', type: 'Location', tone: 'blue', favorite: true },
  { name: 'Langsam 520', type: 'Location', tone: 'blue', favorite: true },
  { name: 'Math 1061', type: 'Event', tone: 'green', favorite: true },
  { name: 'Chess Club', type: 'Organization', tone: 'gold', favorite: true },
  { name: 'Dance Team', type: 'Organization', tone: 'gold', favorite: true },
  { name: 'Lindner 110', type: 'Location', tone: 'blue', favorite: true },
  { name: 'Calculus Review', type: 'Event', tone: 'green', favorite: true, eventData: { date: 'Tue Nov 19 2026' } },
  { name: 'Math Society', type: 'Organization', tone: 'gold', favorite: true }
]);

export const ownedEvents = writable(null);

const toneByType = { Location: 'blue', Organization: 'gold', Event: 'green' };
const typeLabels = { location: 'Location', event: 'Event', org: 'Organization' };
const sameItem = (a, b) => a.name === b.name && a.type === b.type;

export function searchItem(result) {
  const type = typeLabels[result.type];
  return {
    name: result.name,
    type,
    tone: toneByType[type],
    ...(type === 'Event' ? { eventData: { date: result.date, location: result.location, time: result.time } } : {})
  };
}

export function timelineEvent(event, date) {
  const formatTime = (hour) => `${Math.floor(hour) % 12 || 12}:${hour % 1 ? '30' : '00'} ${hour < 12 ? 'AM' : 'PM'}`;
  return {
    name: event.name,
    type: 'event',
    location: event.location,
    date,
    time: `${formatTime(event.startHour)}–${formatTime(event.endHour)}`
  };
}

export function isFavorite(items, item) {
  return items.some((favorite) => sameItem(favorite, item) && favorite.favorite);
}

export function toggleFavorite(item) {
  favoriteItems.update((items) => {
    const existing = items.find((favorite) => sameItem(favorite, item));
    if (!existing) return [{ ...item, tone: toneByType[item.type], favorite: true }, ...items];
    return items.map((favorite) => sameItem(favorite, item)
      ? { ...favorite, ...(item.eventData ? { eventData: item.eventData } : {}), favorite: !favorite.favorite }
      : favorite);
  });
}

export function recordView(item) {
  if (item.eventData) {
    favoriteItems.update((items) => items.map((favorite) => sameItem(favorite, item)
      ? { ...favorite, eventData: item.eventData }
      : favorite));
  }
  recentItems.update((items) => [
    { ...item, tone: toneByType[item.type] },
    ...items.filter((recent) => !sameItem(recent, item))
  ].slice(0, 10));
}
