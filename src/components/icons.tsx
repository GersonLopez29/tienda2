type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BagIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6 8h12l1 13H5L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.6" y2="16.6" />
    </svg>
  );
}

export function FilterIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" fill="var(--surface-2)" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="16" cy="12" r="2" fill="var(--surface-2)" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="11" cy="18" r="2" fill="var(--surface-2)" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base}
      fill={filled ? "currentColor" : "none"}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.5S3.5 15.2 3.5 9.2A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.5 2.7c0 6-8.5 11.3-8.5 11.3z" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M20.5 12.5 12 21l-9-9V4h8l9.5 8.5z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="1" y="7" width="13" height="10" rx="1" />
      <path d="M14 10h4l4 4v3h-8z" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="17.5" cy="19" r="2" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M20 4C10 4 4 10 4 18v2h2c8 0 14-6 14-16V4z" />
      <path d="M6 20c4-6 8-9 14-14" />
    </svg>
  );
}

export function DropletIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3s7 7.5 7 12.5a7 7 0 0 1-14 0C5 10.5 12 3 12 3z" />
    </svg>
  );
}

export function RulerIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="2" y="7" width="20" height="10" rx="1" />
      <line x1="6" y1="7" x2="6" y2="11" />
      <line x1="10" y1="7" x2="10" y2="11" />
      <line x1="14" y1="7" x2="14" y2="11" />
      <line x1="18" y1="7" x2="18" y2="11" />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />
      <line x1="14" y1="7" x2="17" y2="10" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.3 10.7 15.7 6.3M8.3 13.3l7.4 4.4" />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 20l1.3-4.2A8 8 0 1 1 8.6 19L4 20z" />
      <path d="M8.5 9.3c.2-.6.5-.6.8-.6h.5c.2 0 .4 0 .6.5s.7 1.7.8 1.8.1.3 0 .5-.2.3-.4.5-.4.4-.2.7c.2.3.9 1.4 1.9 2.2 1.3 1 2 1.1 2.3 1s.5-.5.7-.9.5-.3.8-.2 1.7.8 2 .9.5.2.5.4-.1 1.2-.6 1.6-1.6 1-2.7.7c-1.2-.3-2.9-1.1-4.4-2.9-1.5-1.7-2.2-3.1-2.4-3.6s-.2-.9 0-1.2z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" />
    </svg>
  );
}

export function TiktokIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M14 4c.4 2.4 2 4 4.5 4.2V11c-1.6 0-3-.5-4.5-1.5V16a5 5 0 1 1-5-5c.3 0 .6 0 1 .1v2.7a2.3 2.3 0 1 0 1.7 2.2V4h2.3z" />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 16V4" />
      <path d="M6 10l6-6 6 6" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

const garmentBase = {
  viewBox: "0 0 48 48",
  fill: "currentColor",
  fillOpacity: 0.14,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function JacketIcon({ className }: IconProps) {
  return (
    <svg {...garmentBase} className={className} aria-hidden="true">
      <path d="M18 6l6 4 6-4 8 5-3 6-5-2v25a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V15l-5 2-3-6 8-5z" />
      <line x1="24" y1="14" x2="24" y2="40" />
    </svg>
  );
}

export function HoodieIcon({ className }: IconProps) {
  return (
    <svg {...garmentBase} className={className} aria-hidden="true">
      <path d="M24 4c-4 0-6 3-6 6-5 1-9 5-9 11v18a2 2 0 0 0 2 2h9V25l4 4 4-4v16h9a2 2 0 0 0 2-2V21c0-6-4-10-9-11 0-3-2-6-6-6z" />
      <path d="M18 12c2 2 4 3 6 3s4-1 6-3" />
    </svg>
  );
}

export function ShirtIcon({ className }: IconProps) {
  return (
    <svg {...garmentBase} className={className} aria-hidden="true">
      <path d="M17 6l7 4 7-4 8 6-4 6-4-2v24a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V16l-4 2-4-6 8-6z" />
    </svg>
  );
}

export function JeansIcon({ className }: IconProps) {
  return (
    <svg {...garmentBase} className={className} aria-hidden="true">
      <path d="M14 5h20l1 12-2 22a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2l-1-16-1 16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2l-2-22 1-12z" />
      <line x1="24" y1="9" x2="24" y2="20" />
    </svg>
  );
}

export function DressIcon({ className }: IconProps) {
  return (
    <svg {...garmentBase} className={className} aria-hidden="true">
      <path d="M18 5h12l2 8-4-1v2l7 24a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2l7-24v-2l-4 1 2-8z" />
      <line x1="24" y1="4" x2="24" y2="14" />
    </svg>
  );
}

export const GARMENT_ICONS = {
  jacket: JacketIcon,
  hoodie: HoodieIcon,
  shirt: ShirtIcon,
  jeans: JeansIcon,
  dress: DressIcon,
} as const;

export type GarmentKey = keyof typeof GARMENT_ICONS;
