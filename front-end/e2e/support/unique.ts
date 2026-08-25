export function uniqueAnimalName(prefix = 'e2e'): string {
  const id = crypto.randomUUID().replaceAll('-', '').slice(0, 8)
  return `${prefix}-${id}`
}
