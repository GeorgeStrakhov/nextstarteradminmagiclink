import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Postmark from "next-auth/providers/postmark";
import { db } from "@/db";
import { emailWhitelist } from "@/db/schema/email-whitelist";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/services/email/email";
import { createMagicLinkEmail } from "@/lib/email/templates/magic-link";
import { authConfig, emailConfig, appConfig } from "@/lib/config";

async function isEmailAllowed(email: string): Promise<boolean> {
  // Check domain whitelist first
  const allowedDomains = authConfig.allowedEmailDomains;
  if (allowedDomains.length > 0) {
    const emailDomain = email.split("@")[1];
    if (allowedDomains.includes(emailDomain)) {
      return true;
    }
  }

  // Check individual email whitelist
  const whitelistedEmail = await db
    .select()
    .from(emailWhitelist)
    .where(eq(emailWhitelist.email, email.toLowerCase()))
    .limit(1);

  return whitelistedEmail.length > 0;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...DrizzleAdapter(db),
    createUser: async (userData) => {
      // Check if user's email domain is in the whitelist
      const allowedDomains = authConfig.allowedEmailDomains;
      let shouldBeAdmin = false;

      if (userData.email && allowedDomains.length > 0) {
        const emailDomain = userData.email.split("@")[1];
        shouldBeAdmin = allowedDomains.includes(emailDomain);
      }

      // Create user with admin status if from whitelisted domain
      const newUser = await db
        .insert(users)
        .values({
          ...userData,
          isAdmin: shouldBeAdmin,
        })
        .returning();

      return {
        ...newUser[0],
        email: newUser[0].email!,
      };
    },
  },
  providers: [
    Postmark({
      from: emailConfig.from,
      server: emailConfig.postmarkApiKey,
      // Custom email template for magic links
      sendVerificationRequest: async ({ identifier: email, url }) => {
        // Generate the email using our template system
        const { subject, htmlBody, textBody } = createMagicLinkEmail({
          email,
          url,
          appName: appConfig.name,
          appDescription: appConfig.description,
        });

        // Send email using our service (handles dev mode logging)
        await sendEmail({
          from: emailConfig.from,
          to: email,
          subject,
          htmlBody,
          textBody,
          tag: "magic-link",
          metadata: {
            type: "authentication",
            timestamp: new Date().toISOString(),
          },
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    signIn: async ({ user }) => {
      if (!user.email) {
        console.log("❌ Sign-in rejected: No email provided");
        throw new Error("AccessDenied");
      }

      const isAllowed = await isEmailAllowed(user.email);

      if (!isAllowed) {
        console.log(`❌ Sign-in rejected: Email ${user.email} not whitelisted`);
        // Return false instead of throwing to avoid stack trace for expected denials
        return false;
      }

      console.log(`✅ Sign-in allowed: Email ${user.email} is whitelisted`);
      return true;
    },
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;

        // Get the user's admin status from the database
        const dbUser = await db
          .select({ isAdmin: users.isAdmin })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        session.user.isAdmin = dbUser[0]?.isAdmin ?? false;
      }
      return session;
    },
  },
});
