import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useExpandedSchedule, type Page } from "../hooks/useExpandedSchedule";
import type { FontSize, ThemeName } from "./DisplaySettings";

const SLIDE_DURATION = 10;

interface Props {
  settings: { fontSize: FontSize; theme: ThemeName };
  onExit: () => void;
}

export function DisplayScreen({ settings, onExit }: Props) {
  const pages = useExpandedSchedule();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(SLIDE_DURATION);

  const slideDuration = SLIDE_DURATION;

  const themeClass = `theme-${settings.theme}`;
  const current = pages[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % pages.length);
    setCountdown(slideDuration);
  }, [pages.length, slideDuration]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + pages.length) % pages.length);
    setCountdown(slideDuration);
  }, [pages.length, slideDuration]);

  useEffect(() => {
    setCountdown(slideDuration);
  }, [slideDuration]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          goNext();
          return slideDuration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [goNext, slideDuration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit, goNext, goPrev]);

  return (
    <div
      dir="rtl"
      className={`${themeClass} fixed inset-0 z-50 overflow-hidden`}
      style={{
        background: "linear-gradient(135deg, var(--bg-gradient-from), var(--bg-gradient-to))",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.03, background: "radial-gradient(circle at 50% 50%, var(--primary-500), transparent 70%)" }}
      />

      <div className="relative h-full flex flex-col">
        <header
          className="backdrop-blur-md border-b"
          style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "var(--border-color)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl shadow-md"
                style={{ background: "linear-gradient(135deg, var(--primary-500), var(--primary-700))" }}
              >
                <HeartPulse className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                  مستشفي الشفاء التخصصي
                </h1>
                <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                  El Shifa Specialized Hospital
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="px-4 py-2 rounded-xl border"
                  style={{ backgroundColor: "var(--primary-50)", borderColor: "var(--primary-200)" }}
                >
                  <p className="font-bold text-sm" style={{ color: "var(--primary-800)" }}>
                    جدول مواعيد العيادات الخارجية
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-white" style={{ backgroundColor: "var(--primary-700)" }}>
                  <Clock className="w-4 h-4" style={{ color: "var(--primary-200)" }} />
                  <span className="font-bold text-lg tabular-nums min-w-[2ch] text-center" dir="ltr">
                    {countdown}
                  </span>
                  <span className="text-xs" style={{ color: "var(--primary-200)" }}>ثانية</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden px-6 py-2">
          <AnimatePresence mode="wait">
            {"isNotesPage" in current ? (
              <motion.div
                key="notes-page"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--primary-800)" }}>
                  {current.title}
                </h2>
                {(current as any).bookingNotes && (
                  <p className="text-base font-semibold mb-6" style={{ color: "var(--accent-700)" }}>
                    {(current as any).bookingNotes}
                  </p>
                )}
                <div className="flex flex-col gap-4 w-full max-w-4xl">
                  {(current as any).entries.map((entry: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="rounded-2xl border shadow-sm px-8 py-5"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
                          {entry.doctor}
                        </span>
                        <span className="text-base font-semibold" style={{ color: "var(--primary-600)" }}>
                          {entry.specialty}
                        </span>
                        {entry.times && entry.times.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-2 mt-1">
                            {entry.times.map((t: string, ti: number) => (
                              <span
                                key={ti}
                                className="text-sm font-bold px-3 py-1 rounded-full border"
                                style={{
                                  backgroundColor: "var(--accent-50)",
                                  color: "var(--accent-700)",
                                  borderColor: "var(--accent-100)",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        {entry.note && (
                          <span className="text-lg font-medium mt-2" style={{ color: "var(--text-secondary)" }}>
                            {entry.note}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={(current as any).id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: "var(--primary-100)" }}>
                      <HeartPulse className="w-5 h-5" style={{ color: "var(--primary-600)" }} />
                    </div>
                    <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                      {(current as any).specialty}
                    </h2>
                    <span
                      className="text-sm px-3 py-1 rounded-full font-semibold"
                      style={{ backgroundColor: "var(--primary-50)", color: "var(--primary-700)" }}
                    >
                      {(current as any).doctors.length} طبيب
                    </span>
                    {(current as any).totalPages > 1 && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--accent-50)", color: "var(--accent-700)" }}
                      >
                        {(current as any).pageNum} / {(current as any).totalPages}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="flex-1 rounded-2xl border shadow-sm overflow-hidden"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
                >
                  <div className="h-full overflow-y-auto">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="sticky top-0 border-b" style={{ backgroundColor: "var(--bg-table-header)", borderColor: "var(--border-color)" }}>
                          <th className="px-4 py-2 whitespace-nowrap text-sm font-bold" style={{ color: "var(--primary-800)" }}>
                            اسم الطبيب
                          </th>
                          <th className="px-4 py-2 whitespace-nowrap text-sm font-bold" style={{ color: "var(--primary-800)" }}>
                            المواعيد
                          </th>
                          <th className="px-4 py-2 whitespace-nowrap text-sm font-bold" style={{ color: "var(--primary-800)" }}>
                            ملاحظات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(current as any).doctors.map((doc: any, i: number) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.25 }}
                            className="border-b last:border-0 transition-colors"
                            style={{
                              borderColor: "var(--border-color)",
                              backgroundColor: i % 2 === 0 ? "var(--bg-row-even)" : "var(--bg-row-odd)",
                            }}
                          >
                            <td className="px-4 py-1.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: "var(--primary-100)" }}
                                >
                                  <User className="w-4 h-4" style={{ color: "var(--primary-600)" }} />
                                </div>
                                <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                                  {doc.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-1.5">
                              <div className="flex flex-wrap gap-1">
                                {doc.schedule.map((entry: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col items-center min-w-[80px] rounded-lg px-2.5 py-1.5 border"
                                    style={{
                                      backgroundColor: "var(--accent-50)",
                                      borderColor: "var(--accent-100)",
                                    }}
                                  >
                                    <span className="font-bold text-sm" style={{ color: "var(--accent-700)" }}>
                                      {entry.time}
                                    </span>
                                    <span className="text-xs font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>
                                      {entry.day}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-1.5">
                              {doc.notes ? (
                                <span
                                  className="inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded-lg border"
                                  style={{
                                    backgroundColor: "var(--accent-50)",
                                    color: "var(--accent-700)",
                                    borderColor: "var(--accent-100)",
                                  }}
                                >
                                  {doc.notes}
                                </span>
                              ) : (
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {(current as any).bookingNotes && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="mt-4 border rounded-xl px-6 py-4 flex items-center gap-3"
                    style={{
                      backgroundColor: "var(--accent-50)",
                      borderColor: "var(--accent-100)",
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "var(--accent-500)" }} />
                    <span className="font-medium text-base" style={{ color: "var(--accent-700)" }}>
                      ملاحظات الحجز: {(current as any).bookingNotes}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <div className="backdrop-blur-md border-t py-2" style={{ backgroundColor: "rgba(255,255,255,0.8)", borderColor: "var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <button
              onClick={goPrev}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>

            <div className="flex items-center gap-1.5">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setCountdown(slideDuration);
                  }}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === currentIndex ? "1.5rem" : "0.5rem",
                    backgroundColor: i === currentIndex ? "var(--primary-500)" : "var(--primary-200)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.6)", borderColor: "var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: "var(--primary-500)" }} />
                <span className="font-bold" style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  ش الاربعين, عين شمس الغربية, القاهرة
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                <circle cx="12" cy="12" r="11" fill="#1877F2" />
                <path d="M10.5 16.5L6 12l1.5-1.5 3 3 6-6L18 9l-7.5 7.5z" fill="white" />
              </svg>
              <span className="font-bold" style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Created By Mario Faltas
              </span>
            </div>

            <div className="flex items-center gap-3" dir="ltr">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" style={{ color: "var(--primary-500)" }} />
                <span className="font-bold" style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  02 24919869
                </span>
              </div>
              <span className="font-bold" style={{ color: "var(--text-muted)", fontSize: "13px" }}>|</span>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" style={{ color: "var(--primary-500)" }} />
                <span className="font-bold" style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  01271840097
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
