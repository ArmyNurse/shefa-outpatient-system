import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Save, ArrowLeft, MapPin, Phone, User, LogOut } from "lucide-react";
import { registerSaveOnExpire, unregisterSaveOnExpire } from "../App";

interface SpecialtyData {
  id: string;
  specialty: string;
  bookingNotes: string;
  doctors: {
    name: string;
    schedule: { day: string; time: string }[];
    notes: string;
  }[];
}

interface Props {
  onBack: () => void;
}

export function AdminPage({ onBack }: Props) {
  const [data, setData] = useState<SpecialtyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    fetch("/api/admin/doctors")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRef.current, null, 2),
      });
      if (res.ok) {
        setMessage("✅ تم الحفظ بنجاح");
      } else {
        setMessage("❌ فشل الحفظ");
      }
    } catch {
      setMessage("❌ خطأ في الاتصال");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    registerSaveOnExpire(save);
    return () => unregisterSaveOnExpire();
  }, []);

  const updateDoctor = (specIdx: number, docIdx: number, field: string, value: any) => {
    const newData = [...data];
    (newData[specIdx].doctors[docIdx] as any)[field] = value;
    setData(newData);
  };

  const addScheduleEntry = (specIdx: number, docIdx: number) => {
    const newData = [...data];
    newData[specIdx].doctors[docIdx].schedule.push({ day: "", time: "" });
    setData(newData);
  };

  const removeScheduleEntry = (specIdx: number, docIdx: number, schedIdx: number) => {
    const newData = [...data];
    newData[specIdx].doctors[docIdx].schedule.splice(schedIdx, 1);
    setData(newData);
  };

  const updateScheduleEntry = (specIdx: number, docIdx: number, schedIdx: number, field: string, value: string) => {
    const newData = [...data];
    (newData[specIdx].doctors[docIdx].schedule[schedIdx] as any)[field] = value;
    setData(newData);
  };

  const endSession = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("expiresAt");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl border border-white/10 transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </button>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-2xl shadow-lg">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة الإدارة</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
            <button
              onClick={endSession}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 px-4 py-2.5 rounded-xl border border-red-500/20 text-sm font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              إنهاء الجلسة
            </button>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 text-lg font-bold"
            style={{ color: message.includes("✅") ? "#34d399" : "#f87171" }}
          >
            {message}
          </motion.div>
        )}

        <div className="space-y-6">
          {data.map((spec, specIdx) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: specIdx * 0.03 }}
              className="rounded-2xl border border-white/10 overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{spec.specialty}</h2>
              </div>

              <div className="divide-y divide-white/5">
                {spec.doctors.map((doc, docIdx) => (
                  <div key={docIdx} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 font-semibold mb-1">اسم الطبيب</label>
                        <input
                          value={doc.name}
                          onChange={(e) => updateDoctor(specIdx, docIdx, "name", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-sm"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 font-semibold mb-1">المواعيد</label>
                        <div className="space-y-1.5">
                          {doc.schedule.map((entry, sIdx) => (
                            <div key={sIdx} className="flex gap-1.5 items-center">
                              <input
                                value={entry.day}
                                onChange={(e) => updateScheduleEntry(specIdx, docIdx, sIdx, "day", e.target.value)}
                                placeholder="اليوم"
                                className="flex-1 px-2 py-1.5 rounded-lg border text-xs"
                                style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "#fff", minWidth: 0 }}
                              />
                              <input
                                value={entry.time}
                                onChange={(e) => updateScheduleEntry(specIdx, docIdx, sIdx, "time", e.target.value)}
                                placeholder="الوقت"
                                className="flex-1 px-2 py-1.5 rounded-lg border text-xs"
                                style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "#fff", minWidth: 0 }}
                              />
                              <button
                                onClick={() => removeScheduleEntry(specIdx, docIdx, sIdx)}
                                className="text-red-400 hover:text-red-300 text-sm shrink-0 px-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addScheduleEntry(specIdx, docIdx)}
                            className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                          >
                            + إضافة موعد
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 font-semibold mb-1">ملاحظات</label>
                        <input
                          value={doc.notes}
                          onChange={(e) => updateDoctor(specIdx, docIdx, "notes", e.target.value)}
                          placeholder="ملاحظات الحجز"
                          className="w-full px-3 py-2 rounded-lg border text-sm"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 py-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400 font-bold text-xs">ش الاربعين, عين شمس الغربية, القاهرة</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                <circle cx="12" cy="12" r="11" fill="#1877F2" />
                <path d="M10.5 16.5L6 12l1.5-1.5 3 3 6-6L18 9l-7.5 7.5z" fill="white" />
              </svg>
              <span className="text-slate-400 font-bold text-xs">Created By Mario Faltas</span>
            </div>

            <div className="flex items-center gap-3" dir="ltr">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400 font-bold text-xs">02 24919869</span>
              </div>
              <span className="text-slate-600 text-xs">|</span>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400 font-bold text-xs">01271840097</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
