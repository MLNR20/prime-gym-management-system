import React from "react";
import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  iconClassName?: string;
};

export default function EmptyState({
  title = "Nothing to see here",
  subtitle = "No records found.",
  icon: Icon = Inbox,
  className = "",
  iconClassName = "bg-gray-100 text-gray-400",
}: EmptyStateProps): React.ReactElement {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 px-4 text-center ${className}`}>
      <div className={`p-3 rounded-full ${iconClassName}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="font-semibold text-gray-600">{title}</p>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
