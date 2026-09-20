import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { AlertVariant } from "../components/Alert";

export type CrudAlertInfo = { message: string; variant: AlertVariant };

const STORAGE_KEY = "crudAlert";

/**
 * Surfaces a one-shot alert after a create/edit (via router state) or a
 * delete (via sessionStorage, since delete triggers a full page reload).
 */
export default function useCrudAlert() {
  const location = useLocation();
  const [alertInfo, setAlertInfo] = useState<CrudAlertInfo | null>(null);

  useEffect(() => {
    const state = location.state as { alertMessage?: string; alertVariant?: AlertVariant } | null;
    if (state?.alertMessage) {
      setAlertInfo({ message: state.alertMessage, variant: state.alertVariant ?? "success" });
      window.history.replaceState({}, document.title);
      return;
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAlertInfo(JSON.parse(stored));
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [location.state]);

  return { alertInfo, setAlertInfo };
}
