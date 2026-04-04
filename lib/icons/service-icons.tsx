import type { LucideIcon } from "lucide-react";
import {
  Battery,
  Car,
  CircleDot,
  ClipboardCheck,
  Cpu,
  Droplets,
  Wrench,
  Zap,
} from "lucide-react";

export const SERVICE_ICON_OPTIONS = [
  "Droplets",
  "CircleDot",
  "Car",
  "Cpu",
  "Zap",
  "ClipboardCheck",
  "Wrench",
  "Battery",
] as const;

const map: Record<string, LucideIcon> = {
  Droplets,
  CircleDot,
  Disc: CircleDot,
  Car,
  Cpu,
  Zap,
  ClipboardCheck,
  Wrench,
  Battery,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? Wrench;
  return <Icon className={className} aria-hidden />;
}
