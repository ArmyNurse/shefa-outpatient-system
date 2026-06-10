import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, AlertCircle } from "lucide-react";

interface Props {
  onUnlock: (type: "lifetime" | "timed", expiresAt?: number) => void;
}

export function PasswordOverlay({ onUnlock }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.type === "lifetime") {
          sessionStorage.setItem("auth", "lifetime");
          onUnlock("lifetime");
        } else {
          const expiresAt = Date.now() + data.expiresIn;
          sessionStorage.setItem("auth", "timed");
          sessionStorage.setItem("expiresAt", String(expiresAt));
          onUnlock("timed", expiresAt);
        }
      } else {
        setError(data.error || "باسوورد غير صحيح");
        setPassword("");
      }
    } catch {
      setError("خطأ في الاتصال");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="w-full max-w-sm mx-4"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20 mb-4">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            مستشفي الشفاء التخصصي
          </h1>
          <p className="text-sm text-slate-400">يرجى إدخال كلمة المرور</p>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-red-300 text-sm font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="card" style={{ width: "100%" }}>
            <div className="terminal-header">
              <span className="terminal-title">
                <svg className="terminal-icon" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17l6-6-6-6M12 19h8" />
                </svg>
                Terminal
              </span>
            </div>
            <div className="terminal-body">
              <div className="command-line">
                <span className="prompt">password:</span>
                <div className="input-wrapper">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 rounded-xl text-base font-bold text-white transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            }}
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <div className="dev-card">
            <div className="dev-card-inner">
              <div className="dev-images">
                <img src="/assets/me.jpg" alt="Mario Faltas" className="dev-photo" />
                <img src="/assets/face.png" alt="Facebook" className="dev-face" />
              </div>
              <div className="dev-name">
                <img src="/assets/verify.png" alt="Verified" className="dev-verify" />
                Mario Faltas
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          للتواصل مع المطور لطلب كلمة المرور
        </p>

        <div className="flex items-center justify-center gap-2 mt-2">
          <a
            href="https://wa.me/201203269049"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            01203269049
          </a>
          <a
            href="https://wa.me/201069663958"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            01069663958
          </a>
          <a
            href="https://wa.me/201145963396"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            01145963396
          </a>
        </div>

        <style>{`
          .card {
            background-color: rgba(217, 217, 217, 0.18);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .terminal-header {
            background-color: #202425;
            padding: 10px 15px;
            display: flex;
            align-items: center;
          }

          .terminal-title {
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .terminal-icon {
            color: #006adc;
          }

          .terminal-body {
            background-color: #202425;
            color: #ffffff;
            padding: 15px;
            font-family: "Courier New", Courier, monospace;
          }

          .command-line {
            display: flex;
            align-items: center;
          }

          .prompt {
            color: #ffffff;
            margin-right: 10px;
            white-space: nowrap;
          }

          .input-wrapper {
            position: relative;
            flex-grow: 1;
          }

          .input-field {
            background-color: transparent;
            border: none;
            color: #006adc;
            font-family: inherit;
            font-size: 14px;
            outline: none;
            width: 100%;
            padding-right: 10px;
            caret-color: transparent;
          }

          .input-field::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          .input-wrapper::after {
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 15px;
            background-color: #ffffff;
            animation: blink 1s step-end infinite;
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          .dev-card {
            background: rgba(255,255,255,0.06);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 16px 28px;
            display: inline-flex;
          }

          .dev-card-inner {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .dev-images {
            position: relative;
            width: 52px;
            height: 52px;
          }

          .dev-photo {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.15);
            position: relative;
            z-index: 1;
          }

          .dev-face {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            position: absolute;
            bottom: -4px;
            right: -8px;
            z-index: 2;
            border: 2px solid #0f172a;
          }

          .dev-name {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #ffffff;
            font-size: 17px;
            font-weight: 800;
            letter-spacing: 0.3px;
          }

          .dev-verify {
            width: 20px;
            height: 20px;
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
