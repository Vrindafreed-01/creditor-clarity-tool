import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Constants ── */
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

/* ── Helpers ── */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const iso = Date.parse(value);
  if (!isNaN(iso)) return new Date(iso);
  return null;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
}

/** Parse "Mon YYYY" → { month: 0-11, year } */
function parseMonthValue(value: string): { month: number; year: number } | null {
  if (!value) return null;
  const parts = value.trim().split(" ");
  if (parts.length !== 2) return null;
  const mi = MONTHS_SHORT.indexOf(parts[0]);
  const yr = parseInt(parts[1]);
  if (mi < 0 || isNaN(yr)) return null;
  return { month: mi, year: yr };
}

/** Format month as "Mon YYYY" */
function formatMonth(monthIdx: number, year: number): string {
  return `${MONTHS_SHORT[monthIdx]} ${year}`;
}

/** Compare two "Mon YYYY" values: -1, 0, 1 */
function compareMonths(a: string, b: string): number {
  const pa = parseMonthValue(a);
  const pb = parseMonthValue(b);
  if (!pa || !pb) return 0;
  const va = pa.year * 12 + pa.month;
  const vb = pb.year * 12 + pb.month;
  return va < vb ? -1 : va > vb ? 1 : 0;
}

/* ── Mode types ── */
export type DatePickerMode = "date" | "month" | "month-range";

/* ── Props ── */
interface UnifiedDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  mode?: DatePickerMode;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

/* ════════════════════════════════════════════════════
   UNIFIED DATE PICKER
   Supports: date (day-level), month (single month),
   month-range (start–end month in one field)
   ════════════════════════════════════════════════════ */
