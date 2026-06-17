import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

interface Props {
  show: boolean;
  type: "success" | "warning" | "error";
  message: string;
  onDismiss: () => void;
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const colors = {
  success: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", icon: "#10b981", text: "#34d399" },
  warning: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.3)", icon: "#fbbf24", text: "#fbbf24" },
  error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", icon: "#ef4444", text: "#f87171" },
};

export function Toast({ show, type, message, onDismiss }: Props) {
  const c = colors[type];
  const Icon = icons[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-6 right-6 z-50 max-w-sm"
        >
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl"
            style={{ backgroundColor: c.bg, borderColor: c.border }}
          >
            <Icon className="w-6 h-6 shrink-0" style={{ color: c.icon }} />
            <p className="text-sm font-bold flex-1" style={{ color: c.text }}>{message}</p>
            <button
              onClick={onDismiss}
              className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
              style={{ color: c.text }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
