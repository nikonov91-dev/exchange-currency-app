import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import MajorCards from "./components/MajorCards";
import ChartSection from "./components/ChartSection";
import Converter from "./components/Converter";
import RatesTable from "./components/RatesTable";
import CacheSpecs from "./components/CacheSpecs";
import { CacheData, RateItem } from "./types";
import { Info, HelpCircle, Landmark, Globe, Activity } from "lucide-react";

export default function App() {
  const [data, setData] = useState<CacheData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCC, setSelectedCC] = useState("USD");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 1. Initial State Load from client side
  useEffect(() => {
    // Read favorites from localStorage safely
    try {
      const stored = localStorage.getItem("nbu_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        // Preset default favorites
        const defaults = ["USD", "EUR", "PLN"];
        setFavorites(defaults);
        localStorage.setItem("nbu_favorites", JSON.stringify(defaults));
      }
    } catch (e) {
      console.warn("Could not load favorites from localStorage", e);
    }

    // Read theme from localStorage safely
    try {
      const storedTheme = localStorage.getItem("nbu_theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch (e) {
      console.warn("Could not load theme from localStorage", e);
    }

    // Fetch Rates Data
    fetchRates();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("nbu_theme", nextTheme);
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }
  };

  const fetchRates = async (isForced = false) => {
    if (isForced) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const url = isForced ? "/api/rates/refresh" : "/api/rates";
    const method = isForced ? "POST" : "GET";

    try {
      const response = await fetch(url, { method });
      if (!response.ok) {
        throw new Error(`Помилка завантаження даних курсу валют: ${response.statusText}`);
      }
      const resData = await response.json();
      
      // If forced refresh, the response format might be { message, data }
      const finalData: CacheData = isForced ? resData.data : resData;
      
      setData(finalData);
    } catch (err: any) {
      console.error("Error fetching rates:", err);
      setError(err?.message || "Не вдалося отримати актуальний курс валют.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // 2. Handle Manual cache reload
  const handleRefresh = () => {
    fetchRates(true);
  };

  // 3. Handle Add/Delete favorite
  const handleToggleFavorite = (cc: string) => {
    let updated;
    if (favorites.includes(cc)) {
      updated = favorites.filter((item) => item !== cc);
    } else {
      updated = [...favorites, cc];
    }
    setFavorites(updated);
    try {
      localStorage.setItem("nbu_favorites", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save favorites to localStorage", e);
    }
  };

  const isDark = theme === "dark";

  // Render Loader screen
  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-250 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500 text-white shadow-xl shadow-amber-500/20 animate-bounce mb-5">
          <Activity className="h-8 w-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold font-sans tracking-tight">
          Завантаження офіційного курсу валют...
        </h2>
        <p className={`font-sans text-xs mt-1.5 max-w-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Запитуємо дані з локального кешування бекенду для збереження ліміту запитів до API Національного банку України.
        </p>
        <div className="mt-8 flex gap-2 w-48">
          <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
            <div className="h-full bg-amber-500 animate-[pulse_1.5s_infinite] w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Render Error screen
  if (error || !data) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-250 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-850"
      }`}>
        <div className="h-14 w-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
          <Landmark className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold font-sans tracking-tight">Помилка мережевого з’єднання</h2>
        <p className={`text-sm mt-2 max-w-md ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {error || "Не вдалося отримати структуровані дані залишків з кешу."}
        </p>
        <button
          onClick={() => fetchRates(false)}
          className={`mt-6 rounded-xl font-bold px-6 py-2.5 active:scale-95 transition-all cursor-pointer text-sm ${
            isDark ? "bg-slate-100 text-slate-950 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  const currentRates = data.currentRates || [];
  const history = data.history || {};
  const selectedHistory = history[selectedCC] || [];
  const selectedRateItem = currentRates.find((r) => r.cc === selectedCC);

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-250 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50/50 text-slate-900"
    }`}>
      
      {/* Header controls section */}
      <Header
        updatedAt={data.updatedAt}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        
        {/* TOP major items card grid */}
        <MajorCards
          currentRates={currentRates}
          history={history}
          selectedCC={selectedCC}
          onSelectCC={(cc) => setSelectedCC(cc)}
          theme={theme}
        />

        {/* Content Bento section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* Main Chart + Caching documentation (2 Columns) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <ChartSection
              cc={selectedCC}
              historyData={selectedHistory}
              rateInfo={selectedRateItem}
              theme={theme}
            />
            
            <CacheSpecs updatedAt={data.updatedAt} theme={theme} />
          </div>

          {/* Quick interactive conversion module (1 Column) */}
          <div className="lg:col-span-1 h-full">
            <Converter
              currentRates={currentRates}
              defaultCC={selectedCC}
              theme={theme}
            />
          </div>

        </div>

        {/* Full searchable rates table */}
        <RatesTable
          rates={currentRates}
          selectedCC={selectedCC}
          onSelectCC={(cc) => setSelectedCC(cc)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          theme={theme}
        />

      </main>

      {/* Elegant minimalist footer */}
      <footer className={`mt-16 pt-8 text-center text-xs border-t transition-colors duration-200 ${
        isDark ? "border-slate-850 text-slate-500" : "border-slate-200 text-slate-400"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-medium">
            © {new Date().getFullYear()} Курс Валют НБУ. Розроблено для освітніх цілей.
          </p>
          <div className={`flex items-center gap-1.5 font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Globe className="h-3.5 w-3.5 text-amber-500" />
            <span>Джерело даних: Національний банк України (bank.gov.ua)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
