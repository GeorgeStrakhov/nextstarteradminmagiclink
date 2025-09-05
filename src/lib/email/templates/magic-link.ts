import { renderEmailTemplate } from "../renderer";
import type { RenderedEmail } from "./types";
import { appConfig } from "@/lib/config";

interface MagicLinkEmailOptions {
  email: string;
  url: string;
  appName?: string;
  appDescription?: string;
}

export function createMagicLinkEmail({
  email,
  url,
  appName = appConfig.name,
  appDescription = appConfig.description,
}: MagicLinkEmailOptions): RenderedEmail {
  const subject = `Sign in to ${appName}`;

  const content = `
# Welcome back to ${appName}

${appDescription ? `*${appDescription}*\n\n` : ""}

We received a sign-in request for your account (${email}). Click the button below to complete your sign-in:

<div style="text-align: center; margin: 32px 0;">
  <a href="${url}" class="button" style="display: inline-block; background-color: #007cba; color: #ffffff !important; text-decoration: none !important; padding: 14px 28px; border-radius: 4px; font-weight: 600; font-size: 16px;">
    Sign in to ${appName}
  </a>
</div>

If the button doesn't work, you can copy and paste this link into your browser:

${url}

---

**Security notes:**
- This link will expire in 24 hours
- If you didn't request this, you can safely ignore this email
- Never share this link with anyone

Need help? Just reply to this email and we'll assist you.
`;

  return renderEmailTemplate(
    {
      subject,
      content,
      recipientEmail: email,
    },
    {
      title: subject,
      preheader: `Sign in to ${appName} - Your secure login link`,
      showFooter: true,
    },
  );
}
