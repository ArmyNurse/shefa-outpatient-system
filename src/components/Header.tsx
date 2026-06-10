import type { ReactNode } from "react";
import { HeartPulse, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                مستشفي الشفاء التخصصي
              </h1>
              <p className="text-sm text-blue-300/70 font-medium">
                El Shifa Specialized Hospital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200 font-semibold text-sm sm:text-base">
                جدول مواعيد العيادات الخارجية
              </span>
            </div>
            {children}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="h-px mt-4 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </div>
    </header>
  );
}
