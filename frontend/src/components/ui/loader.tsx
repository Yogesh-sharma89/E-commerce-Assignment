interface LoaderProps {
  label?: string;
  brand?: string;
}

export default function Loader({
  label = "Loading",
  brand = "ShopFlow",
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed inset-0 z-9999
        flex items-center justify-center
        overflow-hidden
        bg-bg-base
        animate-loader-fade
        motion-reduce:animate-none
      "
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          h-72 w-72
          rounded-full
          bg-accent/10
          blur-3xl
          animate-loader-glow
          motion-reduce:animate-none
        "
      />

      <div className="relative flex flex-col items-center">
        {/* Loader mark */}
        <div className="relative mb-7">
          {/* Outer rotating ring */}
          <div
            className="
              absolute -inset-2.5
              rounded-full
              border border-transparent
              border-t-accent
              border-r-accent/40
              animate-loader-spin
              motion-reduce:animate-none
            "
          />

          {/* Second subtle ring */}
          <div
            className="
              absolute -inset-1
              rounded-full
              border border-accent/10
              animate-loader-spin-reverse
              motion-reduce:animate-none
            "
          />

          {/* Logo container */}
          <div
            className="
              relative
              flex h-16 w-16
              items-center justify-center
              rounded-2xl
              border border-white/8
              bg-bg-elevated
              shadow-[0_0_50px_rgba(139,124,255,0.15)]
              animate-loader-breathe
              motion-reduce:animate-none
            "
          >
            {/* Inner glow */}
            <div
              className="
                absolute inset-2
                rounded-xl
                bg-accent/10
                blur-md
                animate-loader-glow
                motion-reduce:animate-none
              "
            />

            {/* Brand initial */}
            <span
              className="
                relative
                font-sans
                text-xl
                font-bold
                tracking-tight
                text-text-primary
              "
            >
              {brand.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Brand */}
        <div
          className="
            mb-5
            font-sans
            text-xl
            font-semibold
            tracking-tight
            text-text-primary
            animate-loader-brand
            motion-reduce:animate-none
          "
        >
          {brand}
        </div>

        {/* Loading dots */}
        <div className="mb-4 flex items-center gap-2" aria-hidden="true">
          <span
            className="
              h-1.5 w-1.5
              rounded-full
              bg-accent
              animate-loader-dot
              motion-reduce:animate-none
            "
          />

          <span
            className="
              h-1.5 w-1.5
              rounded-full
              bg-accent
              animate-loader-dot
              [animation-delay:150ms]
              motion-reduce:animate-none
            "
          />

          <span
            className="
              h-1.5 w-1.5
              rounded-full
              bg-accent
              animate-loader-dot
              [animation-delay:300ms]
              motion-reduce:animate-none
            "
          />
        </div>

        {/* Label */}
        <p
          className="
            font-sans
            text-sm
            tracking-wide
            text-text-tertiary
            animate-loader-label
            motion-reduce:animate-none
          "
        >
          {label}
        </p>

        {/* Tiny loading line */}
        <div
          className="
            mt-5
            h-px
            w-24
            overflow-hidden
            rounded-full
            bg-white/6
          "
          aria-hidden="true"
        >
          <div
            className="
              h-full
              w-1/2
              rounded-full
              bg-accent
              shadow-[0_0_12px_rgba(139,124,255,0.7)]
              animate-loader-progress
              motion-reduce:animate-none
            "
          />
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">{label}</span>
    </div>
  );
}
