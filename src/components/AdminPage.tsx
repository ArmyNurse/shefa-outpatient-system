import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse, Save, ArrowLeft, MapPin, Phone, LogOut,
  Plus, Trash2, User, Clock, FileText, Stethoscope, Database, ToggleLeft, ToggleRight
} from "lucide-react";
import { registerSaveOnExpire, unregisterSaveOnExpire } from "../App";
import { Toast } from "./Toast";

const TITLE_OPTIONS = ["ملاحظات", "ملاحظة", "تنبيه", "تنويه", "وصل حديثاً"];

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
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null);
  const [blobAvailable, setBlobAvailable] = useState<boolean | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ specIdx: number; docIdx: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"specs" | "notes">("specs");
  const [notesData, setNotesData] = useState({ title: "تنويه", bookingNotes: "", enabled: true, entries: [] as { doctor: string; specialty: string; times: string[]; note: string }[] });
  const [newEntryDoctor, setNewEntryDoctor] = useState("");
  const [newEntrySpecialty, setNewEntrySpecialty] = useState("");
  const [newEntryTime, setNewEntryTime] = useState("");
  const [newEntryTimes, setNewEntryTimes] = useState<string[]>([]);
  const [newEntryNote, setNewEntryNote] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const dataRef = useRef(data);

  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    fetch("/api/admin/doctors")
      .then(async (r) => {
        setBlobAvailable(r.headers.get("X-Blob-Available") === "true");
        const d = await r.json();
        const arr = Array.isArray(d) ? d : [];
        setData(arr);
        if (arr.length > 0) setSelectedSpecId(arr[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object") {
          setNotesData({ title: d.title || "تنويه", bookingNotes: d.bookingNotes || "", enabled: d.enabled !== false, entries: d.entries || [] });
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRef.current, null, 2),
      });
      const result = await res.json();
      if (res.ok) {
        setBlobAvailable(result.blob === true);
        setToast(result.blob
          ? { type: "success", message: "تم الحفظ الدائم بنجاح" }
          : { type: "warning", message: "تم الحفظ مؤقتاً (فقط لهذا الجهاز)" }
        );
      } else {
        setToast({ type: "error", message: "فشل الحفظ" });
      }
    } catch {
      setToast({ type: "error", message: "خطأ في الاتصال" });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    registerSaveOnExpire(save);
    return () => unregisterSaveOnExpire();
  }, []);

  const selectedSpec = data.find((s) => s.id === selectedSpecId);
  const selectedIdx = data.findIndex((s) => s.id === selectedSpecId);

  const addSpecialty = () => {
    const id = `spec-${Date.now()}`;
    const name = prompt("اسم التخصص الجديد:");
    if (!name || !name.trim()) return;
    setData((prev) => [...prev, { id, specialty: name.trim(), bookingNotes: "", doctors: [] }]);
    setSelectedSpecId(id);
    setActiveTab("specs");
  };

  const addDoctor = (specIdx: number) => {
    const newData = [...data];
    newData[specIdx].doctors.push({ name: "", schedule: [{ day: "", time: "" }], notes: "" });
    setData(newData);
  };

  const deleteDoctor = (specIdx: number, docIdx: number) => {
    const newData = [...data];
    newData[specIdx].doctors.splice(docIdx, 1);
    setData(newData);
    setDeleteConfirm(null);
  };

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

  const updateBookingNotes = (specIdx: number, value: string) => {
    const newData = [...data];
    newData[specIdx].bookingNotes = value;
    setData(newData);
  };

  const endSession = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("expiresAt");
    window.location.reload();
  };

  const addTimeToNew = () => {
    if (!newEntryTime.trim()) return;
    setNewEntryTimes((prev) => [...prev, newEntryTime.trim()]);
    setNewEntryTime("");
  };

  const removeTimeFromNew = (idx: number) => {
    setNewEntryTimes((prev) => prev.filter((_, i) => i !== idx));
  };

  const addEntryToNotes = () => {
    if (!newEntryDoctor && !newEntrySpecialty && newEntryTimes.length === 0 && !newEntryNote) return;
    setNotesData((prev) => ({
      ...prev,
      entries: [...prev.entries, { doctor: newEntryDoctor, specialty: newEntrySpecialty, times: newEntryTimes, note: newEntryNote }],
    }));
    setNewEntryDoctor("");
    setNewEntrySpecialty("");
    setNewEntryTimes([]);
    setNewEntryNote("");
  };

  const removeEntryFromNotes = (idx: number) => {
    setNotesData((prev) => ({ ...prev, entries: prev.entries.filter((_, i) => i !== idx) }));
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    setToast(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notesData, null, 2),
      });
      if (res.ok) {
        setToast({ type: "success", message: "تم حفظ الملاحظات بنجاح" });
      } else {
        setToast({ type: "error", message: "فشل حفظ الملاحظات" });
      }
    } catch {
      setToast({ type: "error", message: "خطأ في الاتصال" });
    }
    setSavingNotes(false);
    setTimeout(() => setToast(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-semibold">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0b1121 0%, #0f172a 50%, #0b1121 100%)" }}>
      <Toast show={!!toast} type={toast?.type || "success"} message={toast?.message || ""} onDismiss={() => setToast(null)} />

      {/* ─── Header ─── */}
      <div className="sticky top-0 z-20 border-b border-white/5" style={{ background: "rgba(11,17,33,0.85)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-2 rounded-xl border border-white/10 transition-all text-sm">
                <ArrowLeft className="w-4 h-4" />
                العودة
              </button>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white">لوحة الإدارة</h1>
                <p className="text-xs text-slate-500">
                  {activeTab === "notes"
                    ? `ملاحظات - ${notesData.entries.length} مدخل`
                    : `${data.length} تخصص - ${data.reduce((a, s) => a + s.doctors.length, 0)} دكتور`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "specs" && (
                <button onClick={addSpecialty} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all">
                  <Plus className="w-3.5 h-3.5" />
                  إضافة تخصص
                </button>
              )}
              {activeTab === "specs" && (
                <button onClick={save} disabled={saving} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              )}
              {activeTab === "notes" && (
                <button onClick={saveNotes} disabled={savingNotes}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" />
                  {savingNotes ? "جاري الحفظ..." : "حفظ الملاحظات"}
                </button>
              )}
              <button onClick={endSession} className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-2 rounded-xl border border-red-500/20 text-xs font-bold transition-all">
                <LogOut className="w-3.5 h-3.5" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ─── Blob warning ─── */}
        {blobAvailable === false && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 py-2.5 px-4 rounded-xl text-sm font-semibold text-center"
            style={{ backgroundColor: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
            ⚠️ تم التخزين مؤقتاً. قم بتمكين Netlify Blob Storage من لوحة تحكم Netlify للحفظ الدائم
          </motion.div>
        )}

        {/* ─── Tabs ─── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.map((spec) => (
            <button key={spec.id} onClick={() => { setActiveTab("specs"); setSelectedSpecId(spec.id); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeTab === "specs" && selectedSpecId === spec.id
                ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"}`}>
              <Stethoscope className="w-4 h-4" />
              {spec.specialty}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "specs" && selectedSpecId === spec.id ? "bg-white/20" : "bg-white/10"}`}>
                {spec.doctors.length}
              </span>
            </button>
          ))}
          <button onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeTab === "notes"
              ? "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/20"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"}`}>
            <FileText className="w-4 h-4" />
            ملاحظات
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "notes" ? "bg-white/20" : "bg-white/10"}`}>{notesData.entries.length}</span>
          </button>
        </div>

        {/* ─── Panel ─── */}
        <AnimatePresence mode="wait">
          {activeTab === "notes" ? (
            <motion.div key="notes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>

              {/* Notes header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2.5 rounded-xl shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">إدارة الملاحظات</h2>
                    <p className="text-xs text-slate-500">{notesData.entries.length} مدخل</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-slate-300 font-semibold">{notesData.enabled ? "مفعل" : "معطل"}</span>
                  <button onClick={() => setNotesData((prev) => ({ ...prev, enabled: !prev.enabled }))}>
                    {notesData.enabled
                      ? <ToggleRight className="w-7 h-7 text-emerald-400" />
                      : <ToggleLeft className="w-7 h-7 text-slate-500" />}
                  </button>
                </label>
              </div>

              {/* Title + Booking notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1.5">عنوان الصفحة</label>
                  <select value={notesData.title} onChange={(e) => setNotesData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}>
                    {TITLE_OPTIONS.map((t) => (
                      <option key={t} value={t} style={{ background: "#1e293b", color: "#fff" }}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1.5">ملاحظات الحجز</label>
                  <input value={notesData.bookingNotes} onChange={(e) => setNotesData((prev) => ({ ...prev, bookingNotes: e.target.value }))}
                    placeholder="اختياري"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
              </div>

              {/* Add entry */}
              <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <h3 className="text-sm font-bold text-slate-300 mb-4">إضافة مدخل جديد</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input value={newEntryDoctor} onChange={(e) => setNewEntryDoctor(e.target.value)}
                    placeholder="اسم الدكتور"
                    className="px-3 py-2 rounded-lg border text-sm outline-none transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                  <input value={newEntrySpecialty} onChange={(e) => setNewEntrySpecialty(e.target.value)}
                    placeholder="التخصص"
                    className="px-3 py-2 rounded-lg border text-sm outline-none transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newEntryTimes.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                      {t}
                      <button onClick={() => removeTimeFromNew(i)} className="text-red-400 hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  <input value={newEntryTime} onChange={(e) => setNewEntryTime(e.target.value)}
                    placeholder="أضف موعد (مثال: الخميس 4:00 م)"
                    className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}
                    onKeyDown={(e) => { if (e.key === "Enter") addTimeToNew(); }}
                  />
                  <button onClick={addTimeToNew}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all">إضافة</button>
                </div>
                <input value={newEntryNote} onChange={(e) => setNewEntryNote(e.target.value)}
                  placeholder="نص الملاحظة"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all mb-3"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}
                />
                <button onClick={addEntryToNotes}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                  <Plus className="w-3.5 h-3.5 inline ml-1" />
                  إضافة مدخل
                </button>
              </div>

              {/* Entries list */}
              {notesData.entries.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-semibold">لا توجد مدخلات ملاحظات</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notesData.entries.map((entry, i) => (
                    <motion.div key={i} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="rounded-2xl border p-4" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex gap-2 flex-wrap items-center">
                            <span className="text-white text-base font-bold">{entry.doctor || "—"}</span>
                            {entry.specialty && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>{entry.specialty}</span>}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {entry.times.map((t, ti) => (
                              <span key={ti} className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>{t}</span>
                            ))}
                          </div>
                          {entry.note && <p className="text-sm text-slate-400 mt-1">{entry.note}</p>}
                        </div>
                        <button onClick={() => removeEntryFromNotes(i)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-xl transition-all shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : selectedSpec && selectedIdx !== -1 ? (
            <motion.div key={selectedSpec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>

              {/* Specialty header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2.5 rounded-xl shadow-lg">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedSpec.specialty}</h2>
                    <p className="text-xs text-slate-500">{selectedSpec.doctors.length} دكتور</p>
                  </div>
                </div>
                <button onClick={() => addDoctor(selectedIdx)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                  <Plus className="w-4 h-4" />
                  إضافة دكتور
                </button>
              </div>

              {/* Booking notes */}
              <div className="mb-5">
                <label className="block text-xs text-slate-400 font-semibold mb-1.5">ملاحظات الحجز للتخصص</label>
                <input value={selectedSpec.bookingNotes} onChange={(e) => updateBookingNotes(selectedIdx, e.target.value)}
                  placeholder="ملاحظات عامة للحجز في هذا التخصص"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}
                />
              </div>

              {/* Doctors */}
              {selectedSpec.doctors.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
                  <User className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-semibold">لا يوجد أطباء في هذا التخصص</p>
                  <p className="text-slate-600 text-xs mt-1">اضغط "إضافة دكتور" لإضافة أول دكتور</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSpec.doctors.map((doc, docIdx) => (
                    <motion.div key={docIdx} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="rounded-2xl border overflow-hidden transition-all"
                      style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>

                      {/* Doctor row */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <input value={doc.name} onChange={(e) => updateDoctor(selectedIdx, docIdx, "name", e.target.value)}
                                placeholder="اسم الدكتور"
                                className="w-full bg-transparent border-b-2 text-base font-bold outline-none transition-all"
                                style={{ borderColor: doc.name ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)", color: "#fff" }}
                              />
                            </div>
                          </div>
                          <button onClick={() => setDeleteConfirm({ specIdx: selectedIdx, docIdx })}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-xl transition-all shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Delete confirmation */}
                        {deleteConfirm?.specIdx === selectedIdx && deleteConfirm?.docIdx === docIdx && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            className="mb-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            <span className="text-red-300 text-sm font-semibold">هل أنت متأكد من حذف هذا الدكتور؟</span>
                            <button onClick={() => deleteDoctor(selectedIdx, docIdx)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">نعم، احذف</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-slate-400 hover:text-white text-xs font-bold transition-all">إلغاء</button>
                          </motion.div>
                        )}

                        {/* Schedule + Notes grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          {/* Schedule */}
                          <div>
                            <label className="block text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              المواعيد
                            </label>
                            <div className="space-y-2">
                              {doc.schedule.map((entry, sIdx) => (
                                <div key={sIdx} className="flex gap-2 items-center">
                                  <input value={entry.day} onChange={(e) => updateScheduleEntry(selectedIdx, docIdx, sIdx, "day", e.target.value)}
                                    placeholder="اليوم (مثال: سبت)"
                                    className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-all"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff", minWidth: 0 }}
                                  />
                                  <input value={entry.time} onChange={(e) => updateScheduleEntry(selectedIdx, docIdx, sIdx, "time", e.target.value)}
                                    placeholder="الوقت (مثال: 6م)"
                                    className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-all"
                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff", minWidth: 0 }}
                                  />
                                  <button onClick={() => removeScheduleEntry(selectedIdx, docIdx, sIdx)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all shrink-0">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button onClick={() => addScheduleEntry(selectedIdx, docIdx)}
                                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-all">
                                <Plus className="w-3.5 h-3.5" />
                                إضافة موعد
                              </button>
                            </div>
                          </div>

                          {/* Doctor notes */}
                          <div>
                            <label className="block text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              ملاحظات
                            </label>
                            <textarea value={doc.notes} onChange={(e) => updateDoctor(selectedIdx, docIdx, "notes", e.target.value)}
                              placeholder="ملاحظات الحجز الخاصة بالدكتور"
                              rows={3}
                              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all resize-none"
                              style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#fff" }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-24 border-2 border-dashed border-white/5 rounded-2xl">
              <Database className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-bold mb-1">لم يتم اختيار تخصص</p>
              <p className="text-slate-600 text-sm">اختر تخصصاً من القائمة أعلاه أو أضف تخصصاً جديداً</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Footer ─── */}
        <div className="mt-10 border-t border-white/5 py-6">
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
