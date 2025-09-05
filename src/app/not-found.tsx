import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-6 px-4 text-center">
        {/* Large 404 text */}
        <div className="space-y-2">
          <h1 className="text-primary/20 text-9xl font-bold select-none">
            404
          </h1>
          <h2 className="text-foreground text-2xl font-semibold">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-muted-foreground text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className="text-muted-foreground text-sm">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link
            href="/"
            className="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-ring inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Go Home
          </Link>
        </div>

        {/* Decorative element */}
        <div className="pt-8">
          <div className="bg-border mx-auto h-px w-24"></div>
        </div>
      </div>
    </div>
  );
}
