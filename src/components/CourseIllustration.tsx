type CourseIllustrationProps = {
  courseId: string;
  className?: string;
};

export function CourseIllustration({
  courseId,
  className,
}: CourseIllustrationProps) {
  const common = { className, viewBox: "0 0 240 160", fill: "none" };

  switch (courseId) {
    case "phishing":
      return (
        <svg {...common} aria-hidden>
          <rect width="240" height="160" rx="16" fill="#fff1f2" />
          <rect
            x="40"
            y="45"
            width="140"
            height="90"
            rx="10"
            fill="#ffffff"
            stroke="#fb7185"
            strokeWidth="3"
          />
          <path
            d="M40 52l70 48 70-48"
            stroke="#fb7185"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="178" cy="42" r="22" fill="#e11d48" />
          <path
            d="M178 32v14M178 51v1"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "passwords":
      return (
        <svg {...common} aria-hidden>
          <rect width="240" height="160" rx="16" fill="#f5f3ff" />
          <circle
            cx="100"
            cy="80"
            r="32"
            fill="#fff"
            stroke="#8b5cf6"
            strokeWidth="3"
          />
          <circle cx="100" cy="80" r="10" fill="#8b5cf6" />
          <rect x="126" y="74" width="60" height="12" rx="6" fill="#8b5cf6" />
          <rect x="160" y="86" width="10" height="16" rx="3" fill="#8b5cf6" />
          <rect x="176" y="86" width="10" height="20" rx="3" fill="#8b5cf6" />
        </svg>
      );
    case "media":
      return (
        <svg {...common} aria-hidden>
          <rect width="240" height="160" rx="16" fill="#fffbeb" />
          <rect
            x="90"
            y="55"
            width="60"
            height="80"
            rx="8"
            fill="#ffffff"
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <rect x="108" y="40" width="24" height="20" rx="4" fill="#f59e0b" />
          <rect x="102" y="75" width="36" height="8" rx="4" fill="#fbbf24" />
          <rect x="102" y="90" width="36" height="8" rx="4" fill="#fbbf24" />
          <circle cx="178" cy="100" r="18" fill="#ef4444" />
          <path
            d="M170 100h16M178 92v16"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "lock-screen":
      return (
        <svg {...common} aria-hidden>
          <rect width="240" height="160" rx="16" fill="#ecfdf5" />
          <rect
            x="60"
            y="35"
            width="120"
            height="80"
            rx="8"
            fill="#ffffff"
            stroke="#10b981"
            strokeWidth="3"
          />
          <rect x="104" y="120" width="32" height="8" rx="3" fill="#10b981" />
          <rect
            x="104"
            y="63"
            width="32"
            height="26"
            rx="6"
            fill="#ffffff"
            stroke="#10b981"
            strokeWidth="3"
          />
          <path
            d="M110 63v-8a10 10 0 0 1 20 0v8"
            stroke="#10b981"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      );
    default:
      return null;
  }
}
