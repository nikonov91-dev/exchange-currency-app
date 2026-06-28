import React from "react";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { RateItem, HistoryPoint } from "../types";

interface MajorCardsProps {
  currentRates: RateItem[];
  history: Record<string, HistoryPoint[]>;
  selectedCC: string;
  onSelectCC: (cc: string) => void;
  theme: "light" | "dark";
}

const FLAG_EMOJIS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  PLN: "🇵🇱",
  GBP: "🇬🇧",
  CHF: "🇨🇭",
};

export default function MajorCards({
  currentRates,
  history,
  selectedCC,
  onSelectCC,
  theme,
}: MajorCardsProps) {
  // Select top 4 currencies to display in this quick-view panel
  const displayCurrencies = ["USD", "EUR", "PLN", "GBP"];

  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayCurrencies.map((cc) => {
        const rateObj = currentRates.find((r) => r.cc === cc);
        const codeHistory = history[cc] || [];
        
        if (!rateObj) return null;

        const currentRate = rateObj.rate;
        
        // Calculate 24h change relative to previous day in historical endpoints
        let changeAmount = 0;
        let changePercent = 0;
        let isUp = true;
        let changeText = "0.00%";

        if (codeHistory.length >= 2) {
          // chronological: yesterday is second to last, today is last
          const todayRate = codeHistory[codeHistory.length - 1]?.rate || currentRate;
          const yesterdayRate = codeHistory[codeHistory.length - 2]?.rate || currentRate;
          changeAmount = todayRate - yesterdayRate;
          changePercent = (changeAmount / yesterdayRate) * 100;
          isUp = changeAmount >= 0;
          changeText = `${isUp ? "+" : ""}${changePercent.toFixed(2)}%`;
        }

        const isSelected = selectedCC === cc;

        // Visual design parameters based on theme and selection
        let cardBgClass = "";
        let textCCClass = "";
        let textNameClass = "";
        let badgeClass = "";

        if (isDark) {
          if (isSelected) {
            cardBgClass = "bg-slate-950 border-amber-500 text-white shadow-lg shadow-amber-500/5 scale-[1.01]";
            textCCClass = "text-amber-400";
            textNameClass = "text-slate-300";
            badgeClass = "bg-slate-800 text-amber-400";
          } else {
            cardBgClass = "bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700 hover:bg-slate-850";
            textCCClass = "text-slate-200";
            textNameClass = "text-slate-400";
            badgeClass = "bg-slate-800/50 text-slate-400";
          }
        } else {
          if (isSelected) {
            cardBgClass = "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10 scale-[1.01]";
            textCCClass = "text-amber-400";
            textNameClass = "text-slate-400";
            badgeClass = "bg-slate-850 text-amber-400";
          } else {
            cardBgClass = "bg-white border-slate-200 text-slate-900 hover:border-amber-300 hover:shadow-md";
            textCCClass = "text-slate-800";
            textNameClass = "text-slate-500";
            badgeClass = "bg-amber-50 text-amber-600";
          }
        }

        return (
          <div
            key={cc}
            id={`major-card-${cc}`}
            onClick={() => onSelectCC(cc)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${cardBgClass}`}
          >
            {/* Top Row: Code and Flag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label={rateObj.txt}>
                  {FLAG_EMOJIS[cc] || "🏳️"}
                </span>
                <div>
                  <span className={`font-bold font-mono tracking-wider ${textCCClass}`}>
                    {cc}
                  </span>
                  <p className={`text-[11px] font-medium truncate max-w-[120px] ${textNameClass}`}>
                    {rateObj.txt}
                  </p>
                </div>
              </div>
              <span className={`rounded-full p-1.5 transition-colors ${badgeClass}`}>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {/* Mid Row: Rate Indicator */}
            <div className="mt-4">
              <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Курс НБУ
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                  {currentRate.toFixed(4)}
                </span>
                <span className={`text-sm font-bold ${isSelected ? "text-amber-400/80" : "text-slate-500"}`}>
                  ₴
                </span>
              </div>
            </div>

            {/* Bottom Row: Change Indicator & Small Sparkline */}
            <div className={`mt-4 flex items-center justify-between border-t border-dashed pt-3 ${
              isDark ? "border-slate-800" : "border-slate-200/20"
            }`}>
              <div className="flex items-center gap-1">
                {changeAmount !== 0 ? (
                  isUp ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                  )
                ) : (
                  <span className="text-slate-400 font-mono text-xs">-</span>
                )}
                <span className={`text-xs font-bold font-mono ${
                  changeAmount === 0 
                    ? "text-slate-400" 
                    : isUp 
                      ? "text-emerald-500" 
                      : "text-rose-500"
                }`}>
                  {changeAmount === 0 ? "без змін" : changeText}
                </span>
              </div>

              {/* Sparkline Visual representation directly via relative bars */}
              <div className="flex items-end gap-0.5 h-6">
                {codeHistory.map((pt, i) => {
                  // Percentage height scalar to show a tight bound sparkline
                  const min = Math.min(...codeHistory.map(p => p.rate));
                  const max = Math.max(...codeHistory.map(p => p.rate));
                  const range = max - min || 1;
                  const ratio = ((pt.rate - min) / range) * 80 + 20; // 20% to 100% height
                  return (
                    <div
                      key={i}
                      style={{ height: `${ratio}%` }}
                      className={`w-1 rounded-t-xs ${
                        isSelected
                          ? isUp
                            ? "bg-amber-400"
                            : "bg-rose-400"
                          : isUp
                            ? "bg-emerald-400/85"
                            : "bg-rose-400/85"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Highlight Accent */}
            {isSelected && (
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-amber-400" />
            )}
          </div>
        );
      })}
    </div>
  );
}
