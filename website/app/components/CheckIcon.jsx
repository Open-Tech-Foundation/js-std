export default function CheckIcon({ size = 18, variant = 'gradient', class: className = '' }) {
  if (variant === 'outline') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10B981"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={className}
        style="display: inline-block; vertical-align: middle;"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
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
        stroke="#10B981"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={className}
        style="display: inline-block; vertical-align: middle;"
      >
        <polyline points="20 6 9 17 4 12" />
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
      <defs>
        <linearGradient id="check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#check-grad)" />
      <path
        d="M14 24.5L20.5 31L34 17.5"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
