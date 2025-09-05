// Export all schema tables
export * from "./auth";
export * from "./email-whitelist";

// Re-export commonly used types for convenience
export type { User, NewUser, Session, NewSession } from "./auth";
export type { EmailWhitelist, NewEmailWhitelist } from "./email-whitelist";
