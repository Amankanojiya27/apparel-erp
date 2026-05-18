import { DEMO_STYLES } from './demo-data';
import { enrichStyle } from './style-factory';

let store = DEMO_STYLES.map((s) => enrichStyle(s));

export function getDemoStyles() {
  return store;
}

export function getDemoStyleById(id: string) {
  return store.find((s) => s._id === id);
}

export function updateDemoStyle(id: string, updates: Record<string, unknown>) {
  const idx = store.findIndex((s) => s._id === id);
  if (idx === -1) return null;
  store[idx] = enrichStyle({ ...store[idx], ...updates } as typeof store[number]);
  return store[idx];
}

export function resetDemoStore() {
  store = DEMO_STYLES.map((s) => enrichStyle(s));
}
