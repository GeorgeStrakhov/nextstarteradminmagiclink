/**
 * Central configuration for the application
 * Handles environment variables with defaults and type safety
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getOptionalEnvVar = (
  key: string,
  defaultValue?: string,
): string | undefined => {
  return process.env[key] || defaultValue;
};

// const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
//   const value = process.env[key];
//   if (value === undefined) return defaultValue;
//   return value.toLowerCase() === 'true';
// };

// const getNumberEnvVar = (key: string, defaultValue?: number): number => {
//   const value = process.env[key];
//   if (!value) {
//     if (defaultValue !== undefined) return defaultValue;
//     throw new Error(`Missing required environment variable: ${key}`);
//   }
//   const parsed = parseInt(value, 10);
//   if (isNaN(parsed)) {
//     throw new Error(`Invalid number for environment variable ${key}: ${value}`);
//   }
//   return parsed;
// };

/**
 * Application Configuration
 */
export const appConfig = {
  env: getEnvVar("APP_ENV", "development") as
    | "development"
    | "staging"
    | "production",
  name: getEnvVar("NEXT_PUBLIC_APP_NAME", "HQ"),
  description: getEnvVar(
    "NEXT_PUBLIC_APP_DESCRIPTION",
    "where our agents live",
  ),
  isDevelopment: getEnvVar("APP_ENV", "development") === "development",
  isProduction: getEnvVar("APP_ENV", "development") === "production",
} as const;

/**
 * Authentication Configuration
 */
export const authConfig = {
  nextAuthUrl: getEnvVar("NEXTAUTH_URL", "http://localhost:3000"),
  authSecret: getEnvVar("AUTH_SECRET"),
  allowedEmailDomains:
    getOptionalEnvVar("ALLOWED_EMAIL_DOMAINS")
      ?.split(",")
      .map((d) => d.trim()) || [],
} as const;

/**
 * Database Configuration
 */
export const dbConfig = {
  url: getEnvVar("DATABASE_URL"),
} as const;

/**
 * Email Service Configuration
 */
export const emailConfig = {
  postmarkApiKey: getEnvVar("POSTMARK_API_KEY"),
  from: getEnvVar("EMAIL_FROM", "noreply@example.com"),
} as const;

/**
 * AI/LLM Provider Configuration
 */
export const aiConfig = {
  openRouter: {
    apiKey: getOptionalEnvVar("OPENROUTER_API_KEY"),
  },
  openai: {
    apiKey: getOptionalEnvVar("OPENAI_API_KEY"),
  },
  groq: {
    apiKey: getOptionalEnvVar("GROQ_API_KEY"),
  },
} as const;

/**
 * Embedding & Vector Service Configuration
 */
export const embeddingConfig = {
  cloudflare: {
    apiKey: getOptionalEnvVar("CLOUDFLARE_API_KEY"),
    accountId: getOptionalEnvVar("CLOUDFLARE_ACCOUNT_ID"),
  },
} as const;

/**
 * Web Search Service Configuration
 */
export const searchConfig = {
  exa: {
    apiKey: getOptionalEnvVar("EXA_API_KEY"),
  },
} as const;

/**
 * File Storage (S3) Configuration
 */
export const storageConfig = {
  s3: {
    endpointUrl: getOptionalEnvVar("S3_ENDPOINT_URL"),
    bucketName: getOptionalEnvVar("S3_BUCKET_NAME"),
    accessKeyId: getOptionalEnvVar("S3_ACCESS_ID_KEY"),
    secretAccessKey: getOptionalEnvVar("S3_SECRET_ACCESS_KEY"),
    region: getOptionalEnvVar("S3_REGION"),
    publicEndpoint: getOptionalEnvVar("S3_PUBLIC_ENDPOINT"),
  },
} as const;

/**
 * AI Content Generation Configuration
 */
export const contentGenConfig = {
  replicate: {
    apiKey: getOptionalEnvVar("REPLICATE_API_KEY"),
  },
} as const;

/**
 * Complete configuration object
 */
export const config = {
  app: appConfig,
  auth: authConfig,
  db: dbConfig,
  email: emailConfig,
  ai: aiConfig,
  embedding: embeddingConfig,
  search: searchConfig,
  storage: storageConfig,
  contentGen: contentGenConfig,
} as const;

/**
 * Type-safe environment variable checker
 */
export const hasConfig = {
  openRouter: () => !!aiConfig.openRouter.apiKey,
  openai: () => !!aiConfig.openai.apiKey,
  groq: () => !!aiConfig.groq.apiKey,
  cloudflare: () =>
    !!embeddingConfig.cloudflare.apiKey &&
    !!embeddingConfig.cloudflare.accountId,
  exa: () => !!searchConfig.exa.apiKey,
  s3: () =>
    !!storageConfig.s3.accessKeyId && !!storageConfig.s3.secretAccessKey,
  replicate: () => !!contentGenConfig.replicate.apiKey,
} as const;

export default config;
