import { derived, get, writable } from 'svelte/store';

export const filterOptions = {
  locations: {
    buildings: ['Langsam', 'Linder Hall', 'Old Chem', '60 West Charlton'],
    features: ['Flooring: Carpet', 'Flooring: Cement', 'A/V: Camera', 'Board: White', 'Seating: Tables and Chairs'],
    layouts: ['Classroom', 'Conference', 'Lecture/Theater']
  },
  events: {
    organizations: ['Euchre Club', 'IEEE', 'Chess Club', 'Star Wars Club'],
    types: ['Class', 'Organization']
  },
  organizations: {
    types: ['Internal', 'External'],
    categories: ['Clubs', 'CEAS']
  }
};

// Sample data, not an authoritative list of university rooms or events.
export const locations = writable([
  { id: 'loc-1', name: 'Langsam 520', building: 'Langsam', layout: 'Classroom', capacity: 40, features: ['Flooring: Carpet', 'Board: White', 'Seating: Tables and Chairs'] },
  { id: 'loc-2', name: 'Langsam 620', building: 'Langsam', layout: 'Conference', capacity: 20, features: ['Flooring: Carpet', 'A/V: Camera', 'Seating: Tables and Chairs'] },
  { id: 'loc-3', name: 'Langsam 240', building: 'Langsam', layout: 'Lecture/Theater', capacity: 120, features: ['Flooring: Cement', 'A/V: Camera', 'Board: White'] },
  { id: 'loc-4', name: 'Linder Hall 110', building: 'Linder Hall', layout: 'Lecture/Theater', capacity: 90, features: ['Flooring: Carpet', 'A/V: Camera', 'Board: White'] },
  { id: 'loc-5', name: 'Linder Hall 305', building: 'Linder Hall', layout: 'Classroom', capacity: 35, features: ['Flooring: Cement', 'Board: White', 'Seating: Tables and Chairs'] },
  { id: 'loc-6', name: 'Linder Hall 420', building: 'Linder Hall', layout: 'Conference', capacity: 14, features: ['Flooring: Carpet', 'A/V: Camera', 'Board: White', 'Seating: Tables and Chairs'] },
  { id: 'loc-7', name: 'Old Chem 100', building: 'Old Chem', layout: 'Lecture/Theater', capacity: 200, features: ['Flooring: Cement', 'A/V: Camera'] },
  { id: 'loc-8', name: 'Old Chem 525', building: 'Old Chem', layout: 'Classroom', capacity: 30, features: ['Flooring: Cement', 'Board: White', 'Seating: Tables and Chairs'] },
  { id: 'loc-9', name: '60 West Charlton 112', building: '60 West Charlton', layout: 'Classroom', capacity: 25, features: ['Flooring: Carpet', 'Board: White', 'Seating: Tables and Chairs'] },
  { id: 'loc-10', name: '60 West Charlton 200', building: '60 West Charlton', layout: 'Conference', capacity: 12, features: ['Flooring: Carpet', 'A/V: Camera', 'Seating: Tables and Chairs'] },
  { id: 'loc-11', name: 'Aronoff 6480A', building: 'Aronoff', layout: 'Classroom', capacity: 40, features: ['Board: White'] },
  { id: 'loc-12', name: 'Braunstein 140A', building: 'Braunstein', layout: 'Classroom', capacity: 30, features: ['Board: White'] }
]);

export const organizations = writable([
  { id: 'org-1', name: 'Euchre Club', orgType: 'Internal', category: 'Clubs' },
  { id: 'org-2', name: 'IEEE', orgType: 'Internal', category: 'CEAS' },
  { id: 'org-3', name: 'Chess Club', orgType: 'Internal', category: 'Clubs' },
  { id: 'org-4', name: 'Star Wars Club', orgType: 'Internal', category: 'Clubs' },
  { id: 'org-5', name: 'Dance Team', orgType: 'Internal', category: 'Clubs' },
  { id: 'org-6', name: 'Society of Women Engineers', orgType: 'Internal', category: 'CEAS' },
  { id: 'org-7', name: 'Cincinnati Chess Association', orgType: 'External', category: 'Clubs' },
  { id: 'org-8', name: 'Cincinnati Section of IEEE', orgType: 'External', category: 'CEAS' }
]);

