/**
 * Standard error response for API routes. In production, hides the raw
 * error message (which can include DB internals, IDs, file paths, etc.)
 * In development, includes the message so developers can debug.
 *
 * Always logs the full error server-side for ops visibility.
 */
export function apiErrorBody(
  err: unknown,
  fallback: string,
  contextTag = "API",
): { error: string } {
  const isDev = process.env.NODE_ENV !== "production";
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${contextTag}]`, err);
  return { error: isDev ? message || fallback : fallback };
}
