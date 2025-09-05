import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const emailWhitelist = pgTable("email_whitelist", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .$defaultFn(() => new Date()),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
});

export type EmailWhitelist = typeof emailWhitelist.$inferSelect;
export type NewEmailWhitelist = typeof emailWhitelist.$inferInsert;
