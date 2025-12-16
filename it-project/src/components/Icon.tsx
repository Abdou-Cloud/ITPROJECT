import {
  Phone,
  Calendar,
  Clock,
  Bell,
  ShieldCheck,
  BarChart3,
  User,
  Briefcase,
  Zap,
} from "lucide-react";

type IconProps = {
  name:
    | "phone"
    | "calendar"
    | "clock"
    | "bell"
    | "shield"
    | "chart"
    | "user"
    | "briefcase"
    | "zap";
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const icons = {
    phone: Phone,
    calendar: Calendar,
    clock: Clock,
    bell: Bell,
    shield: ShieldCheck,
    chart: BarChart3,
    user: User,
    briefcase: Briefcase,
    zap: Zap,
  };

  const LucideIcon = icons[name];
  return <LucideIcon className={className ?? "h-5 w-5"} />;
}
