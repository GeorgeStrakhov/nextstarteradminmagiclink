/**
 * Client-safe configuration
 * Only includes NEXT_PUBLIC_* environment variables
 */

/**
 * Application Configuration (Client-safe)
 */
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "...",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "...",
} as const;

/**
 * Client-safe configuration object
 */
export const clientConfig = {
  app: appConfig,
} as const;

export default clientConfig;
