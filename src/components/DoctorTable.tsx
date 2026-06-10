import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, Info, User } from "lucide-react";
import type { Specialty } from "../types";

const rowVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" },
  }),
};

interface Props {
  specialty: Specialty;
  onBack: () => void;
}

export function DoctorTable({ specialty, onBack }: Props) {
  return (
    <div className="mt-6">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl border border-white/10 transition-colors text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          العودة
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-xl">
            <Stethoscope className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {specialty.specialty}
          </h2>
          <span className="bg-blue-500/10 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/20">
            {specialty.doctors.length} طبيب
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/50">
                <th className="text-blue-300 text-sm font-bold px-5 py-4 whitespace-nowrap">
                  اسم الطبيب
                </th>
                <th className="text-blue-300 text-sm font-bold px-5 py-4 whitespace-nowrap">
                  المواعيد
                </th>
                <th className="text-blue-300 text-sm font-bold px-5 py-4 whitespace-nowrap">
                  ملاحظات
                </th>
              </tr>
            </thead>
            <tbody>
              {specialty.doctors.map((doc, i) => (
                <motion.tr
                  key={i}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className={`border-b border-slate-800/50 last:border-0 transition-colors ${
                    i % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/40"
                  } hover:bg-slate-700/30`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-white font-bold text-base">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {doc.schedule && doc.schedule.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {doc.schedule.map((entry, idx) => (
                          <span
                            key={idx}
                            className="inline-flex flex-col items-center bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-500/20 min-w-[68px]"
                          >
                            <span>{entry.time}</span>
                            <span className="text-[10px] text-emerald-500/70 mt-0.5">{entry.day}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {doc.notes ? (
                      <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 text-sm px-3 py-1 rounded-lg border border-amber-500/20">
                        <Info className="w-3.5 h-3.5" />
                        {doc.notes}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {specialty.doctors.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            لا يوجد أطباء مسجلون في هذا التخصص
          </div>
        )}
      </motion.div>
    </div>
  );
}
