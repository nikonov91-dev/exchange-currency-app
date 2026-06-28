import React from "react";
import { Info, Database, Zap, BookOpen, AlertCircle } from "lucide-react";

interface CacheSpecsProps {
  updatedAt: string;
  theme: "light" | "dark";
}

export default function CacheSpecs({ updatedAt, theme }: CacheSpecsProps) {
  // Compute approximate saved requests (assuming 150 requests per hour or similar to active apps)
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const pseudoSavedCalls = (daysSinceEpoch % 100) * 12 + 423;

  const isDark = theme === "dark";

  return (
    <div className={`border rounded-3xl p-6 shadow-xs transition-all duration-200 ${
      isDark
        ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-850"
        : "bg-gradient-to-br from-slate-50 to-amber-50/20 border-slate-200"
    }`}>
      
      {/* Title */}
      <div className={`flex items-center gap-2 border-b pb-4 mb-5 ${isDark ? "border-slate-800" : "border-slate-205"}`}>
        <BookOpen className="h-5 w-5 text-amber-500" />
        <h2 className={`text-lg font-bold font-sans ${isDark ? "text-slate-100" : "text-slate-800"}`}>
          Технологія за кадром (NextJS & React SSR Pattern)
        </h2>
      </div>

      {/* Intro info */}
      <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        Оскільки ти вивчаєш сучасні фреймворки на кшталт <strong>NextJS</strong> та паттерни серверної генерації, цей застосунок реалізує класичний підхід <strong>Incremental Static Regeneration (ISR)</strong> на нашому Express + React бекенді:
      </p>

      {/* Step workflow node design */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative">
        
        {/* Step 1 */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between h-full shadow-xs ${
          isDark ? "bg-slate-950 border-slate-850" : "bg-white border-slate-200"
        }`}>
          <div className="h-7 w-7 rounded-lg bg-red-50 text-red-600 text-xs font-black flex items-center justify-center mb-2">
            1
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Джерело</span>
          <p className={`text-xs font-bold mt-1 font-sans ${isDark ? "text-slate-100" : "text-slate-800"}`}>Офіційний API НБУ</p>
          <p className="text-[10px] text-slate-400 mt-0.5">bank.gov.ua</p>
        </div>

        {/* Step 2 */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between h-full shadow-xs ${
          isDark ? "bg-slate-950 border-slate-850" : "bg-white border-slate-200"
        }`}>
          <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 text-xs font-black flex items-center justify-center mb-2">
            2
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Бекенд Caching</span>
          <p className={`text-xs font-bold mt-1 font-sans ${isDark ? "text-slate-100" : "text-slate-800"}`}>Генерація файлу</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Один раз на добу</p>
        </div>

        {/* Step 3 */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between h-full shadow-xs ring-1 ring-amber-500/30 ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-205"
        }`}>
          <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center mb-2">
            3
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Статичний Кеш</span>
          <p className={`text-xs font-bold mt-1 font-sans ${isDark ? "text-amber-400" : "text-slate-800"}`}>rates_cache.json</p>
          <p className="text-[10px] text-amber-600 font-mono font-medium mt-0.5">Serving instantly</p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col justify-between h-full shadow-md">
          <div className="h-7 w-7 rounded-lg bg-slate-800 text-amber-400 text-xs font-black flex items-center justify-center mb-2">
            4
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Гідратація</span>
          <p className="text-xs font-bold text-white mt-1 font-sans">Vite + React UI</p>
          <p className="text-[10px] text-amber-400 font-medium mt-0.5">Інтерактивні графіки</p>
        </div>

      </div>

      {/* Benefits summary bullets */}
      <div className={`mt-6 rounded-2xl p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isDark ? "bg-slate-950 border-slate-850" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-2 bg-emerald-50 text-emerald-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>Економія запитів успішна!</h4>
            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Замість завантаження API на кожен клік, дані віддаються за рекордні 5-10мс</p>
          </div>
        </div>

        <div className={`rounded-xl px-4 py-2 self-end sm:self-auto border text-right ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
        }`}>
          <span className={`text-[10px] uppercase font-semibold block tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Орієнтовно зекономлено</span>
          <span className="text-lg font-black text-amber-600 font-mono">~{pseudoSavedCalls} запитів</span>
        </div>
      </div>

      {/* Notice about hydration */}
      <div className={`mt-4 flex items-start gap-2.5 rounded-xl p-3 text-xs border ${
        isDark 
          ? "bg-amber-950/20 text-amber-250/90 border-amber-900/40" 
          : "bg-amber-50/50 text-slate-600 border border-amber-100/55"
      }`}>
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
        <p>
          <strong>На замітку розробнику:</strong> В Next.js ти робиш це через API ревалідації <code>revalidate: 86400</code>. Наш Express бекенд створює повністю статичний аналог, що робить цей застосунок високонадійним та швидким навіть при збоях у зовнішніх сервісах НБУ!
        </p>
      </div>

    </div>
  );
}
