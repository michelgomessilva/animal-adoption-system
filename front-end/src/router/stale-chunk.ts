const STALE_CHUNK_MESSAGE =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i

export function isStaleChunkError(error: unknown): boolean {
  return error instanceof Error && STALE_CHUNK_MESSAGE.test(error.message)
}

export function reloadIfStaleChunk(error: unknown): void {
  if (isStaleChunkError(error)) {
    window.location.reload()
  }
}
