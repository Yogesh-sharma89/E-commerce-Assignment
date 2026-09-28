import { Toaster } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors={false}
      closeButton
      duration={4000}
      visibleToasts={5}
      icons={{
        success: <CheckCircle2 size={18} />,
        error: <XCircle size={18} />,
        warning: <AlertTriangle size={18} />,
        info: <Info size={18} />,
        loading: <Loader2 size={18} className="toast-spinner" />,
      }}
    />
  );
}