import { cn } from "@/lib/utils";

interface IconProps {
  /** SVG path data (see lib/icons). */
  d: string;
  size?: number;
  stroke?: number;
  fill?: string;
  color?: string;
  className?: string;
}

export function Icon({ d, size = 18, stroke = 1.8, fill = "none", color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("shrink-0", className)}>
      <path d={d} />
    </svg>
  );
}
