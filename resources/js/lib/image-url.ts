/**
 * Convert a storage-relative image path to a full URL.
 * If the path is already a full URL (http/https), return as-is.
 * Otherwise, prepend /storage/ to make it accessible from the public disk.
 */
export function storageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `/storage/${path}`;
}
