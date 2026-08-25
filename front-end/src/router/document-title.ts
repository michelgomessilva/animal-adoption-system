export function documentTitleFor(title: string | undefined): string {
  return title === undefined ? 'POA' : `${title} — POA`
}
