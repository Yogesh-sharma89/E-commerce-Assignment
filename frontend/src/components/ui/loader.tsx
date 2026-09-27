interface LoaderProps {
  label?: string;
  brand?: string;
}


export default function Loader({ label = 'Loading', brand = 'Nyra' }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base animate-loader-fade motion-reduce:animate-none"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Wordmark */}
        <span className="font-sans text-2xl font-bold tracking-tight text-text-primary">
          {brand}
        </span>

        {/* Three-dot pulse spinner */}
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-accent animate-loader-pulse motion-reduce:animate-none motion-reduce:opacity-80" />
          <span className="h-2 w-2 rounded-full bg-accent animate-loader-pulse [animation-delay:150ms] motion-reduce:animate-none motion-reduce:opacity-80" />
          <span className="h-2 w-2 rounded-full bg-accent animate-loader-pulse [animation-delay:300ms] motion-reduce:animate-none motion-reduce:opacity-80" />
        </div>

        <p className="font-sans text-sm tracking-wide text-text-tertiary">
          {label}
        </p>
      </div>
    </div>
  );
}
