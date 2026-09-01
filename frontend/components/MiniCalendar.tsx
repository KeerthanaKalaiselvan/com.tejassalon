"use client";

import { useMemo, useState } from "react";
import { formatDateKey } from "@/lib/booking";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MiniCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: string | null;
  onSelect: (dateKey: string) => void;
}) {
  const today = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const monthLabel = viewDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const startOffset = firstDayOfMonth.getDay();

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1)),
  ];

  function changeMonth(offset: number) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + offset, 1));
  }

  const canGoBack = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1) > today;

  return (
    <div className="rounded-2xl border border-gold/20 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canGoBack}
          className="rounded-pill border border-gold/30 px-3 py-1 text-xs text-navy disabled:opacity-30"
        >
          Prev
        </button>
        <p className="font-serif text-lg text-navy">{monthLabel}</p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-pill border border-gold/30 px-3 py-1 text-xs text-navy"
        >
          Next
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-ink/40">
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={`empty-${i}`} />;
          const key = formatDateKey(date);
          const disabled = date < today || date > maxDate;
          const isSelected = selectedDate === key;
          return (
            <button
              type="button"
              key={key}
              disabled={disabled}
              onClick={() => onSelect(key)}
              className={`aspect-square rounded-lg text-sm transition-colors ${
                isSelected
                  ? "bg-gold text-ink font-semibold"
                  : disabled
                  ? "text-ink/20"
                  : "text-navy hover:bg-gold/15"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
