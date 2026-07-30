export default function CrossIcon({
  size = 18,
  variant = 'gradient',
  class: className = '',
  label = 'No',
}) {
  if (variant === 'outline') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F43F5E"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={className}
        style="display: inline-block; vertical-align: middle;"
      >
        <title>{label}</title>
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    );
  }

  if (variant === 'minimal') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F43F5E"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={className}
        style="display: inline-block; vertical-align: middle;"
      >
        <title>{label}</title>
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      class={className}
      style="display: inline-block; vertical-align: middle;"
    >
      <title>{label}</title>
      <defs>
        <linearGradient id="cross-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F43F5E" />
          <stop offset="100%" stop-color="#E11D48" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#cross-grad)" />
      <path
        d="M16 16L32 32M32 16L16 32"
        stroke="#FFFFFF"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
