export function uniqueAnimalName(): string {
  const id = crypto.randomUUID().replaceAll('-', '').slice(0, 8)
  return `e2e-${id}`
}
