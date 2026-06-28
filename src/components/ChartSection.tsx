import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Award, BarChart3, Info } from "lucide-react";
import { HistoryPoint, RateItem } from "../types";

interface ChartSectionProps {
  cc: string;
  historyData: HistoryPoint[];
  rateInfo?: RateItem;
  theme: "light" | "dark";
}

export default function ChartSection({ cc, historyData, rateInfo, theme }: ChartSectionProps) {
  const isDark = theme === "dark";

  if (!historyData || historyData.length === 0) {
    return (
      <div className={`border rounded-3xl p-8 flex flex-col items-center justify-center min-h-[350px] ${
        isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"
      }`}>
        <BarChart3 className={`h-12 w-12 animate-pulse mb-3 ${isDark ? "text-slate-700" : "text-slate-300"}`} />
        <p className="font-medium">Дані графіку наразі недоступні</p>
      </div>
    );
  }

  // Calculate statistics (Min, Max, Avg, Delta)
  const rates = historyData.map((d) => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const avgRate = rates.reduce((sum, r) => sum + r, 0) / rates.length;

  const currentRate = rates[rates.length - 1];
  const startRate = rates[0];
  const totalDeltaObj = currentRate - startRate;
  const isUp = totalDeltaObj >= 0;
  const totalDeltaPct = (totalDeltaObj / startRate) * 100;

  // Formatting NBU official name
  const officialName = rateInfo ? rateInfo.txt : "Валюта";

  // Customize Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as HistoryPoint;
      return (
        <div className={`rounded-xl p-3 shadow-lg border text-xs font-sans ${
          isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-900 text-white border-slate-800"
        }`}>
          <p className={`${isDark ? "text-slate-500" : "text-slate-400"} font-medium`}>
            {data.fullDate.replace(/(\d{4})(\d{2})(\d{2})/, "$3.$2.$1")}
          </p>
          <div className="flex items-baseline gap-1 mt-1 font-semibold text-sm">
            <span className="text-amber-400 text-base">{data.rate.toFixed(4)}</span>
            <span className={isDark ? "text-slate-400" : "text-slate-400"}>₴</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-200 ${
      isDark ? "bg-slate-900 border-slate-850 text-slate-100" : "bg-white border-slate-200 text-slate-900"
    }`}>
      
      {/* Top Details bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 mb-6 ${
        isDark ? "border-slate-800" : "border-slate-100"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
            <h2 className={`text-lg font-bold font-sans ${isDark ? "text-slate-100" : "text-slate-800"}`}>
              Тижнева динаміка курсу {cc}
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-450" : "text-slate-400"}`}>
            {officialName} • Офіційні котирування НБУ за останні 7 днів
          </p>
        </div>

        {/* Dynamic highlights */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`border rounded-xl px-3 py-1.5 flex flex-col ${
            isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
          }`}>
            <span className={`text-[10px] font-medium uppercase font-sans ${isDark ? "text-slate-500" : "text-slate-400"}`}>Максимум</span>
            <span className={`text-sm font-bold font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>{maxRate.toFixed(4)} ₴</span>
          </div>
          <div className={`border rounded-xl px-3 py-1.5 flex flex-col ${
            isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
          }`}>
            <span className={`text-[10px] font-medium uppercase font-sans ${isDark ? "text-slate-500" : "text-slate-400"}`}>Мінімум</span>
            <span className={`text-sm font-bold font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>{minRate.toFixed(4)} ₴</span>
          </div>
          <div className={`border rounded-xl px-3 py-1.5 flex flex-col ${
            isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
          }`}>
            <span className={`text-[10px] font-medium uppercase font-sans ${isDark ? "text-slate-500" : "text-slate-400"}`}>Середнє</span>
            <span className={`text-sm font-bold font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>{avgRate.toFixed(4)} ₴</span>
          </div>
        </div>
      </div>

      {/* Main chart visual container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Left side metrics summaries */}
        <div className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between border min-h-[140px] lg:min-h-auto ${
          isDark ? "bg-slate-950/40 border-slate-850" : "bg-slate-50/50 border-slate-100"
        }`}>
          <div>
            <span className={`text-xs uppercase tracking-widest font-semibold font-sans ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Зміна за тиждень
            </span>
            <p className={`text-2xl font-extrabold font-mono mt-1 ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
              {totalDeltaObj >= 0 ? "+" : ""}
              {totalDeltaObj.toFixed(4)} ₴
            </p>
            <p className={`text-xs font-bold font-mono mt-0.5 ${isUp ? "text-emerald-550" : "text-rose-550"}`}>
              ({totalDeltaObj >= 0 ? "+" : ""}
              {totalDeltaPct.toFixed(2)}%)
            </p>
          </div>

          <div className={`mt-4 pt-3 border-t text-[11px] space-y-2 ${
            isDark ? "border-slate-800 text-slate-400" : "border-slate-200/50 text-slate-500"
          }`}>
            <div className="flex justify-between">
              <span>Початковий курс:</span>
              <span className={`font-semibold font-mono ${isDark ? "text-slate-300" : "text-slate-750"}`}>{startRate.toFixed(4)} ₴</span>
            </div>
            <div className="flex justify-between">
              <span>Поточний курс:</span>
              <span className={`font-semibold font-mono ${isDark ? "text-slate-300" : "text-slate-750"}`}>{currentRate.toFixed(4)} ₴</span>
            </div>
          </div>
        </div>

        {/* Right side interactive graph component */}
        <div className="lg:col-span-3 min-h-[220px] sm:min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
              <XAxis
                dataKey="date"
                stroke={isDark ? "#475569" : "#94a3b8"}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke={isDark ? "#475569" : "#94a3b8"}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rateGradient)"
                activeDot={{ r: 6, strokeWidth: 0, fill: isDark ? "#475569" : "#e2e8f0" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className={`flex items-center gap-1.5 mt-4 text-[11px] rounded-lg py-1 px-3 w-fit ${
        isDark ? "text-slate-500 bg-slate-950/40" : "text-slate-400 bg-slate-50"
      }`}>
        <Info className="h-3 w-3 text-amber-500" />
        <span>Курс офіційно затверджується постановою правління НБУ. Графік показує реальний тижневий коридор значень.</span>
      </div>

    </div>
  );
}
