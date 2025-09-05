import { CheckIcon, MailIcon } from "lucide-react";
import { appConfig } from "@/lib/config";

export default function VerifyRequest() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full">
              <MailIcon className="text-primary-foreground h-8 w-8" />
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <CheckIcon className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent you a secure sign-in link for {appConfig.name}.
          </p>
        </div>

        <div className="bg-muted space-y-2 rounded-lg p-4">
          <p className="text-sm font-medium">Next steps:</p>
          <ol className="text-muted-foreground space-y-1 text-sm">
            <li>1. Check your email inbox</li>
            <li>2. Click the sign-in link</li>
            <li>3. You&apos;ll be automatically signed in</li>
          </ol>
        </div>

        <div className="text-muted-foreground space-y-1 text-xs">
          <p>Didn&apos;t receive the email? Check your spam folder.</p>
          <p>The link will expire in 24 hours for security.</p>
        </div>
      </div>
    </div>
  );
}
