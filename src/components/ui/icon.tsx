import type { CSSProperties } from "react";

interface IconProps {
  /** SVG path data (see lib/icons). */
  d: string;
  size?: number;
  stroke?: number;
  fill?: string;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ d, size = 18, stroke = 1.8, fill = "none", color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", ...style }}>
      <path d={d} />
    </svg>
  );
}
