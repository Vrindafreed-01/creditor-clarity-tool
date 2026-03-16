import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface SmartDatePickerProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

const SmartDatePicker = ({ value, onChange, placeholder = "Select date…", className }: SmartDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [mode, setMode] = useState<"month" | "range">("month");
  const [rangeStart, setRangeStart] = useState<{ m: number; y: number } | null>(null);

  const fmt = (m: number, y: number) => `${MONTHS[m]} ${y}`;

  const selectMonth = (m: number) => {
    if (mode === "month") {
      onChange(fmt(m, viewYear));
      setOpen(false);
      setRangeStart(null);
    } else {
      if (!rangeStart) {
        setRangeStart({ m, y: viewYear });
      } else {
        const sTotal = rangeStart.y * 12 + rangeStart.m;
        const eTotal = viewYear * 12 + m;
        if (eTotal < sTotal) {
          onChange(`${fmt(m, viewYear)} – ${fmt(rangeStart.m, rangeStart.y)}`);
        } else if (eTotal === sTotal) {
          onChange(fmt(m, viewYear));
        } else {
          onChange(`${fmt(rangeStart.m, rangeStart.y)} – ${fmt(m, viewYear)}`);
        }
        setRangeStart(null);
        setOpen(false);
      }
    }
  };

  /* Determine display states for each month button */
  const getMonthState = (idx: number) => {
    const current = viewYear * 12 + idx;

    // Single month selected
    if (mode === "month" && value === fmt(idx, viewYear)) return "selected";

    // Range picking: first click highlighted
    if (mode === "range" && rangeStart && rangeStart.m === idx && rangeStart.y === viewYear) return "selected";

    // Saved range highlighting
    if (mode === "range" && value) {
      const parts = value.split(" – ");
      if (parts.length === 2) {
        const parseMonthYear = (str: string) => {
          const [mon, yr] = str.trim().split(" ");
          const mi = MONTHS.indexOf(mon);
          return mi >= 0 ? parseInt(yr) * 12 + mi : null;
        };
        const s = parseMonthYear(parts[0]);
        const e = parseMonthYear(parts[1]);
        if (s !== null && e !== null) {
          if (current === s || current === e) return "edge";
          if (current > s && current < e) return "in-range";
        }
      } else if (value === fmt(idx, viewYear)) {
        return "selected";
      }
    }
    return "none";
  };

  /* Quick preset generator */
  const getPresetVal = (startOffset: number, endOffset: number) => {
    const mo = (off: number) => {
      let mm = now.getMonth() + off;
      let yy = now.getFullYear();
      while (mm < 0) { mm += 12; yy--; }
      while (mm >= 12) { mm -= 12; yy++; }
      return { m: mm, y: yy };
    };
    const s = mo(startOffset);
    const e = mo(endOffset);
    return startOffset === endOffset ? fmt(s.m, s.y) : `${fmt(s.m, s.y)} – ${fmt(e.m, e.y)}`;
  };

  const presets = [
    { label: "Current month",  val: getPresetVal(0, 0) },
    { label: "Last month",     val: getPresetVal(-1, -1) },
    { label: "Last 3 months",  val: getPresetVal(-2, 0) },
    { label: "Last 6 months",  val: getPresetVal(-5, 0) },
    { label: "Last 12 months", val: getPresetVal(-11, 0) },
    { label: "FY 2024-25",     val: `Apr 2024 – Mar 2025` },
  ];

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setRangeStart(null); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 h-9 px-3 w-full text-sm border border-input rounded-md bg-background text-left hover:bg-muted/40 transition-colors",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="flex-1 truncate">{value || placeholder}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0 shadow-xl border" align="start">

        {/* ── Mode toggle ── */}
        <div className="flex p-2 gap-1 border-b bg-muted/30">
          {(["month", "range"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setRangeStart(null); }}
              className={cn(
                "flex-1 text-xs font-medium py-1.5 rounded transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {m === "month" ? "Single Month" : "Date Range"}
            </button>
          ))}
        </div>

        {/* ── Year navigation ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <button
            onClick={() => setViewYear(y => y - 1)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-foreground tracking-wide">{viewYear}</span>
          <button
            onClick={() => setViewYear(y => y + 1)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* ── Range step hint ── */}
        {mode === "range" && (
          <div className={cn(
            "px-3 py-1.5 text-xs border-b",
            rangeStart
              ? "bg-amber-50 text-amber-700 border-amber-100"
              : "text-muted-foreground bg-muted/20"
          )}>
            {rangeStart
              ? `▶ From ${fmt(rangeStart.m, rangeStart.y)} — now pick end month`
              : "Step 1: click the start month"}
          </div>
        )}

        {/* ── Month grid ── */}
        <div className="grid grid-cols-4 gap-1 p-3">
          {MONTHS.map((name, idx) => {
            const state = getMonthState(idx);
            return (
              <button
                key={name}
                onClick={() => selectMonth(idx)}
                className={cn(
                  "text-xs font-medium py-2 rounded-md transition-all",
                  state === "selected" && "bg-primary text-primary-foreground shadow-sm",
                  state === "edge"     && "bg-primary text-primary-foreground shadow-sm",
                  state === "in-range" && "bg-primary/15 text-primary rounded-none",
                  state === "none"     && "hover:bg-muted text-foreground"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* ── Quick presets ── */}
        <div className="border-t bg-muted/20 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Quick Select
          </p>
          <div className="grid grid-cols-2 gap-1">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => { onChange(p.val); setOpen(false); setRangeStart(null); }}
                className={cn(
                  "text-left text-xs px-2 py-1.5 rounded hover:bg-muted transition-colors",
                  value === p.val
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Clear ── */}
        {value && (
          <div className="border-t px-3 py-2 flex justify-end">
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
            >
              ✕ Clear
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SmartDatePicker;
