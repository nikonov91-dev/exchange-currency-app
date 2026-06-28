import React, { useState, useEffect } from "react";
import { ArrowLeftRight, Coins, HelpCircle } from "lucide-react";
import { RateItem } from "../types";

interface ConverterProps {
  currentRates: RateItem[];
  defaultCC?: string;
  theme: "light" | "dark";
}

export default function Converter({ currentRates, defaultCC = "USD", theme }: ConverterProps) {
  const isDark = theme === "dark";

  // We want to support conversion between ANY currency in NBU plus UAH (Ukrainian Hryvnia) itself!
  const [fromCC, setFromCC] = useState<string>(defaultCC);
  const [toCC, setToCC] = useState<string>("UAH");
  const [fromAmount, setFromAmount] = useState<string>("100");
  const [toAmount, setToAmount] = useState<string>("");

  // Populate helper list with major ones + currently chosen ones list
  const availableCurrencies = [
    { cc: "UAH", txt: "Українська гривня", rate: 1.0 },
    ...currentRates,
  ];

  // Logic to calculate conversion
  const handleCalculate = (amountVal: string, source: "from" | "to") => {
    const fromRateObj = availableCurrencies.find((r) => r.cc === fromCC);
    const toRateObj = availableCurrencies.find((r) => r.cc === toCC);

    if (!fromRateObj || !toRateObj) return;

    const parsedAmount = parseFloat(amountVal);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      if (source === "from") setToAmount("");
      else setFromAmount("");
      return;
    }

    if (source === "from") {
      // Amount in UAH = amount * fromRateObj.rate
      // Amount in target = Amount in UAH / toRateObj.rate
      const amountInUAH = parsedAmount * fromRateObj.rate;
      const result = amountInUAH / toRateObj.rate;
      setToAmount(result.toFixed(2));
    } else {
      // Amount in UAH = amount * toRateObj.rate
      // Amount in target = Amount in UAH / fromRateObj.rate
      const amountInUAH = parsedAmount * toRateObj.rate;
      const result = amountInUAH / fromRateObj.rate;
      setFromAmount(result.toFixed(2));
    }
  };

  // Synchronise converter when inputs or dropdown selection updates
  useEffect(() => {
    handleCalculate(fromAmount, "from");
  }, [fromCC, toCC]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromAmount(val);
    handleCalculate(val, "from");
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setToAmount(val);
    handleCalculate(val, "to");
  };

  // Quick swap inputs
  const handleSwap = () => {
    const tempCC = fromCC;
    setFromCC(toCC);
    setToCC(tempCC);

    const tempAmt = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmt);
  };

  // Instant pre-filled shortcuts
  const handleShortcut = (val: number) => {
    setFromAmount(val.toString());
    handleCalculate(val.toString(), "from");
  };

  return (
    <div className={`rounded-3xl p-6 shadow-xl border flex flex-col justify-between h-full transition-all duration-200 ${
      isDark
        ? "bg-slate-900 border-slate-850 text-white"
        : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div>
        {/* Module title */}
        <div className={`flex items-center gap-2 border-b pb-4 mb-5 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
          <Coins className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold font-sans">Калькулятор конвертації</h2>
        </div>

        {/* Form Container */}
        <div className="space-y-4">
          
          {/* FROM input */}
          <div className={`p-4 rounded-2xl border transition-colors focus-within:border-amber-400/50 ${
            isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"
          }`}>
            <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Віддаю</label>
            <div className="flex gap-2 mt-1">
              <input
                id="from-amount-input"
                type="number"
                min="0"
                placeholder="0.00"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className={`bg-transparent border-0 font-extrabold text-xl sm:text-2xl outline-hidden w-full font-mono ${
                  isDark ? "text-white placeholder-slate-700" : "text-slate-900 placeholder-slate-300"
                }`}
              />
              <select
                id="from-cc-select"
                value={fromCC}
                onChange={(e) => setFromCC(e.target.value)}
                className={`border rounded-xl py-1.5 px-2.5 font-bold font-sans text-sm focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer w-24 sm:w-28 ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-800"
                }`}
              >
                {availableCurrencies.map((c) => (
                  <option key={c.cc} value={c.cc}>
                    {c.cc} ({c.cc === "UAH" ? "₴" : c.cc})
                  </option>
                ))}
              </select>
            </div>
            <p className={`text-[10px] mt-1.5 truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {availableCurrencies.find((c) => c.cc === fromCC)?.txt || ""}
            </p>
          </div>

          {/* Swap Middle Button */}
          <div className="flex justify-center -my-2.5 relative z-10">
            <button
              id="swap-cc-btn"
              onClick={handleSwap}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2.5 shadow-lg transform transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Поміняти місцями"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* TO input */}
          <div className={`p-4 rounded-2xl border transition-colors focus-within:border-amber-400/50 ${
            isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"
          }`}>
            <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Отримую</label>
            <div className="flex gap-2 mt-1">
              <input
                id="to-amount-input"
                type="number"
                min="0"
                placeholder="0.00"
                value={toAmount}
                onChange={handleToAmountChange}
                className={`bg-transparent border-0 font-extrabold text-xl sm:text-2xl outline-hidden w-full font-mono ${
                  isDark ? "text-white placeholder-slate-700" : "text-slate-900 placeholder-slate-300"
                }`}
              />
              <select
                id="to-cc-select"
                value={toCC}
                onChange={(e) => setToCC(e.target.value)}
                className={`border rounded-xl py-1.5 px-2.5 font-bold font-sans text-sm focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer w-24 sm:w-28 ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-800"
                }`}
              >
                {availableCurrencies.map((c) => (
                  <option key={c.cc} value={c.cc}>
                    {c.cc} ({c.cc === "UAH" ? "₴" : c.cc})
                  </option>
                ))}
              </select>
            </div>
            <p className={`text-[10px] mt-1.5 truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {availableCurrencies.find((c) => c.cc === toCC)?.txt || ""}
            </p>
          </div>

        </div>

        {/* Shortcuts Panel */}
        <div className="mt-5">
          <p className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Швидкі суми</p>
          <div className="flex gap-1.5 flex-wrap">
            {[10, 50, 100, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => handleShortcut(val)}
                className={`border px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? "bg-slate-950 hover:bg-slate-800 border-slate-850 text-amber-400 hover:text-amber-300"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                }`}
              >
                {val} {fromCC}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-rate calculation info */}
      <div className={`mt-6 pt-4 border-t flex items-start gap-2 text-[11px] ${
        isDark ? "border-slate-800 text-slate-500" : "border-slate-100 text-slate-400"
      }`}>
        <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          Розрахунок здійснюється автоматично через крос-курс гривні відповідно до офіційного курсу НБУ.
        </p>
      </div>

    </div>
  );
}
