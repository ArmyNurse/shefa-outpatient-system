import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Type, Palette, X, Check, Play } from "lucide-react";

export type FontSize = "sm" | "md" | "lg";
export type ThemeName = "blue" | "emerald" | "rose";

interface Props {
  onStart: (settings: { fontSize: FontSize; theme: ThemeName }) => void;
  onCancel: () => void;
}

const themes: { name: ThemeName; label: string; color: string; desc: string }[] = [
  { name: "blue", label: "كلاسيك", color: "bg-blue-500", desc: "أزرق تقليدي" },
  { name: "emerald", label: "طبي", color: "bg-emerald-500", desc: "أخضر مريح" },
  { name: "rose", label: "أنيق", color: "bg-rose-500", desc: "وردي عصري" },
];

const fonts: { size: FontSize; label: string; desc: string; preview: string }[] = [
  { size: "sm", label: "صغير", desc: "14px", preview: "نص صغير" },
  { size: "md", label: "متوسط", desc: "16px", preview: "نص متوسط" },
  { size: "lg", label: "كبير", desc: "18px", preview: "نص كبير" },
];

export function DisplaySettings({ onStart, onCancel }: Props) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>("blue");
  const [selectedFont, setSelectedFont] = useState<FontSize>("md");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2.5 rounded-xl">
              <Monitor className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">إعدادات العرض التلقائي</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-300">ثيم الألوان</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTheme(t.name)}
                  className={`relative bg-slate-700/50 rounded-xl p-4 text-center border-2 transition-all ${
                    selectedTheme === t.name
                      ? "border-blue-500 bg-slate-700"
                      : "border-transparent hover:border-slate-600"
                  }`}
                >
                  {selectedTheme === t.name && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`w-10 h-10 ${t.color} rounded-full mx-auto mb-2 ring-2 ring-slate-600`} />
                  <p className="text-white text-sm font-bold">{t.label}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-300">حجم الخط</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {fonts.map((f) => (
                <button
                  key={f.size}
                  onClick={() => setSelectedFont(f.size)}
                  className={`relative bg-slate-700/50 rounded-xl p-4 text-center border-2 transition-all ${
                    selectedFont === f.size
                      ? "border-blue-500 bg-slate-700"
                      : "border-transparent hover:border-slate-600"
                  }`}
                >
                  {selectedFont === f.size && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <p className="text-white font-bold">{f.label}</p>
                  <p className="text-slate-400 text-xs mt-1">{f.desc}</p>
                  <p className="text-slate-600 text-[10px] mt-0.5">{f.preview}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl py-3 text-sm font-semibold transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={() => onStart({ theme: selectedTheme, fontSize: selectedFont })}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Play className="w-4 h-4" />
            بدء العرض
          </button>
        </div>
      </motion.div>
    </div>
  );
}
