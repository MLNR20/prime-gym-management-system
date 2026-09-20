// components/Alert.tsx
import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type AlertVariant = "success" | "error" | "warning" | "info";

type AlertProps = {
  message: string;
  variant?: AlertVariant;
  /** Auto-dismiss after this many ms. Pass 0 to keep it on screen. */
  duration?: number;
  onClose?: () => void;
};

const variantStyles: Record<AlertVariant, string> = {
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
  info: "alert-info",
};

const variantIcons: Record<AlertVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function Alert({
  message,
  variant = "success",
  duration = 3000,
  onClose,
}: AlertProps): React.ReactElement {
  useEffect(() => {
    if (!duration || !onClose) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = variantIcons[variant];

  return (
    <div className="toast toast-end z-50">
      <div className={`alert ${variantStyles[variant]} text-white shadow-lg`}>
        <Icon size={20} />
        <span>{message}</span>
        {onClose && (
          <button
            type="button"
            aria-label="Dismiss"
            className="btn btn-ghost btn-xs btn-circle"
            onClick={onClose}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
