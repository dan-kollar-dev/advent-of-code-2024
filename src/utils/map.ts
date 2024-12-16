export function getKeysByPropertyValue(
  map: Map<string, any>,
  property: string,
  value: any
) {
  const keys = [];

  for (const [key, obj] of map.entries()) {
    if (obj[property] === value) {
      keys.push(key);
    }
  }

  return keys;
}
