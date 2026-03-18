import { useState, useMemo, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Minus, Trash2 } from "lucide-react";
import type { Creditor } from "@/types/creditor";

/* ── Formatted currency helpers ── */
const fmtR = (n: number) =>
  n === 0 ? "₹0" : `₹${Math.round(n).toLocaleString("en-IN")}`;

const fmtV = (n: number) =>
  n === 0
    ? "₹0"
    : `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── Cashout row ── */
interface CashoutRow {
  id: string;
  name: string;
  purpose: string;
  amount: number;
}

interface CalculatorTabProps {
  included: Creditor[];
  setIncluded: Dispatch<SetStateAction<Creditor[]>>;
  excluded: Creditor[];
  setExcluded: Dispatch<SetStateAction<Creditor[]>>;
  stcIds: Set<string>;
  onToggleStc: (id: string) => void;
}

const TENURE_OPTIONS = [12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96];

/* ── PMT formula ── */
const calcPMT = (principal: number, annualRate: number, months: number): number => {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 1200;
  const pow = Math.pow(1 + r, months);
  return (principal * r * pow) / (pow - 1);
};

const CalculatorTab = ({
  included,
  setIncluded,
  excluded,
  setExcluded,
  stcIds,
  onToggleStc,
}: CalculatorTabProps) => {

  /* ── Cashout state ── */
  const [cashouts, setCashouts] = useState<CashoutRow[]>([
    { id: "1", name: "Cash-out", purpose: "--", amount: 527000 },
  ]);

  const addCashout = () =>
    setCashouts((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", purpose: "", amount: 0 },
    ]);

  const removeCashout = (id: string) =>
    setCashouts((prev) => prev.filter((c) => c.id !== id));

  const updateCashout = (
    id: string,
    field: keyof Omit<CashoutRow, "id">,
    value: string | number
  ) =>
    setCashouts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );

  const totalCashout = cashouts.reduce((s, c) => s + (c.amount || 0), 0);

  /* ── Include / Exclude handlers ── */
  const handleExclude = (id: string) => {
    const creditor = included.find((c) => c.id === id);
    if (creditor) {
      setIncluded((prev) => prev.filter((c) => c.id !== id));
      setExcluded((prev) => [...prev, creditor]);
    }
  };

  const handleInclude = (id: string) => {
    const creditor = excluded.find((c) => c.id === id);
    if (creditor) {
      setExcluded((prev) => prev.filter((c) => c.id !== id));
      setIncluded((prev) => [...prev, creditor]);
    }
  };

  /* ── Derived totals ── */
  const inclClosureTotal = included.reduce((s, c) => s + c.closureAmount, 0);
  const inclEMITotal     = included.reduce((s, c) => s + c.emi, 0);
  const exclClosureTotal = excluded.reduce((s, c) => s + c.closureAmount, 0);
  const exclEMITotal     = excluded.reduce((s, c) => s + c.emi, 0);
  const existingTotalEMI = inclEMITotal + exclEMITotal;

  /* ── Loan calculator state ── */
  const [loanAmount, setLoanAmount] = useState<number>(() => inclClosureTotal + totalCashout);
  const [tenure, setTenure]         = useState<number>(72);
  const [rateOfInterest, setROI]    = useState<number>(16);
  const [income, setIncome]         = useState<number>(100000);

  const autoLoanAmount = inclClosureTotal + totalCashout;

  /* ── Calculation results ── */
  const results = useMemo(() => {
    const emi              = calcPMT(loanAmount, rateOfInterest, tenure);
    const totalRepayment   = emi * tenure;
    const totalInterest    = totalRepayment - loanAmount;
    const newTotalObligation = emi + exclEMITotal;
    const cashFreed        = existingTotalEMI - newTotalObligation;
    const ntb              = existingTotalEMI > 0 ? (cashFreed / existingTotalEMI) * 100 : 0;
    const preFOIR          = income > 0 ? (existingTotalEMI / income) * 100 : 0;
    const postFOIR         = income > 0 ? (newTotalObligation / income) * 100 : 0;
    return { emi, totalRepayment, totalInterest, newTotalObligation, cashFreed, ntb, preFOIR, postFOIR };
  }, [loanAmount, tenure, rateOfInterest, income, exclEMITotal, existingTotalEMI]);

  const foirColor = (pct: number) =>
    pct <= 40 ? "text-green-600" : pct <= 55 ? "text-amber-600" : "text-red-600";

  const preRows  = [
    ...included.map((c) => ({ name: c.name, emi: c.emi })),
    ...excluded.map((c) => ({ name: c.name, emi: c.emi })),
  ];
  const postRows = [
    { name: "Consolidation Loan", emi: results.emi },
    ...excluded.map((c) => ({ name: c.name, emi: c.emi })),
  ];

  return (
    <div className="space-y-5">

      {/* ══ Spine-format Included + Excluded Creditors side-by-side ══ */}
      <div className="grid grid-cols-2 gap-4">

        {/* ── Left: Included Creditors + Cashout ── */}
        <div className="border rounded-lg overflow-hidden bg-card">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-green-50/50">
            <div className="h-5 w-5 rounded-full bg-green-100 border border-green-400 flex items-center justify-center shrink-0">
              <Plus className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-800">Included Creditors</span>
            <span className="ml-1 text-[10px] font-semibold text-green-700 bg-green-100 border border-green-300 rounded-full px-2 py-0.5">
              {included.length}
            </span>
            <div className="ml-auto">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs h-7 px-2.5"
                onClick={addCashout}
              >
                <Plus className="h-3 w-3" />
                Add Cashout
              </Button>
            </div>
          </div>

          {/* Included creditors table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Creditor Name</TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Debt Type</TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Total Outstanding Loan</TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">EMI</TableHead>
                <TableHead className="w-10 bg-muted/30" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {included.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/10">
                  <TableCell className="px-3 py-2.5 min-w-[120px]">
                    <span className="text-xs font-medium text-primary leading-snug">{c.name}</span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 whitespace-nowrap">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal border-muted-foreground/30">
                      {c.debtType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-xs font-medium text-right whitespace-nowrap">
                    {fmtV(c.closureAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-xs font-semibold text-right whitespace-nowrap">
                    {fmtV(c.emi)}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleExclude(c.id)}
                          className="h-6 w-6 rounded-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs">Exclude creditor</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {included.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-xs text-muted-foreground">
                    No included creditors
                  </TableCell>
                </TableRow>
              )}
              {included.length > 0 && (
                <TableRow className="bg-muted/20 hover:bg-muted/20 border-t">
                  <TableCell colSpan={2} className="px-3 py-2 text-xs font-bold text-primary">Total</TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">
                    {fmtV(inclClosureTotal)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">
                    {fmtV(inclEMITotal)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Cashout section — inlined below included table */}
          <div className="border-t">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-b">
              <span className="text-xs font-semibold text-foreground">Cashout</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Name</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Purpose</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Amount</TableHead>
                  <TableHead className="w-10 bg-muted/30" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashouts.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-1.5 px-2">
                      <Input
                        value={row.name}
                        onChange={(e) => updateCashout(row.id, "name", e.target.value)}
                        className="h-7 text-xs min-w-[80px]"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Input
                        value={row.purpose}
                        onChange={(e) => updateCashout(row.id, "purpose", e.target.value)}
                        className="h-7 text-xs min-w-[80px]"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Input
                        type="number"
                        value={row.amount}
                        onChange={(e) => updateCashout(row.id, "amount", Number(e.target.value))}
                        className="h-7 text-xs text-right min-w-[90px]"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2 text-center">
                      <button
                        onClick={() => removeCashout(row.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {cashouts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-3 text-xs text-muted-foreground">
                      No cashout rows.
                    </TableCell>
                  </TableRow>
                )}
                {cashouts.length > 0 && (
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={2} className="px-3 py-2 text-xs font-semibold">Total</TableCell>
                    <TableCell className="px-3 py-2 text-xs font-semibold text-right">{fmtR(totalCashout)}</TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Right: Excluded Creditors ── */}
        <div className="border rounded-lg overflow-hidden bg-card">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-red-50/50">
            <div className="h-5 w-5 rounded-full bg-red-100 border border-red-400 flex items-center justify-center shrink-0">
              <Minus className="h-3 w-3 text-red-500" />
            </div>
            <span className="text-sm font-semibold text-red-800">Excluded Creditors</span>
            <span className="ml-1 text-[10px] font-semibold text-red-700 bg-red-100 border border-red-300 rounded-full px-2 py-0.5">
              {excluded.length}
            </span>
          </div>

          {/* Excluded creditors table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Creditor Name</TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">STC</TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Debt Type</TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Total Outstanding Loan</TableHead>
                <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">EMI</TableHead>
                <TableHead className="w-10 bg-muted/30" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {excluded.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/10">
                  <TableCell className="px-3 py-2.5 min-w-[120px]">
                    <span className="text-xs font-medium text-foreground leading-snug">{c.name}</span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5">
                    <Switch
                      checked={stcIds.has(c.id)}
                      onCheckedChange={() => onToggleStc(c.id)}
                      className="data-[state=checked]:bg-red-500 scale-75"
                    />
                  </TableCell>
                  <TableCell className="px-3 py-2.5 whitespace-nowrap">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal border-muted-foreground/30">
                      {c.debtType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-xs font-medium text-right whitespace-nowrap">
                    {fmtV(c.closureAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-xs font-semibold text-right whitespace-nowrap">
                    {c.emi > 0 ? fmtV(c.emi) : "--"}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleInclude(c.id)}
                          className="h-6 w-6 rounded-full flex items-center justify-center bg-[#1e3a5f] hover:bg-[#152d4a] text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs">Include creditor</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {excluded.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-xs text-muted-foreground">
                    No excluded creditors
                  </TableCell>
                </TableRow>
              )}
              {excluded.length > 0 && (
                <TableRow className="bg-muted/20 hover:bg-muted/20 border-t">
                  <TableCell colSpan={3} className="px-3 py-2 text-xs font-bold">Total</TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">
                    {fmtV(exclClosureTotal)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">
                    {fmtV(exclEMITotal)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ══ Loan Calculator ══ */}
      <div className="bg-card rounded-lg border p-5 space-y-5">

        {/* Input row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="crm-field-label">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">₹</span>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="h-10 text-sm pl-7"
                placeholder={String(autoLoanAmount)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Tenure (months)</Label>
            <Select value={String(tenure)} onValueChange={(v) => setTenure(Number(v))}>
              <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TENURE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={String(t)}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Rate of Interest (%)</Label>
            <Input
              type="number"
              value={rateOfInterest}
              onChange={(e) => setROI(Number(e.target.value))}
              className="h-10 text-sm"
              step={0.5}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Existing Total EMI</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">₹</span>
              <Input
                type="number"
                value={existingTotalEMI}
                readOnly
                className="h-10 text-sm pl-7 bg-muted/50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Calculate button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="px-10 h-9 text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Calculate Loan EMI
          </Button>
        </div>

        {/* Results row 1 */}
        <div className="grid grid-cols-3 gap-4 border rounded-lg overflow-hidden">
          <div className="p-4 border-r">
            <p className="text-xs text-muted-foreground mb-1">Loan EMI Amount</p>
            <p className="text-base font-bold">{fmtR(results.emi)}</p>
          </div>
          <div className="p-4 border-r">
            <p className="text-xs text-muted-foreground mb-1">Total Interest Payable</p>
            <p className="text-base font-bold">{fmtR(results.totalInterest)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Repayment Amount</p>
            <p className="text-base font-bold">{fmtR(results.totalRepayment)}</p>
          </div>
        </div>

        {/* Results row 2 */}
        <div className="grid grid-cols-3 gap-4 border rounded-lg overflow-hidden">
          <div className="p-4 border-r">
            <p className="text-xs text-muted-foreground mb-1">Income</p>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">₹</span>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="h-8 text-sm pl-6 font-bold"
              />
            </div>
          </div>
          <div className="p-4 border-r">
            <p className="text-xs text-muted-foreground mb-1">Net Tangible Benefit</p>
            <p className={`text-base font-bold ${foirColor(100 - results.ntb)}`}>
              {results.ntb.toFixed(2)}%
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Cash FREED</p>
            <p className="text-base font-bold">{fmtR(results.cashFreed)}</p>
          </div>
        </div>

        {/* Pre / Post FOIR Tables */}
        <div className="grid grid-cols-2 gap-5 pt-2">

          {/* Pre-consolidation */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold bg-muted/30 py-2.5">Account</TableHead>
                  <TableHead className="text-xs font-semibold bg-muted/30 py-2.5 text-right">EMI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preRows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-2 text-sm text-foreground">{row.name}</TableCell>
                    <TableCell className="py-2 text-sm text-right whitespace-nowrap">
                      {fmtR(row.emi)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t bg-muted/20">
                  <TableCell className="py-2 text-sm font-medium">Total Monthly Obligation</TableCell>
                  <TableCell className="py-2 text-sm font-medium text-right whitespace-nowrap">
                    {fmtR(existingTotalEMI)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t">
                  <TableCell className="py-2.5 text-sm font-bold">Pre-consolidation FOIR</TableCell>
                  <TableCell className={`py-2.5 text-sm font-bold text-right ${foirColor(results.preFOIR)}`}>
                    {results.preFOIR.toFixed(2)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Post-consolidation */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold bg-muted/30 py-2.5">Account</TableHead>
                  <TableHead className="text-xs font-semibold bg-muted/30 py-2.5 text-right">EMI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postRows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-2 text-sm text-foreground">{row.name}</TableCell>
                    <TableCell className="py-2 text-sm text-right whitespace-nowrap">
                      {fmtR(row.emi)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t bg-muted/20">
                  <TableCell className="py-2 text-sm font-medium">New Total Monthly Obligation</TableCell>
                  <TableCell className="py-2 text-sm font-medium text-right whitespace-nowrap">
                    {fmtR(results.newTotalObligation)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t">
                  <TableCell className="py-2.5 text-sm font-bold">Post-consolidation FOIR</TableCell>
                  <TableCell className={`py-2.5 text-sm font-bold text-right ${foirColor(results.postFOIR)}`}>
                    {results.postFOIR.toFixed(2)}%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CalculatorTab;
