import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="bg-slate-950/80 backdrop-blur-md border-t border-slate-800/50 py-2">
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            className="inline-block"
          >
            <circle cx="12" cy="12" r="11" fill="#1877F2" />
            <path
              d="M10.5 16.5L6 12l1.5-1.5 3 3 6-6L18 9l-7.5 7.5z"
              fill="white"
            />
          </svg>
          <span className="text-slate-400 text-sm font-bold">
            Created By Mario Faltas
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
