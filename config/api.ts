/**
 * Central API configuration.
 *
 * Set the NEXT_PUBLIC_API_URL environment variable to the backend's public
 * domain URL (e.g. https://your-backend.up.railway.app/api).
 *
 * No localhost fallback is provided intentionally — a missing variable will
 * surface as a clear runtime error rather than silently hitting a local
 * address that does not exist in production.
 */
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    '[config/api] NEXT_PUBLIC_API_URL is not set. ' +
      'API calls will fail. Please set this environment variable to the backend URL.'
  );
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
