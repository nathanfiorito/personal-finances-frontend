import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="text-muted-foreground text-sm">This page does not exist.</p>
        <Link to="/" className="text-primary text-sm underline">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
