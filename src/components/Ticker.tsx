import React from "react";
import { Info } from "lucide-react";

const TICKER_MESSAGES = [
  "يرجى التوجه إلى العيادة المحددة قبل موعدك بـ 15 دقيقة",
  "تذكر إحضار تقاريرك الطبية وأشعتك السابقة",
  "للاستفسار يرجى الاتصال بالاستقبال على رقم 0123456789",
  ".يمكنكم متابعة مواعيدكم لحظة بلحظة عبر هذه الشاشة",
  "نتمنى لكم الشفاء العاجل وصحة دائمة",
];

export const Ticker: React.FC = () => {
  const fullText = TICKER_MESSAGES.join("    •    ");

  return (
    <div className="absolute bottom-10 left-0 right-0 z-10">
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border-t border-b border-sky-500/20 py-2.5 overflow-hidden">
        <div className="relative flex" style={{ direction: "ltr" }}>
          <div className="flex items-center gap-2 px-4 bg-sky-600/20 border-l border-sky-500/30 z-10">
            <Info className="w-5 h-5 text-sky-400 shrink-0" />
            <span className="text-sky-300 text-sm font-bold whitespace-nowrap">
              تنبيهات
            </span>
          </div>
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-4" style={{ direction: "rtl" }}>
              <span className="text-blue-100/80 text-lg font-medium mx-4">
                {fullText}
              </span>
              <span className="text-blue-100/80 text-lg font-medium mx-4">
                {fullText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
