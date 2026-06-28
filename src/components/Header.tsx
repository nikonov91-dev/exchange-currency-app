import React from "react";
import { RefreshCw, Activity, Calendar, Sun, Moon } from "lucide-react";

interface HeaderProps {
  updatedAt: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Header({
  updatedAt,
  isRefreshing,
  onRefresh,
  theme,
  onToggleTheme,
}: HeaderProps) {
  // Format readable Ukrainian date/time from ISO string
  const formatDateTime = (isoString: string) => {
    if (!isoString) return "---";
    try {
      const date = new Date(isoString);
      return date.toLocaleString("uk-UA", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Kyiv",
      });
    } catch (e) {
      return isoString;
    }
  };

  const isDark = theme === "dark";

  return (
    <header
      className={`border-b sticky top-0 z-50 transition-all duration-200 ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white shadow-md shadow-slate-950/20"
          : "bg-white border-slate-200 text-slate-900 shadow-xs backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20 transform hover:scale-105 transition-transform">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight font-sans ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                Курс Валют НБУ
              </h1>
              <span className={`hidden sm:inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
                isDark 
                  ? "bg-amber-950/40 text-amber-400 ring-amber-400/20" 
                  : "bg-amber-50 text-amber-700 ring-amber-700/10"
              }`}>
                Офіційні дані
              </span>
            </div>
            <p className={`text-xs sm:text-sm font-sans mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Моніторинг стабільності гривні від Національного банку
            </p>
          </div>
        </div>

        {/* Sync Controls & Theme Switcher */}
        <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
          
          {/* Day/Night Theme Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all active:scale-95 flex items-center justify-center ${
              isDark
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750 hover:text-amber-300"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
            title={isDark ? "Перемкнути на світлу тему" : "Перемкнути на темну тему"}
          >
            {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2 border transition-colors ${
            isDark
              ? "bg-slate-950 border-slate-850 text-slate-200"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <Calendar className="h-4 w-4 text-amber-500" />
            <div className="text-left">
              <p className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Останнє кешування
              </p>
              <p className="text-xs font-semibold font-mono">
                {formatDateTime(updatedAt)}
              </p>
            </div>
          </div>

          <button
            id="refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-all cursor-pointer disabled:opacity-55 active:scale-95 ${
              isRefreshing ? "hover:bg-amber-500" : ""
            }`}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : "hover:rotate-45 transition-transform"}`}
            />
            <span>{isRefreshing ? "Оновлення..." : "Оновити"}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
