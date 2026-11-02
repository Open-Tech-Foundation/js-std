export default function NotFound() {
  return (
    <div class="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p class="font-mono text-sm font-semibold text-[var(--afw-accent)]">
        404
      </p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight">Page not found</h1>
      <p class="mt-3 max-w-md text-[var(--afw-text-muted)]">
        The page you are looking for does not exist or has moved.
      </p>
      <a
        href="/"
        class="mt-6 rounded-lg bg-[var(--afw-accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Go home
      </a>
    </div>
  );
}
