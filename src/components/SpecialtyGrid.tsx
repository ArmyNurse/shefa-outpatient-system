import { motion } from "framer-motion";
import {
  Stethoscope,
  Eye,
  Baby,
  Droplets,
  Ear,
  Bone,
  Brain,
  Heart,
  Microscope,
  Scan,
  Scissors,
  Activity,
  Pill,
  Dna,
  Shield,
  Search,
} from "lucide-react";
import type { Specialty } from "../types";

const iconMap: Record<string, React.ElementType> = {
  الباطنة: Stethoscope,
  الرمد: Eye,
  "الأسنان": Pill,
  الأطفال: Baby,
  "المسالك البولية": Droplets,
  الجلدية: Shield,
  "الأنف والأذن": Ear,
  "العلاج الطبيعى": Activity,
  "جراحة عامة": Scissors,
  "مخ وأعصاب": Brain,
  العظام: Bone,
  "نساء وتوليد": Heart,
  "موجات صوتية": Scan,
  "الإيكو": Microscope,
  تخاطب: Search,
  "جراحة تجميل": Dna,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" },
  }),
};

interface Props {
  specialties: Specialty[];
  onSelect: (s: Specialty) => void;
}

export function SpecialtyGrid({ specialties, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {specialties.map((s, i) => {
        const Icon = iconMap[s.specialty] || Stethoscope;
        return (
          <motion.button
            key={s.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(s)}
            className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-5 text-right transition-colors hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="absolute -top-3 -left-3 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:from-blue-500/30 group-hover:to-blue-600/20 transition-colors">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>

              <h3 className="text-white font-bold text-base sm:text-lg mb-1 group-hover:text-blue-300 transition-colors">
                {s.specialty}
              </h3>

              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                <span>{s.doctors.length} طبيب</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
