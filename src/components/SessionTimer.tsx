import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Props {
  expiresAt: number;
  onExpire: () => void;
}

export function SessionTimer({ expiresAt, onExpire }: Props) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const tick = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setDisplay("00:00");
        onExpire();
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setDisplay(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!display) return null;

  return (
    <div className="flex items-center gap-1.5 bg-amber-600/20 border border-amber-500/20 rounded-xl px-3 py-2 text-amber-300 font-bold text-sm font-mono" dir="ltr">
      <Clock className="w-3.5 h-3.5" />
      {display}
    </div>
  );
}
