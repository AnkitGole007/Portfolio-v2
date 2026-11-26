/**
 * A short, stable key for a GitHub repository name (the part after the owner), so the client feed
 * can drop hidden repositories without the page carrying their names. FNV-1a, 32 bit, over the
 * lowercased name, as 8 hex digits. No imports, so server and client modules can both use it.
 */
export function repoKey(name: string): string {
  let hash = 0x811c9dc5
  for (const ch of name.toLowerCase()) {
    hash ^= ch.codePointAt(0) ?? 0
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}
