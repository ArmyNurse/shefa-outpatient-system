import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Grid3X3, Shield, LogOut } from "lucide-react";
import { Header } from "./components/Header";
import { SpecialtyGrid } from "./components/SpecialtyGrid";
import { DoctorTable } from "./components/DoctorTable";
import { DisplayScreen } from "./components/DisplayScreen";
import { DisplaySettings } from "./components/DisplaySettings";
import { Footer } from "./components/Footer";
import { PasswordOverlay } from "./components/PasswordOverlay";
import { AdminPage } from "./components/AdminPage";
import { SessionTimer } from "./components/SessionTimer";
import type { FontSize, ThemeName } from "./components/DisplaySettings";
import scheduleStatic from "./data/schedule.json";
import notesConfig from "./data/notes.json";
import type { Specialty, NotesEntry } from "./types";

function getInitialAuth(): { authed: boolean; type?: "lifetime" | "timed"; expiresAt?: number } {
  const auth = sessionStorage.getItem("auth");
  if (!auth) return { authed: false };
  if (auth === "lifetime") return { authed: true, type: "lifetime" };
  if (auth === "timed") {
    const exp = sessionStorage.getItem("expiresAt");
    if (exp && Date.now() < Number(exp)) {
      return { authed: true, type: "timed", expiresAt: Number(exp) };
    }
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("expiresAt");
    return { authed: false };
  }
  return { authed: false };
}

let saveOnExpire: (() => Promise<void>) | null = null;

export function registerSaveOnExpire(fn: () => Promise<void>) {
  saveOnExpire = fn;
}

export function unregisterSaveOnExpire() {
  saveOnExpire = null;
}

export default function App() {
  const initial = getInitialAuth();
  const [authenticated, setAuthenticated] = useState(initial.authed);
  const [sessionType, setSessionType] = useState<"lifetime" | "timed" | null>(initial.type || null);
  const [expiresAt, setExpiresAt] = useState<number | undefined>(initial.expiresAt);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [schedule, setSchedule] = useState<Specialty[]>(scheduleStatic);
  const prevAdminRef = useRef(showAdmin);
  const [displaySettings, setDisplaySettings] = useState<{
    fontSize: FontSize;
    theme: ThemeName;
  } | null>(null);

  const selectedRef = useRef(selectedSpecialty);
  selectedRef.current = selectedSpecialty;

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSchedule(data);
        const sel = selectedRef.current;
        if (sel) {
          const updated = data.find((s: Specialty) => s.id === sel.id);
          if (updated) setSelectedSpecialty(updated);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  useEffect(() => {
    if (prevAdminRef.current && !showAdmin) {
      fetchSchedule();
    }
    prevAdminRef.current = showAdmin;
  }, [showAdmin, fetchSchedule]);

  const handleUnlock = useCallback((type: "lifetime" | "timed", exp?: number) => {
    setSessionType(type);
    if (exp) setExpiresAt(exp);
    else setExpiresAt(undefined);
    setAuthenticated(true);
  }, []);

  const handleExpire = useCallback(async () => {
    if (saveOnExpire) {
      await saveOnExpire();
    }
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("expiresAt");
    setAuthenticated(false);
    setSessionType(null);
    setExpiresAt(undefined);
    setShowAdmin(false);
  }, []);

  if (!authenticated) {
    return <PasswordOverlay onUnlock={handleUnlock} />;
  }

  if (showAdmin) {
    return <AdminPage onBack={() => setShowAdmin(false)} />;
  }

  if (displaySettings) {
    return (
      <DisplayScreen
        settings={displaySettings}
        onExit={() => setDisplaySettings(null)}
        schedule={schedule}
        notesConfig={notesConfig}
      />
    );
  }

  const endSession = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("expiresAt");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header>
        <button
          onClick={() => setShowAdmin(true)}
          className="flex items-center gap-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-3 py-2 rounded-xl border border-amber-500/20 transition-colors text-sm font-semibold"
        >
          <Shield className="w-4 h-4" />
          الإدارة
        </button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors text-sm font-semibold shadow-lg shadow-blue-500/20"
        >
          <Monitor className="w-4 h-4" />
          عرض تلقائي
        </motion.button>
        {sessionType === "timed" && expiresAt && (
          <SessionTimer expiresAt={expiresAt} onExpire={handleExpire} />
        )}
        <button
          onClick={endSession}
          className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-2 rounded-xl border border-red-500/20 transition-colors text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          إنهاء الجلسة
        </button>
      </Header>

      {showSettings && (
        <DisplaySettings
          onStart={(settings) => {
            setDisplaySettings(settings);
            setShowSettings(false);
          }}
          onCancel={() => setShowSettings(false)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnimatePresence mode="wait">
          {selectedSpecialty ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorTable
                specialty={selectedSpecialty}
                onBack={() => setSelectedSpecialty(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8 mt-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    اختر التخصص لعرض المواعيد
                  </h2>
                  <p className="text-slate-400 text-base">
                    {schedule.length} تخصص طبي -{" "}
                    {schedule.reduce((a, s) => a + s.doctors.length, 0)} طبيب
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <Grid3X3 className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400 text-xs">عرض شبكي</span>
                </div>
              </div>
              <SpecialtyGrid
                specialties={schedule}
                onSelect={setSelectedSpecialty}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
