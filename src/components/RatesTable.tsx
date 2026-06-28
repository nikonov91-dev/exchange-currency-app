import React, { useState } from "react";
import { Search, Star, HelpCircle, ArrowRightLeft, TrendingUp } from "lucide-react";
import { RateItem } from "../types";

interface RatesTableProps {
  rates: RateItem[];
  selectedCC: string;
  onSelectCC: (cc: string) => void;
  favorites: string[];
  onToggleFavorite: (cc: string) => void;
  theme: "light" | "dark";
}

const FLAG_RECORDS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  PLN: "🇵🇱",
  GBP: "🇬🇧",
  CHF: "🇨🇭",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  CNY: "🇨🇳",
  JPY: "🇯🇵",
  CZK: "🇨🇿",
  DKK: "🇩🇰",
  HUF: "🇭🇺",
  ILS: "🇮🇱",
  LTL: "🇱🇹",
  NOK: "🇳🇴",
  SEK: "🇸🇪",
  SGD: "🇸🇬",
  TRY: "🇹🇷",
  UAH: "🇺🇦",
  NZD: "🇳🇿",
};

export default function RatesTable({
  rates,
  selectedCC,
  onSelectCC,
  favorites,
  onToggleFavorite,
  theme,
}: RatesTableProps) {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "major" | "favorites">("all");

  const majorCurrencies = ["USD", "EUR", "PLN", "GBP", "CHF"];
  const isDark = theme === "dark";

  // Filter combined lists
  const filteredRates = rates.filter((r) => {
    // Search matching
    const matchesSearch =
      r.cc.toLowerCase().includes(search.toLowerCase()) ||
      r.txt.toLowerCase().includes(search.toLowerCase());

    // Tab filter matching
    if (filterTab === "major") {
      return matchesSearch && majorCurrencies.includes(r.cc);
    }
    if (filterTab === "favorites") {
      return matchesSearch && favorites.includes(r.cc);
    }
    return matchesSearch;
  });

  return (
    <div className={`border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-200 ${
      isDark ? "bg-slate-900 border-slate-850 text-slate-100" : "bg-white border-slate-200 text-slate-900"
    }`}>
      
      {/* Table search & tabs headers */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-5 ${
        isDark ? "border-slate-800" : "border-slate-100"
      }`}>
        <div>
          <h2 className="text-lg font-bold font-sans">
            Перелік курсів котирувань
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Знайдено {filteredRates.length} з {rates.length} валют
          </p>
        </div>

        {/* Search tool */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            id="search-cc-input"
            type="text"
            placeholder="Шукати код чи назву..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-sm border rounded-2xl focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              isDark 
                ? "bg-slate-950 border-slate-850 text-slate-100 placeholder-slate-600" 
                : "text-slate-800 border-slate-200 placeholder-slate-400"
            }`}
          />
        </div>
      </div>

      {/* Tabs navigation */}
      <div className={`flex space-x-2 border-b pb-3 mb-4 overflow-x-auto scroller-hidden ${
        isDark ? "border-slate-800" : "border-slate-100"
      }`}>
        <button
          id="filter-all-btn"
          onClick={() => setFilterTab("all")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            filterTab === "all"
              ? isDark 
                ? "bg-slate-100 text-slate-950 shadow-xs font-extrabold" 
                : "bg-slate-900 text-white shadow-xs"
              : isDark
                ? "bg-slate-950 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-850"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          Усі валюти ({rates.length})
        </button>
        <button
          id="filter-major-btn"
          onClick={() => setFilterTab("major")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            filterTab === "major"
              ? isDark 
                ? "bg-slate-100 text-slate-950 shadow-xs font-extrabold" 
                : "bg-slate-900 text-white shadow-xs"
              : isDark
                ? "bg-slate-950 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-850"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          Популярні ({rates.filter(r => majorCurrencies.includes(r.cc)).length})
        </button>
        <button
          id="filter-favorites-btn"
          onClick={() => setFilterTab("favorites")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
            filterTab === "favorites"
              ? "bg-amber-400 text-slate-950 shadow-xs"
              : isDark
                ? "bg-slate-950 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-850"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <Star className="h-3 w-3 fill-current" />
          <span>Обрані ({favorites.length})</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className={`overflow-x-auto rounded-2xl border max-h-[460px] overflow-y-auto ${
        isDark ? "border-slate-850 bg-slate-900" : "border-slate-100 bg-white"
      }`}>
        <table className={`min-w-full divide-y text-left ${
          isDark ? "divide-slate-800" : "divide-slate-100"
        }`}>
          <thead className={`sticky top-0 z-10 ${isDark ? "bg-slate-950/90 text-slate-400" : "bg-slate-50"}`}>
            <tr>
              <th scope="col" className="w-12 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center">
                Обране
              </th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-20">
                Код
              </th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">
                Назва валюти
              </th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-right w-36">
                Курс НБУ (UAH)
              </th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center w-28">
                Графік
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-slate-800 bg-slate-900" : "divide-slate-100 bg-white"}`}>
            {filteredRates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400 font-medium">
                  Валюту не знайдено за заданими параметрами фільтру
                </td>
              </tr>
            ) : (
              filteredRates.map((r) => {
                const isFavorite = favorites.includes(r.cc);
                const isSelected = selectedCC === r.cc;
                const flag = FLAG_RECORDS[r.cc] || "🏳️";
                const canShowChart = majorCurrencies.includes(r.cc);

                return (
                  <tr
                    key={r.cc}
                    className={`transition-colors group ${
                      isSelected 
                        ? isDark ? "bg-amber-950/20 hover:bg-amber-950/30" : "bg-amber-50/50 hover:bg-amber-50/70"
                        : isDark ? "hover:bg-slate-850/50" : "hover:bg-amber-50/20"
                    }`}
                  >
                    {/* Toggle Favorite column */}
                    <td className="px-4 py-3 text-center align-middle">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(r.cc);
                        }}
                        className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                        title={isFavorite ? "Видалити з обраного" : "Додати до обраного"}
                      >
                        <Star
                          className={`h-4.5 w-4.5 transition-all ${
                            isFavorite ? "fill-amber-400 text-amber-500 scale-105" : "hover:scale-105"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Code Column */}
                    <td className={`px-4 py-3 font-semibold font-mono text-sm tracking-wider align-middle ${
                      isDark ? "text-slate-100" : "text-slate-800"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{flag}</span>
                        <span>{r.cc}</span>
                      </div>
                    </td>

                    {/* Name Column */}
                    <td className="px-4 py-3 text-sm align-middle">
                      <p className={`font-semibold ${isDark ? "text-slate-200 group-hover:text-slate-100" : "text-slate-700 group-hover:text-slate-950"}`}>{r.txt}</p>
                      <p className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>Цифровий код: {r.r030}</p>
                    </td>

                    {/* Rate Column */}
                    <td className={`px-4 py-3 text-right font-bold font-mono text-sm sm:text-base tracking-tight align-middle ${
                      isDark ? "text-slate-150" : "text-slate-800"
                    }`}>
                      <div className="flex items-baseline justify-end gap-1">
                        <span>{r.rate.toFixed(4)}</span>
                        <span className="text-xs text-slate-400 font-semibold font-sans">₴</span>
                      </div>
                    </td>

                    {/* Interactive selection Column */}
                    <td className="px-4 py-3 text-center align-middle">
                      {canShowChart ? (
                        <button
                          onClick={() => onSelectCC(r.cc)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500 text-white"
                              : isDark
                                ? "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100 group-hover:border-slate-300"
                          }`}
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span className="hidden sm:inline">Перегляд</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 font-sans" title="Історія котирувань доступна для топ 5 основних валют за замовчуванням">
                          Базовий
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
