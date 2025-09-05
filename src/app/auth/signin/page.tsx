"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clientConfig } from "@/lib/config.client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("postmark", {
        email,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (result?.error) {
        // Check if it's an access denied error (from whitelist)
        if (result.error === "AccessDenied") {
          setMessage(
            "This email is not authorized to access this application. Please contact an administrator.",
          );
        } else {
          setMessage("Something went wrong. Please try again.");
        }
      } else if (result?.ok) {
        setMessage("Check your email for a magic link!");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Welcome to {clientConfig.app.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            {clientConfig.app.description ||
              "Sign in to your account using your email"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className={cn(
                "border-border w-full rounded-lg border px-4 py-3",
                "focus:ring-ring focus:border-transparent focus:ring-2 focus:outline-none",
                "bg-background text-foreground placeholder:text-muted-foreground",
              )}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? "Sending magic link..." : "Send magic link"}
          </Button>

          {message && (
            <div
              className={cn(
                "rounded-lg p-3 text-center text-sm",
                message.includes("Check your email")
                  ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                  : message.includes("not authorized")
                    ? "border border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                    : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
              )}
            >
              {message}
            </div>
          )}
        </form>

        <p className="text-muted-foreground text-center text-xs">
          We&apos;ll send you a secure link to sign in without a password.
        </p>
      </div>
    </div>
  );
}
