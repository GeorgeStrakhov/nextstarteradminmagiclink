"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { clientConfig } from "@/lib/config.client";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const appName = clientConfig.app.name;

  const errorMessages: Record<string, string> = {
    AccessDenied: `This email is not authorized to access ${appName}. Please contact an administrator for access.`,
    Configuration: "There is a problem with the server configuration.",
    Verification:
      "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication. Please try again.",
  };

  const message = errorMessages[error || "Default"] || errorMessages.Default;
  const isAccessDenied = error === "AccessDenied";

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isAccessDenied
                ? "bg-yellow-100 dark:bg-yellow-950"
                : "bg-red-100 dark:bg-red-950"
            }`}
          >
            <AlertCircle
              className={`h-8 w-8 ${
                isAccessDenied
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {isAccessDenied ? "Access Restricted" : "Authentication Error"}
          </h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="pt-4">
          <Link href="/auth/signin">
            <Button variant={isAccessDenied ? "secondary" : "default"}>
              {isAccessDenied ? "Go Back" : "Try Again"}
            </Button>
          </Link>
        </div>

        {isAccessDenied && (
          <p className="text-muted-foreground text-xs">
            If you believe you should have access, please contact your system
            administrator.
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