const UnifiedDatePicker = ({
  value,
  onChange,
  mode = "date",
  placeholder,
  className,
  compact = false,
}: UnifiedDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const now = new Date();

  /* ── Parse value based on mode ── */
  const isRange = mode === "month-range";
  const isMonth = mode === "month";

  // For month-range, value = "Mon YYYY – Mon YYYY" or "Mon YYYY" (partial) or ""
  const rangeParts = isRange && value ? value.split(" – ") : [];
  const rangeStart = rangeParts[0] || "";
  const rangeEnd = rangeParts[1] || "";

  const parsed = mode === "date" ? parseDate(value) : null;
  const parsedMonth = isMonth ? parseMonthValue(value) : isRange ? parseMonthValue(rangeStart) : null;

  const initialMonth = parsed ? parsed.getMonth() : parsedMonth ? parsedMonth.month : now.getMonth();
  const initialYear = parsed ? parsed.getFullYear() : parsedMonth ? parsedMonth.year : now.getFullYear();

  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [viewYear, setViewYear] = useState(initialYear);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);

  // Range selection state: "start" or "end"
  const [rangeStep, setRangeStep] = useState<"start" | "end">("start");
  const [pendingStart, setPendingStart] = useState(rangeStart);

  // Sync view when value changes externally
  useEffect(() => {
    if (mode === "date" && value) {
      const d = parseDate(value);
      if (d) { setViewMonth(d.getMonth()); setViewYear(d.getFullYear()); }
    } else if (isMonth && value) {
      const p = parseMonthValue(value);
      if (p) { setViewMonth(p.month); setViewYear(p.year); }
    } else if (isRange && rangeStart) {
      const p = parseMonthValue(rangeStart);
      if (p) { setViewYear(p.year); }
    }
  }, [value, mode]);

  // Reset range step when opening
  useEffect(() => {
    if (open && isRange) {
      if (rangeStart && !rangeEnd) {
        setRangeStep("end");
        setPendingStart(rangeStart);
      } else {
        setRangeStep("start");
        setPendingStart(rangeStart);
      }
    }
  }, [open]);

  const defaultPlaceholder =
    mode === "date" ? "Select date" :
    isMonth ? "Select month" :
    "Select range";

  /* Display value */
  const displayValue = (() => {
    if (!value) return "";
    if (mode === "date") {
      const d = parseDate(value);
      return d ? formatDisplay(d) : value;
    }
    return value; // "Mon YYYY" or "Mon YYYY – Mon YYYY"
  })();

  /* Navigation */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  /* Date selection (date mode) */
  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange(formatDate(d));
    setOpen(false);
  };

  /* Month selection */
  const selectMonth = (monthIdx: number) => {
    if (isMonth) {
      onChange(formatMonth(monthIdx, viewYear));
      setOpen(false);
    } else if (isRange) {
      const picked = formatMonth(monthIdx, viewYear);
      if (rangeStep === "start") {
        setPendingStart(picked);
        setRangeStep("end");
      } else {
        // Ensure start <= end
        let s = pendingStart;
        let e = picked;
        if (compareMonths(s, e) > 0) { [s, e] = [e, s]; }
        if (s === e) {
          onChange(s);
        } else {
          onChange(`${s} – ${e}`);
        }
        setOpen(false);
      }
    } else {
      // date mode — switch month view
      setViewMonth(monthIdx);
      setShowMonthSelect(false);
    }
  };

  /* Year selection */
  const selectYear = (year: number) => {
    setViewYear(year);
    setShowYearSelect(false);
  };

  /* Calendar grid (date mode) */
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const selectedDate = mode === "date" ? parseDate(value) : null;
  const today = new Date();
  const todayStr = formatDate(today);

  const yearStart = viewYear - 6;
  const yearEnd = viewYear + 5;

  const triggerHeight = compact ? "h-7" : "h-9";
  const triggerText = compact ? "text-xs" : "text-sm";
  const iconSize = compact ? "h-3.5 w-3.5" : "h-4 w-4";

  /* Month-range highlighting helper */
  const isMonthInRange = (monthIdx: number): "start" | "end" | "in-range" | "none" => {
    if (!isRange) return "none";
    const mv = formatMonth(monthIdx, viewYear);
    // When selecting end, highlight from pendingStart to hovered
    if (rangeStep === "end" && pendingStart) {
      if (mv === pendingStart) return "start";
    }
    // Check against committed range
    if (rangeStart && rangeEnd) {
      if (mv === rangeStart) return "start";
      if (mv === rangeEnd) return "end";
      if (compareMonths(mv, rangeStart) > 0 && compareMonths(mv, rangeEnd) < 0) return "in-range";
    } else if (rangeStart && !rangeEnd) {
      if (mv === rangeStart) return "start";
    }
    // Pending start during selection
    if (rangeStep === "end" && pendingStart === mv) return "start";
    return "none";
  };

  const showMonthGrid = isMonth || isRange;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 w-full rounded-md border border-input bg-background text-left transition-colors hover:bg-muted/40",
            triggerHeight, triggerText,
            compact ? "px-2" : "px-3",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="flex-1 truncate">{displayValue || placeholder || defaultPlaceholder}</span>
          <CalendarDays className={cn(iconSize, "text-muted-foreground shrink-0")} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[280px] p-0 shadow-xl border rounded-xl overflow-hidden"
        align="start"
        sideOffset={4}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-muted/30 border-b">
          <button
            type="button"
            onClick={showMonthGrid ? () => setViewYear((y) => y - 1) : prevMonth}
            className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {mode === "date" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowMonthSelect(!showMonthSelect); setShowYearSelect(false); }}
                  className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-0.5"
                >
                  {MONTHS_FULL[viewMonth]}
                  <ChevronRight className={cn("h-3 w-3 transition-transform", showMonthSelect && "rotate-90")} />
                </button>
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowYearSelect(!showYearSelect); setShowMonthSelect(false); }}
                className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-0.5"
              >
                {viewYear}
                <ChevronRight className={cn("h-3 w-3 transition-transform", showYearSelect && "rotate-90")} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={showMonthGrid ? () => setViewYear((y) => y + 1) : nextMonth}
            className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* ── Range step indicator ── */}
        {isRange && (
          <div className="px-3 py-1.5 bg-primary/5 border-b text-center">
            <span className="text-[11px] font-medium text-primary">
              {rangeStep === "start" ? "Select start month" : `Start: ${pendingStart} → Select end month`}
            </span>
          </div>
        )}

        {/* ── Month selector overlay (date mode) ── */}
        {showMonthSelect && mode === "date" && (
          <div className="grid grid-cols-3 gap-1 p-3 border-b">
            {MONTHS_SHORT.map((m, idx) => (
              <button
                key={m}
                type="button"
                onClick={() => selectMonth(idx)}
                className={cn(
                  "py-2 text-xs font-medium rounded-lg transition-colors",
                  idx === viewMonth
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-foreground"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* ── Year selector overlay ── */}
        {showYearSelect && (
          <div className="grid grid-cols-3 gap-1 p-3 border-b">
            {Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearStart + i).map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => selectYear(y)}
                className={cn(
                  "py-2 text-xs font-medium rounded-lg transition-colors",
                  y === viewYear
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-foreground"
                )}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/* ── DATE MODE: Day grid ── */}
        {mode === "date" && !showMonthSelect && !showYearSelect && (
          <div className="p-3">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d, i) => (
                <div key={i} className="h-8 flex items-center justify-center text-[11px] font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`e-${i}`} className="h-8" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = formatDate(new Date(viewYear, viewMonth, day));
                const isSelected = selectedDate && dateStr === formatDate(selectedDate);
                const isToday = dateStr === todayStr;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={cn(
                      "h-8 w-8 mx-auto rounded-full text-xs font-medium transition-all flex items-center justify-center",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isToday
                          ? "bg-accent text-accent-foreground font-bold"
                          : "hover:bg-muted text-foreground"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MONTH / MONTH-RANGE MODE: Month grid ── */}
        {showMonthGrid && !showYearSelect && (
          <div className="grid grid-cols-3 gap-1.5 p-3">
            {MONTHS_SHORT.map((m, idx) => {
              const monthVal = formatMonth(idx, viewYear);
              const isSingleSelected = isMonth && value === monthVal;
              const rangeStatus = isRange ? isMonthInRange(idx) : "none";
              const isRangeSelected = rangeStatus === "start" || rangeStatus === "end";
              const isInRange = rangeStatus === "in-range";

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => selectMonth(idx)}
                  className={cn(
                    "py-2.5 text-xs font-medium rounded-lg transition-colors",
                    isSingleSelected || isRangeSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isInRange
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground"
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
          {mode === "date" ? (
            <button
              type="button"
              onClick={() => { onChange(formatDate(today)); setOpen(false); }}
              className="text-xs text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Today
            </button>
          ) : (
            <span />
          )}
          {value ? (
            <button
              type="button"
              onClick={() => { onChange(""); setRangeStep("start"); setPendingStart(""); setOpen(false); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          ) : (
            <span />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { UnifiedDatePicker };
export default UnifiedDatePicker;
