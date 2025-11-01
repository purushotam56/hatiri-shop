export function normalizeFileName(fileName: string): string {
  const timestamp = Date.now()
  const name = fileName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  const ext = fileName.split('.').pop() // Get file extension

  return `${name}-${timestamp}.${ext}`
}
