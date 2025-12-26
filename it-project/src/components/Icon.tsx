import {
  Phone,
  PhoneOff,
  Calendar,
  Clock,
  Bell,
  ShieldCheck,
  BarChart3,
  User,
  Briefcase,
  Zap,
  Search,
} from "lucide-react";

type IconProps = {
  name:
    | "phone"
    | "phone-off"
    | "calendar"
    | "clock"
    | "bell"
    | "shield"
    | "chart"
    | "user"
    | "briefcase"
    | "zap"
    | "search";
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const icons = {
    phone: Phone,
    "phone-off": PhoneOff,
    calendar: Calendar,
    clock: Clock,
    bell: Bell,
    shield: ShieldCheck,
    chart: BarChart3,
    user: User,
    briefcase: Briefcase,
    zap: Zap,
    search: Search,
  };

  const LucideIcon = icons[name];
  return <LucideIcon className={className ?? "h-5 w-5"} />;
}