export const events = writable([
  { id: 'event-1', name: 'Study group', location: 'Langsam 520', date: '2026-11-15', time: 'Nov 15 · 9:00 AM–10:00 AM', organization: null, eventType: 'Organization', owned: true },
  { id: 'event-2', name: 'Chess Club', location: 'Aronoff 6480A', date: '2026-11-16', time: 'Nov 16 · 2:00 PM–3:00 PM', organization: 'Chess Club', eventType: 'Organization', owned: true },
  { id: 'event-3', name: 'Math 1061', location: 'Braunstein 140A', date: '2026-11-17', time: 'Nov 17 · 4:00 PM–5:00 PM', organization: null, eventType: 'Class', owned: false },
  { id: 'event-4', name: 'Dance Team', location: 'Aronoff 6480A', date: '2026-11-18', time: 'Nov 18 · 5:00 PM–6:00 PM', organization: null, eventType: 'Organization', owned: false },
  { id: 'event-5', name: 'Euchre Night', location: 'Langsam 620', date: '2026-11-19', time: 'Nov 19 · 6:00 PM–8:00 PM', organization: 'Euchre Club', eventType: 'Organization', owned: false },
  { id: 'event-6', name: 'IEEE General Meeting', location: 'Linder Hall 305', date: '2026-11-20', time: 'Nov 20 · 5:30 PM–6:30 PM', organization: 'IEEE', eventType: 'Organization', owned: false },
  { id: 'event-7', name: 'Star Wars Movie Marathon', location: 'Old Chem 100', date: '2026-11-21', time: 'Nov 21 · 7:00 PM–11:00 PM', organization: 'Star Wars Club', eventType: 'Organization', owned: false },
  { id: 'event-8', name: 'Chess Tournament', location: 'Linder Hall 420', date: '2026-11-22', time: 'Nov 22 · 1:00 PM–5:00 PM', organization: 'Chess Club', eventType: 'Organization', owned: false },
  { id: 'event-9', name: 'Physics 1071', location: 'Old Chem 525', date: '2026-11-23', time: 'Nov 23 · 10:00 AM–11:15 AM', organization: null, eventType: 'Class', owned: false },
  { id: 'event-10', name: 'ENED 1020', location: 'Langsam 240', date: '2026-11-24', time: 'Nov 24 · 1:00 PM–2:15 PM', organization: null, eventType: 'Class', owned: false },
  { id: 'event-11', name: 'IEEE Soldering Workshop', location: '60 West Charlton 112', date: '2026-11-25', time: 'Nov 25 · 4:00 PM–6:00 PM', organization: 'IEEE', eventType: 'Organization', owned: false }
]);

const typeLabels = { location: 'Location', event: 'Event', org: 'Organization' };
const toneByType = { Location: 'blue', Organization: 'gold', Event: 'green' };

export const searchResults = derived([locations, events, organizations], ([$locations, $events, $organizations]) => [
  ...$locations.map((item) => ({ ...item, type: 'location' })),
  ...$events.map((item) => ({ ...item, type: 'event' })),
  ...$organizations.map((item) => ({ ...item, type: 'org' }))
]);
export const ownedEvents = derived(events, ($events) => $events.filter((event) => event.owned));

export function filterResults(items, category, query, filters) {
  const type = { locations: 'location', events: 'event', organizations: 'org' }[category];
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (item.type !== type || (q && !item.name.toLowerCase().includes(q) &&
      !item.formal_name?.toLowerCase().includes(q))) return false;
    if (category === 'locations') {
      return (!filters.buildings?.length || filters.buildings.includes(item.building)) &&
        (!filters.features?.length || filters.features.every((feature) => item.features.includes(feature))) &&
        (!filters.layouts?.length || filters.layouts.includes(item.layout)) &&
        (filters.capacityMin == null || item.capacity >= filters.capacityMin) &&
        (filters.capacityMax == null || item.capacity <= filters.capacityMax);
    }
    if (category === 'events') {
      return (!filters.eventTypes?.length || filters.eventTypes.includes(item.eventType)) &&
        (!filters.organizations?.length || filters.organizations.includes(item.organization));
    }
    return (!filters.orgTypes?.length || filters.orgTypes.includes(item.orgType)) &&
      (!filters.categories?.length || filters.categories.includes(item.category));
  });
}

export function searchItem(result) {
  const type = typeLabels[result.type] || result.type;
  return { id: result.id, name: result.name, type, tone: toneByType[type] };
}

const recentIds = writable(['loc-1', 'org-1', 'event-3', 'loc-2', 'loc-11', 'org-3', 'loc-12', 'org-5']);
const favoriteIds = writable(['org-1', 'loc-12', 'loc-11', 'loc-1', 'event-3', 'org-3', 'org-5']);

function itemsForIds(ids, results) {
  return ids.map((id) => results.find((result) => result.id === id))
    .filter(Boolean).map(searchItem);
}

export const recentItems = derived([recentIds, searchResults], ([$ids, $results]) => itemsForIds($ids, $results));
export const favoriteItems = derived([favoriteIds, searchResults], ([$ids, $results]) =>
  itemsForIds($ids, $results).map((item) => ({ ...item, favorite: true }))
);

export function isFavorite(items, item) {
  return items.some((favorite) => favorite.id === item.id && favorite.favorite);
}

export function toggleFavorite(item) {
  favoriteIds.update((ids) => ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [item.id, ...ids]);
}

export function recordView(item) {
  recentIds.update((ids) => [item.id, ...ids.filter((id) => id !== item.id)].slice(0, 10));
}

export function findEvent(item) {
  return item.type === 'Event' || item.type === 'event'
    ? get(events).find((event) => event.id === item.id) : undefined;
}

let nextEventId = 1;
export function bookEvent(event) {
  events.update((items) => [...items, {
    ...event, id: `booked-${nextEventId++}`, organization: null, eventType: null, owned: true
  }]);
}

export function cancelEvent(event) {
  events.update((items) => items.filter((item) => item.id !== event.id || !item.owned));
}

export function dateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function eventTime(time) {
  return time.split(' · ').pop();
}

export function timelineHours(event) {
  const range = eventTime(event.time).split(/[–-]/);
  const parse = (value) => {
    const match = value?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return NaN;
    return Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0) + Number(match[2]) / 60;
  };
  return { ...event, type: 'event', startHour: parse(range[0]), endHour: parse(range[1]) };
}
