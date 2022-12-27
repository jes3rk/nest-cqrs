export function initializeAndAddToArrayMap<K, V>(
  map: Map<K, V[]>,
  key: K,
  value: V,
): void {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}
