export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')

/**
 * Prepend the configured base path to the provided path.
 * - If basePath is empty, returns the original path.
 * - Ensures there is exactly one leading slash.
 */
export function withBasePath(path: string) {
    const normalized = path.startsWith('/') ? path : `/${path}`
    return BASE_PATH ? `${BASE_PATH}${normalized}` : normalized
}

export default withBasePath
