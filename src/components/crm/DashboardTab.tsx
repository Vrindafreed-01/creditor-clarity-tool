import { useState, useMemo, useRef, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Minus,
  ArrowRight,
  TrendingDown,
  Pencil,
  Check,
  Sparkles,
  UserPlus,
  X,
  ChevronDown,
  Copy,
} from "lucide-react";
import type { Creditor } from "@/types/creditor";
import { DEBT_TYPES } from "@/types/creditor";
import DocumentManager from "./DocumentManager";

/* ── Formatters ── */
const fmtR = (n: number) =>
  n === 0 ? "₹0" : `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtV = (n: number) =>
  n === 0
    ? "₹0"
    : `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── Account Detail label: e.g. CC2379, PL7905 ── */
const DEBT_ABBREV: Record<string, string> = {
  CREDIT_CARD: "CC", PERSONAL_LOAN: "PL", HOME_LOAN: "HL",
  AUTO_LOAN: "AL", BUSINESS_LOAN: "BL",
};
const acctLabel = (debtType: string, acct: string) =>
  `${DEBT_ABBREV[debtType] ?? "AC"}${acct.slice(-4)}`;

/* ── PMT formula ── */
const calcPMT = (principal: number, annualRate: number, months: number): number => {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 1200;
  const pow = Math.pow(1 + r, months);
  return (principal * r * pow) / (pow - 1);
};

/* ── FOIR colour helpers ── */
const foirColor = (pct: number) =>
  pct <= 40 ? "text-green-600" : pct <= 55 ? "text-amber-600" : "text-red-600";
const foirBg = (pct: number) =>
  pct <= 40 ? "bg-green-50" : pct <= 55 ? "bg-amber-50" : "bg-red-50";

/* ── Lender data ── */
interface LenderOption {
  id: string;
  name: string;
  tenureMonths: number;
  roi: number;
  topUpAvailable: number;
  overrideEMI?: number;
}

const INITIAL_LENDERS: LenderOption[] = [
  { id: "1", name: "AFL",             tenureMonths: 60, roi: 12.5, topUpAvailable: 200000 },
  { id: "2", name: "TATA Capital",    tenureMonths: 60, roi: 14.0, topUpAvailable: 0 },
  { id: "3", name: "IDFC First",      tenureMonths: 60, roi: 13.0, topUpAvailable: 250000 },
  { id: "4", name: "Bajaj Finserv",   tenureMonths: 72, roi: 14.5, topUpAvailable: 400000 },
  { id: "5", name: "Piramal Finance", tenureMonths: 60, roi: 15.5, topUpAvailable: 0 },
];

/* ── Props ── */
interface DashboardTabProps {
  included:    Creditor[];
  setIncluded: Dispatch<SetStateAction<Creditor[]>>;
  excluded:    Creditor[];
  setExcluded: Dispatch<SetStateAction<Creditor[]>>;
  stcIds:      Set<string>;
  onToggleStc: (id: string) => void;
}

/* ── Editable number cell ── */
const EditableNum = ({
  value, isEditing, onChange, className = "",
}: {
  value: number; isEditing: boolean; onChange: (v: number) => void; className?: string;
}) =>
  isEditing ? (
    <Input
      type="number" value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`h-7 text-xs text-right border-primary/40 focus:border-primary ${className}`}
      style={{ minWidth: 90 }}
    />
  ) : (
    <span className={className}>{fmtV(value)}</span>
  );


/* ═══════════════════════════════════════════════════════════════════════════ */
const DashboardTab = ({
  included, setIncluded,
  excluded, setExcluded,
  stcIds, onToggleStc,
}: DashboardTabProps) => {

  /* ── Scroll ref ── */
  const lenderSectionRef = useRef<HTMLDivElement>(null);

  /* ── Global edit states ── */
  const [isDebtEditing,   setIsDebtEditing]   = useState(false);
  const [isLenderEditing, setIsLenderEditing] = useState(false);

  /* ── Collapsible dropdown states (FREED panels) ── */
  const [wfExcOpen,   setWfExcOpen]   = useState(false);
  const [wofAllOpen,  setWofAllOpen]  = useState(true);

  /* ── Lender data ── */
  const [lenderData, setLenderData] = useState<LenderOption[]>(INITIAL_LENDERS);
  const updateLender = (id: string, field: keyof LenderOption, val: number | string) =>
    setLenderData((p) => p.map((l) => (l.id === id ? { ...l, [field]: val } : l)));

  /* ── Qualification form (pre-filled) ── */
  const [qualForm, setQualForm] = useState({
    netSalary: "100000", permanentCity: "Pune", housingType: "rented",
    currentCity: "Pune", currentHousingType: "rented",
    companyName: "Infosys Technologies",
    employmentType: "salaried", recentBounces: "yes",
    rentAmount: "", additionalIncome: "",
  });
  const netSalary = parseFloat(qualForm.netSalary) || 0;

  /* ── Inline lender + FREED state ── */
  const [addingLender, setAddingLender] = useState(false);
  const [newLenderDraft, setNewLenderDraft] = useState({ name: "", tenureMonths: 60, roi: 12.0, topUpAvailable: 0 });
  const [consolidatedDropOpen, setConsolidatedDropOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSaveNewLender = () => {
    if (!newLenderDraft.name.trim()) return;
    const nl: LenderOption = {
      id: `custom-${Date.now()}`,
      name: newLenderDraft.name.trim(),
      tenureMonths: newLenderDraft.tenureMonths,
      roi: newLenderDraft.roi,
      topUpAvailable: newLenderDraft.topUpAvailable,
    };
    setLenderData((p) => [...p, nl]);
    setNewLenderDraft({ name: "", tenureMonths: 60, roi: 12.0, topUpAvailable: 0 });
    setAddingLender(false);
  };

  const copyAcct = (id: string, acct: string) => {
    navigator.clipboard.writeText(acct).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }).catch(() => {});
  };

  /* ── Add Creditor dialog ── */
  const [addCreditorOpen, setAddCreditorOpen] = useState(false);
  const [newCred, setNewCred] = useState({
    name: "", debtType: "PERSONAL_LOAN", closureAmount: "", emi: "",
    addTo: "included" as "included" | "excluded",
  });
  const handleAddCreditor = () => {
    if (!newCred.name.trim()) return;
    const c: Creditor = {
      id: `manual-${Date.now()}`,
      name: newCred.name.trim(),
      debtType: newCred.debtType,
      accountNumber: "—",
      openDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }),
      sanctionedAmount: parseFloat(newCred.closureAmount) || 0,
      currentBalance:   parseFloat(newCred.closureAmount) || 0,
      closureAmount:    parseFloat(newCred.closureAmount) || 0,
      tenure: 0, currentROI: "--",
      emi: parseFloat(newCred.emi) || 0,
    };
    if (newCred.addTo === "included") setIncluded((p) => [...p, c]);
    else setExcluded((p) => [...p, c]);
    setNewCred({ name: "", debtType: "PERSONAL_LOAN", closureAmount: "", emi: "", addTo: "included" });
    setAddCreditorOpen(false);
  };

  /* ── Creditor handlers ── */
  const handleExclude = (id: string) => {
    const c = included.find((x) => x.id === id);
    if (c) { setIncluded((p) => p.filter((x) => x.id !== id)); setExcluded((p) => [...p, c]); }
  };
  const handleInclude = (id: string) => {
    const c = excluded.find((x) => x.id === id);
    if (c) { setExcluded((p) => p.filter((x) => x.id !== id)); setIncluded((p) => [...p, c]); }
  };
  const updateIncluded = (id: string, field: keyof Creditor, val: number) =>
    setIncluded((p) => p.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  const updateExcluded = (id: string, field: keyof Creditor, val: number) =>
    setExcluded((p) => p.map((c) => (c.id === id ? { ...c, [field]: val } : c)));

  /* ── Derived totals ── */
  const inclClosureTotal    = included.reduce((s, c) => s + c.closureAmount, 0);
  const inclSanctionedTotal = included.reduce((s, c) => s + c.sanctionedAmount, 0);
  const inclEMITotal        = included.reduce((s, c) => s + c.emi, 0);
  const exclClosureTotal    = excluded.reduce((s, c) => s + c.closureAmount, 0);
  const exclSanctionedTotal = excluded.reduce((s, c) => s + c.sanctionedAmount, 0);
  const exclEMITotal        = excluded.reduce((s, c) => s + c.emi, 0);
  const existingTotalEMI = inclEMITotal + exclEMITotal;
  const existingFOIR     = netSalary > 0 ? (existingTotalEMI / netSalary) * 100 : 0;

  /* ── Lender state ── */
  const [selectedLenderId, setSelectedLenderId] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<{
    principal: number; interest: number; totalRepayment: number; emi: number; foir: number;
  } | null>(null);
  const [topUpEnabled, setTopUpEnabled] = useState(false);
  const [autoSelected, setAutoSelected] = useState(false);

  const handleSelectLender = (id: string) => {
    const newId = id === selectedLenderId ? null : id;
    setSelectedLenderId(newId);
    setCheckResult(null);
    setTopUpEnabled(false);
    setAutoSelected(false);
  };

  /* ── Lender rows (computed) ── */
  const lenderRows = useMemo(() =>
    lenderData.map((l) => {
      const emi           = (l.overrideEMI && l.overrideEMI > 0) ? l.overrideEMI : calcPMT(inclClosureTotal, l.roi, l.tenureMonths);
      const topUpEMI      = (l.overrideEMI && l.overrideEMI > 0) ? l.overrideEMI : calcPMT(inclClosureTotal + l.topUpAvailable, l.roi, l.tenureMonths);
      const newObligation = emi + exclEMITotal;
      const reduction     = existingTotalEMI - newObligation;
      const postFoir      = netSalary > 0 ? (newObligation / netSalary) * 100 : 0;
      return { ...l, computedEMI: emi, topUpEMI, reduction, postFoir };
    }),
    [lenderData, inclClosureTotal, exclEMITotal, existingTotalEMI, netSalary]
  );

  /* ── Loan Details CTA ── */
  const handleLoanDetails = () => {
    if (lenderRows.length === 0) return;
    const best = lenderRows.reduce((prev, curr) =>
      curr.reduction > prev.reduction ? curr : prev
    );
    setSelectedLenderId(best.id);
    setTopUpEnabled(false);
    setAutoSelected(true);
    const principal      = inclClosureTotal;
    const emi            = best.computedEMI;
    const totalRepayment = emi * best.tenureMonths;
    const interest       = totalRepayment - principal;
    const newObligation  = emi + exclEMITotal;
    const foir           = netSalary > 0 ? (newObligation / netSalary) * 100 : 0;
    setCheckResult({ principal, interest, totalRepayment, emi, foir });
  };

  /* ── Without/With FREED values ── */
  const selectedLender   = lenderData.find((l) => l.id === selectedLenderId) ?? lenderData[0];
  const consolidationEMI = checkResult?.emi ?? calcPMT(inclClosureTotal, selectedLender.roi, selectedLender.tenureMonths);
  const newObligation    = consolidationEMI + exclEMITotal;
  const preFOIR          = netSalary > 0 ? (existingTotalEMI / netSalary) * 100 : 0;
  const postFOIR         = netSalary > 0 ? (newObligation / netSalary) * 100 : 0;

  const topUpLenderEMI     = calcPMT(inclClosureTotal + selectedLender.topUpAvailable, selectedLender.roi, selectedLender.tenureMonths);
  const topUpNewObligation = topUpLenderEMI + exclEMITotal;
  const postFOIRWithTopUp  = netSalary > 0 ? (topUpNewObligation / netSalary) * 100 : 0;

  const activeNewObligation = topUpEnabled ? topUpNewObligation : newObligation;
  const activePostFOIR      = topUpEnabled ? postFOIRWithTopUp : postFOIR;

  const inputCls = "h-9 text-sm";

  /* ══════════════════════════════ RENDER ════════════════════════════════════ */
  return (
    <div className="space-y-6">

      {/* ═══════════════ SECTION 1 · QUALIFICATION DETAILS ═══════════════ */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Qualification Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="crm-field-label">Net Inhand Salary</Label>
            <Input type="number" value={qualForm.netSalary}
              onChange={(e) => setQualForm({ ...qualForm, netSalary: e.target.value })}
              className={inputCls} placeholder="e.g. 100000" />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Permanent City</Label>
            <Input value={qualForm.permanentCity}
              onChange={(e) => setQualForm({ ...qualForm, permanentCity: e.target.value })}
              className={inputCls} placeholder="Enter city" />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Housing Type</Label>
            <Select value={qualForm.housingType} onValueChange={(v) => setQualForm({ ...qualForm, housingType: v })}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Owned</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Rent House Amount</Label>
            <Input type="number" value={qualForm.rentAmount}
              onChange={(e) => setQualForm({ ...qualForm, rentAmount: e.target.value })}
              className={inputCls} placeholder="e.g. 15000" />
          </div>
          {/* ── Current City Housing Type sub-section ── */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-3 mt-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current City Housing</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="crm-field-label">Current City</Label>
                <Input value={qualForm.currentCity}
                  onChange={(e) => setQualForm({ ...qualForm, currentCity: e.target.value })}
                  className={inputCls} placeholder="Enter city" />
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Housing Type</Label>
                <Select value={qualForm.currentHousingType} onValueChange={(v) => setQualForm({ ...qualForm, currentHousingType: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="parental">Parental</SelectItem>
                    <SelectItem value="company-provided">Company Provided</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Company Name</Label>
            <Input value={qualForm.companyName}
              onChange={(e) => setQualForm({ ...qualForm, companyName: e.target.value })}
              className={inputCls} placeholder="Enter company" />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Employment Type</Label>
            <Select value={qualForm.employmentType} onValueChange={(v) => setQualForm({ ...qualForm, employmentType: v })}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Additional Income (Incentive/Bounce)</Label>
            <Input type="number" value={qualForm.additionalIncome}
              onChange={(e) => setQualForm({ ...qualForm, additionalIncome: e.target.value })}
              className={inputCls} placeholder="e.g. 5000" />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Recent Bounces (last 6 months)</Label>
            <Select value={qualForm.recentBounces} onValueChange={(v) => setQualForm({ ...qualForm, recentBounces: v })}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      {/* ═══════════════ SECTION 2 · CREDITOR OVERVIEW ═══════════════ */}
      <div className={`bg-card rounded-lg border p-5 space-y-4 transition-all ${isDebtEditing ? "border-primary/30 ring-1 ring-primary/10" : ""}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Creditor Overview</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline"
              className="gap-1.5 text-xs h-8 border-primary/40 text-primary hover:bg-primary/5"
              onClick={() => setAddCreditorOpen(true)}>
              <UserPlus className="h-3.5 w-3.5" /> Add Creditor
            </Button>
            {isDebtEditing ? (
              <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setIsDebtEditing(false)}>
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => setIsDebtEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* ── Included Creditors ── */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-green-50/50">
              <div className="h-5 w-5 rounded-full bg-green-100 border border-green-400 flex items-center justify-center shrink-0">
                <Plus className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-800">Included Creditors</span>
              <span className="ml-1 text-[10px] font-semibold text-green-700 bg-green-100 border border-green-300 rounded-full px-2 py-0.5">
                {included.length}
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Creditor Name</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Account Detail</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">ROI</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Sanctioned Limited</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Outstanding Amount</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">EMI</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Open Date</TableHead>
                  <TableHead className="w-8 bg-muted/30" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {included.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/10">
                    <TableCell className="px-3 py-2.5 min-w-[110px]">
                      {isDebtEditing ? (
                        <Input value={c.name}
                          onChange={(e) => setIncluded(p => p.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))}
                          className="h-7 text-xs border-primary/40" />
                      ) : (
                        <span className="text-xs font-medium text-primary leading-snug">{c.name}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 whitespace-nowrap">
                      {isDebtEditing ? (
                        <Input value={c.accountNumber}
                          onChange={(e) => setIncluded(p => p.map(x => x.id === c.id ? { ...x, accountNumber: e.target.value } : x))}
                          className="h-7 text-xs border-primary/40 w-32 font-mono" />
                      ) : (
                        <button onClick={() => copyAcct(c.id, c.accountNumber)}
                          className="flex items-center gap-1 group hover:text-primary transition-colors"
                          title="Click to copy full account number">
                          <span className="text-xs font-mono font-semibold text-foreground">{acctLabel(c.debtType, c.accountNumber)}</span>
                          {copiedId === c.id
                            ? <Check className="h-3 w-3 text-green-500" />
                            : <Copy className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 whitespace-nowrap">
                      {isDebtEditing ? (
                        <Input value={c.currentROI}
                          onChange={(e) => setIncluded(p => p.map(x => x.id === c.id ? { ...x, currentROI: e.target.value } : x))}
                          className="h-7 text-xs border-primary/40 w-16" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{c.currentROI}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs font-medium text-right whitespace-nowrap">
                      <span>{fmtV(c.sanctionedAmount)}</span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs font-medium text-right whitespace-nowrap">
                      <EditableNum value={c.closureAmount} isEditing={isDebtEditing} onChange={(v) => updateIncluded(c.id, "closureAmount", v)} />
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs font-semibold text-right whitespace-nowrap">
                      <EditableNum value={c.emi} isEditing={isDebtEditing} onChange={(v) => updateIncluded(c.id, "emi", v)} />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{c.openDate}</span>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => !isDebtEditing && handleExclude(c.id)}
                            disabled={isDebtEditing}
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-white transition-colors ${isDebtEditing ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}>
                            <Minus className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="text-xs">{isDebtEditing ? "Save changes first" : "Exclude creditor"}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {included.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-4 text-xs text-muted-foreground">No included creditors</TableCell></TableRow>
                )}
                {included.length > 0 && (
                  <TableRow className="bg-muted/20 hover:bg-muted/20 border-t">
                    <TableCell colSpan={2} className="px-3 py-2 text-xs font-bold text-primary">Total</TableCell>
                    <TableCell />
                    <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">{fmtV(inclSanctionedTotal)}</TableCell>
                    <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">{fmtV(inclClosureTotal)}</TableCell>
                    <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">{fmtV(inclEMITotal)}</TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── Excluded Creditors ── */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-red-50/50">
              <div className="h-5 w-5 rounded-full bg-red-100 border border-red-400 flex items-center justify-center shrink-0">
                <Minus className="h-3 w-3 text-red-500" />
              </div>
              <span className="text-sm font-semibold text-red-800">Excluded Creditors</span>
              <span className="ml-1 text-[10px] font-semibold text-red-700 bg-red-100 border border-red-300 rounded-full px-2 py-0.5">
                {excluded.length}
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Creditor Name</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">STC</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Account Detail</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">ROI</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Sanctioned Limited</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Outstanding Amount</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">EMI</TableHead>
                  <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Open Date</TableHead>
                  <TableHead className="w-8 bg-muted/30" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {excluded.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/10">
                    <TableCell className="px-3 py-2.5 min-w-[110px]">
                      {isDebtEditing ? (
                        <Input value={c.name}
                          onChange={(e) => setExcluded(p => p.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))}
                          className="h-7 text-xs border-primary/40" />
                      ) : (
                        <span className="text-xs font-medium text-foreground leading-snug">{c.name}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <Switch checked={stcIds.has(c.id)} onCheckedChange={() => onToggleStc(c.id)}
                        className="data-[state=checked]:bg-red-500 scale-75" />
                    </TableCell>
                    <TableCell className="px-3 py-2.5 whitespace-nowrap">
                      {isDebtEditing ? (
                        <Input value={c.accountNumber}
                          onChange={(e) => setExcluded(p => p.map(x => x.id === c.id ? { ...x, accountNumber: e.target.value } : x))}
                          className="h-7 text-xs border-primary/40 w-32 font-mono" />
                      ) : (
                        <button onClick={() => copyAcct(c.id, c.accountNumber)}
                          className="flex items-center gap-1 group hover:text-primary transition-colors"
                          title="Click to copy full account number">
                          <span className="text-xs font-mono font-semibold text-foreground">{acctLabel(c.debtType, c.accountNumber)}</span>
                          {copiedId === c.id
                            ? <Check className="h-3 w-3 text-green-500" />
                            : <Copy className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 whitespace-nowrap">
                      {isDebtEditing ? (
                        <Input value={c.currentROI}
                          onChange={(e) => setExcluded(p => p.map(x => x.id === c.id ? { ...x, currentROI: e.target.value } : x))}
                          className="h-7 text-xs border-primary/40 w-16" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{c.currentROI}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs font-medium text-right whitespace-nowrap">
                      <span>{fmtV(c.sanctionedAmount)}</span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs font-medium text-right whitespace-nowrap">
                      <EditableNum value={c.closureAmount} isEditing={isDebtEditing} onChange={(v) => updateExcluded(c.id, "closureAmount", v)} />
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs font-semibold text-right whitespace-nowrap">
                      <EditableNum value={c.emi} isEditing={isDebtEditing} onChange={(v) => updateExcluded(c.id, "emi", v)} />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{c.openDate}</span>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => !isDebtEditing && handleInclude(c.id)}
                            disabled={isDebtEditing}
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-white transition-colors ${isDebtEditing ? "bg-[#6b8ab0] cursor-not-allowed" : "bg-[#1e3a5f] hover:bg-[#152d4a]"}`}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="text-xs">{isDebtEditing ? "Save changes first" : "Include creditor"}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {excluded.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center py-4 text-xs text-muted-foreground">No excluded creditors</TableCell></TableRow>
                )}
                {excluded.length > 0 && (
                  <TableRow className="bg-muted/20 hover:bg-muted/20 border-t">
                    <TableCell colSpan={3} className="px-3 py-2 text-xs font-bold">Total</TableCell>
                    <TableCell />
                    <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">{fmtV(exclSanctionedTotal)}</TableCell>
                    <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">{fmtV(exclClosureTotal)}</TableCell>
                    <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">{fmtV(exclEMITotal)}</TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Existing FOIR Banner + EMI + Lender Check ── */}
        <div className="flex items-center gap-4 bg-muted/40 rounded-lg px-5 py-3 border">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-muted-foreground">Existing FOIR</span>
            <span className={`text-sm font-bold ${foirColor(existingFOIR)}`}>
              {netSalary > 0 ? `${existingFOIR.toFixed(2)}%` : "—"}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Total Current EMI</span>
            <span className="text-sm font-bold text-foreground">{fmtR(existingTotalEMI)}</span>
          </div>
          <div className="ml-auto">
            <Button size="sm" className="gap-1.5 text-xs h-8"
              onClick={() => {
                handleLoanDetails();
                setTimeout(() => lenderSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
              }}
            >
              Lender Check <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════════ SECTION 3 · PREFERRED LENDERS ═══════════════ */}
      <div ref={lenderSectionRef} className={`bg-card rounded-lg border p-5 space-y-4 transition-all ${isLenderEditing ? "border-primary/30 ring-1 ring-primary/10" : ""}`}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Preferred Lenders</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-2">
              <span className="text-xs text-muted-foreground">Total Current EMI</span>
              <span className="text-sm font-bold text-foreground">{fmtR(existingTotalEMI)}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 border-primary/40 text-primary hover:bg-primary/5"
              onClick={() => setAddingLender(true)} disabled={addingLender}>
              <Plus className="h-3.5 w-3.5" /> Add Lender
            </Button>
            {isLenderEditing ? (
              <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setIsLenderEditing(false)}>
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => setIsLenderEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
          </div>
        </div>

        {/* Lender table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 px-3 bg-muted/30" />
                <TableHead className="text-xs font-semibold bg-muted/30">Lender Name</TableHead>
                <TableHead className="text-xs font-semibold bg-muted/30">Tenure (mo)</TableHead>
                <TableHead className="text-xs font-semibold bg-muted/30">Interest Rate</TableHead>
                <TableHead className="text-xs font-semibold bg-muted/30 text-right">EMI</TableHead>
                <TableHead className="text-xs font-semibold bg-muted/30 text-right">Reduction Amt</TableHead>
                <TableHead className="text-xs font-semibold bg-muted/30 text-center">Top-up</TableHead>
                <TableHead className="text-xs font-semibold bg-muted/30 text-center">Add Top-up</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lenderRows.map((l) => {
                const isSelected  = selectedLenderId === l.id;
                const isAutoSel   = isSelected && autoSelected;
                const hasTopUp    = l.topUpAvailable > 0;
                const canTopUp    = isSelected && hasTopUp;
                const topUpActive = isSelected && topUpEnabled && hasTopUp;
                return (
                  <TableRow
                    key={l.id}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? isAutoSel
                          ? "bg-green-50 border-l-2 border-l-green-500"
                          : "bg-primary/5 border-l-2 border-l-primary"
                        : "hover:bg-muted/20"
                    }`}
                    onClick={() => !isLenderEditing && handleSelectLender(l.id)}
                  >
                    <TableCell className="px-3 py-3">
                      <Checkbox checked={isSelected}
                        onCheckedChange={() => !isLenderEditing && handleSelectLender(l.id)}
                        className="h-4 w-4" />
                    </TableCell>
                    <TableCell className="py-3">
                      {isLenderEditing ? (
                        <Input value={l.name}
                          onChange={(e) => updateLender(l.id, "name", e.target.value)}
                          className="h-7 text-xs w-32 border-primary/40"
                          onClick={(e) => e.stopPropagation()} />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">{l.name}</span>
                          {isAutoSel && (
                            <span className="text-[9px] font-bold text-green-700 bg-green-100 border border-green-300 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                              <Sparkles className="h-2.5 w-2.5" /> Best
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      {isLenderEditing ? (
                        <Input type="number" value={l.tenureMonths}
                          onChange={(e) => updateLender(l.id, "tenureMonths", Number(e.target.value))}
                          className="h-7 text-xs w-20 border-primary/40"
                          onClick={(e) => e.stopPropagation()} />
                      ) : (
                        <span className="text-sm text-muted-foreground">{l.tenureMonths} mo</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      {isLenderEditing ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Input type="number" value={l.roi} step="0.1"
                            onChange={(e) => updateLender(l.id, "roi", Number(e.target.value))}
                            className="h-7 text-xs w-20 border-primary/40" />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">{l.roi}%</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-sm font-medium text-right whitespace-nowrap">
                      {isLenderEditing ? (
                        <Input type="number" value={l.overrideEMI !== undefined ? l.overrideEMI : ""}
                          onChange={(e) => updateLender(l.id, "overrideEMI", e.target.value === "" ? undefined as unknown as number : Number(e.target.value))}
                          className="h-7 text-xs w-28 border-primary/40 text-right"
                          placeholder={fmtR(calcPMT(inclClosureTotal, l.roi, l.tenureMonths))}
                          onClick={(e) => e.stopPropagation()} />
                      ) : (
                        <div className="flex flex-col items-end gap-0.5">
                          <span>{fmtR(l.computedEMI)}</span>
                          {l.overrideEMI && l.overrideEMI > 0 && (
                            <span className="text-[10px] text-amber-600 font-medium">overridden</span>
                          )}
                          {topUpActive && (
                            <span className="text-[10px] text-blue-600 font-medium">+top-up: {fmtR(l.topUpEMI)}</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-right whitespace-nowrap">
                      <span className={`text-sm font-semibold ${l.reduction >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {l.reduction >= 0 ? "↓ " : "↑ "}{fmtR(Math.abs(l.reduction))}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-center whitespace-nowrap">
                      {isLenderEditing ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Input type="number" value={l.topUpAvailable}
                            onChange={(e) => updateLender(l.id, "topUpAvailable", Number(e.target.value))}
                            className="h-7 text-xs w-28 border-primary/40 text-right" />
                        </div>
                      ) : hasTopUp ? (
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                          {fmtR(l.topUpAvailable)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-center">
                            <Switch checked={topUpActive} disabled={!canTopUp}
                              onCheckedChange={(v) => setTopUpEnabled(v)}
                              className="data-[state=checked]:bg-blue-600 scale-75" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="text-xs">
                          {!hasTopUp ? "Top-up not available" : canTopUp ? "Toggle top-up" : "Select this lender first"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* ── Inline new lender row ── */}
              {addingLender && (
                <TableRow className="bg-primary/5 border-t-2 border-primary/20">
                  <TableCell className="px-3 py-2.5">
                    <Checkbox disabled className="h-4 w-4 opacity-30" />
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Input autoFocus value={newLenderDraft.name}
                      onChange={(e) => setNewLenderDraft(p => ({ ...p, name: e.target.value }))}
                      className="h-7 text-xs w-32 border-primary/40" placeholder="Lender name" />
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Input type="number" value={newLenderDraft.tenureMonths}
                      onChange={(e) => setNewLenderDraft(p => ({ ...p, tenureMonths: Number(e.target.value) }))}
                      className="h-7 text-xs w-20 border-primary/40" />
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1">
                      <Input type="number" step="0.1" value={newLenderDraft.roi}
                        onChange={(e) => setNewLenderDraft(p => ({ ...p, roi: Number(e.target.value) }))}
                        className="h-7 text-xs w-20 border-primary/40" />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 text-right">
                    <span className="text-xs text-muted-foreground">{fmtR(calcPMT(inclClosureTotal, newLenderDraft.roi, newLenderDraft.tenureMonths))}</span>
                  </TableCell>
                  <TableCell />
                  <TableCell className="py-2.5">
                    <Input type="number" value={newLenderDraft.topUpAvailable}
                      onChange={(e) => setNewLenderDraft(p => ({ ...p, topUpAvailable: Number(e.target.value) }))}
                      className="h-7 text-xs w-28 border-primary/40 text-right" placeholder="0" />
                  </TableCell>
                  <TableCell className="py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button size="sm" className="h-6 text-[10px] px-2 gap-1" onClick={handleSaveNewLender}>
                        <Check className="h-3 w-3" /> Save
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 gap-1"
                        onClick={() => { setAddingLender(false); setNewLenderDraft({ name: "", tenureMonths: 60, roi: 12.0, topUpAvailable: 0 }); }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between">
          {autoSelected && selectedLenderId && (
            <p className="text-xs text-green-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Auto-selected <strong>{lenderData.find(l => l.id === selectedLenderId)?.name}</strong> — best EMI reduction
            </p>
          )}
          <div className="ml-auto">
            <Button onClick={handleLoanDetails} className="gap-2 px-6">
              Loan Details <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Outcome cards */}
        {checkResult && (
          <div className="grid grid-cols-4 gap-0 border rounded-lg overflow-hidden">
            <div className="p-4 border-r">
              <p className="text-xs text-muted-foreground mb-1">Principal Amount</p>
              <p className="text-base font-bold">{fmtR(checkResult.principal)}</p>
            </div>
            <div className="p-4 border-r">
              <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
              <p className="text-base font-bold">{fmtR(checkResult.interest)}</p>
            </div>
            <div className="p-4 border-r">
              <p className="text-xs text-muted-foreground mb-1">Total Repayment</p>
              <p className="text-base font-bold">{fmtR(checkResult.totalRepayment)}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-1">New FOIR</p>
              <p className={`text-base font-bold ${foirColor(checkResult.foir)}`}>
                {netSalary > 0 ? `${checkResult.foir.toFixed(2)}%` : "—"}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════ SECTION 4 · FREED COMPARISON ═══════════════ */}
      <div className="bg-card rounded-lg border p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">FREED Comparison</h3>
        <div className="grid grid-cols-2 gap-4">

          {/* ═══ WITHOUT FREED ═══ */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b bg-muted/30">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Without FREED</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-2 text-xs font-semibold bg-muted/20">Account</TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold bg-muted/20 text-right">EMI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>

                {/* Pre-consolidation FOIR — TOP */}
                <TableRow className={`hover:bg-transparent ${foirBg(preFOIR)}`}>
                  <TableCell className="px-4 py-2.5 text-sm font-bold text-foreground">Pre-consolidation FOIR</TableCell>
                  <TableCell className={`px-4 py-2.5 text-sm font-bold text-right ${foirColor(preFOIR)}`}>
                    {netSalary > 0 ? `${preFOIR.toFixed(2)}%` : "—"}
                  </TableCell>
                </TableRow>

                {/* Divider */}
                <TableRow className="pointer-events-none">
                  <TableCell colSpan={2} className="p-0"><div className="h-px bg-border mx-4" /></TableCell>
                </TableRow>

                {/* Total Monthly Obligation */}
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableCell className="px-4 py-2.5 text-sm font-semibold text-foreground">Total Monthly Obligation</TableCell>
                  <TableCell className="px-4 py-2.5 text-sm font-semibold text-right">{fmtR(existingTotalEMI)}</TableCell>
                </TableRow>

                {/* Divider */}
                <TableRow className="pointer-events-none">
                  <TableCell colSpan={2} className="p-0"><div className="h-px bg-border mx-4" /></TableCell>
                </TableRow>

                {/* Collapsible: All Creditors — BOTTOM */}
                <TableRow
                  className="hover:bg-muted/10 cursor-pointer select-none"
                  onClick={() => setWofAllOpen((o) => !o)}
                >
                  <TableCell colSpan={2} className="px-4 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        All Creditors ({included.length + excluded.length})
                      </span>
                      <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${wofAllOpen ? "" : "-rotate-90"}`} />
                    </div>
                  </TableCell>
                </TableRow>
                {wofAllOpen && [...included, ...excluded].map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/10">
                    <TableCell className="px-4 pl-7 py-2 text-sm text-foreground">{c.name}</TableCell>
                    <TableCell className="px-4 py-2 text-sm text-right font-medium">
                      {c.emi > 0 ? fmtR(c.emi) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {[...included, ...excluded].length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="px-4 py-4 text-xs text-center text-muted-foreground">No creditors added</TableCell>
                  </TableRow>
                )}

              </TableBody>
            </Table>
          </div>

          {/* ═══ WITH FREED ═══ */}
          <div className="border rounded-lg overflow-hidden border-primary/30">
            <div className="px-4 py-2.5 border-b bg-primary/5">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">With FREED</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-2 text-xs font-semibold bg-primary/5">Account</TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold bg-primary/5 text-right">EMI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>

                {/* Post-consolidation FOIR — TOP */}
                <TableRow className={`hover:bg-transparent ${foirBg(activePostFOIR)}`}>
                  <TableCell className="px-4 py-2.5 text-sm font-bold text-foreground">Post-consolidation FOIR</TableCell>
                  <TableCell className={`px-4 py-2.5 text-sm font-bold text-right ${foirColor(activePostFOIR)}`}>
                    {netSalary > 0 ? `${activePostFOIR.toFixed(2)}%` : "—"}
                  </TableCell>
                </TableRow>

                {/* New Monthly Obligation */}
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableCell className="px-4 py-2.5 text-sm font-semibold text-foreground">
                    New Monthly Obligation
                    {topUpEnabled && <span className="ml-1 text-[10px] text-blue-600">incl. top-up</span>}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-sm font-semibold text-right">
                    {fmtR(activeNewObligation)}
                  </TableCell>
                </TableRow>

                {/* Top-up FOIR comparison row */}
                {topUpEnabled && (
                  <TableRow className="bg-blue-50/40 hover:bg-blue-50/40">
                    <TableCell className="px-4 pl-7 py-2 text-xs font-medium text-blue-700">Without top-up FOIR</TableCell>
                    <TableCell className={`px-4 py-2 text-xs font-semibold text-right ${foirColor(postFOIR)}`}>
                      {netSalary > 0 ? `${postFOIR.toFixed(2)}%` : "—"}
                    </TableCell>
                  </TableRow>
                )}

                {/* Divider */}
                <TableRow className="pointer-events-none">
                  <TableCell colSpan={2} className="p-0"><div className="h-px bg-border mx-4" /></TableCell>
                </TableRow>

                {/* Consolidated Creditors EMI */}
                <TableRow className="hover:bg-muted/10">
                  <TableCell className="px-4 py-2.5 text-sm font-semibold text-foreground">
                    Consolidated Creditors EMI
                    {topUpEnabled && (
                      <span className="ml-1.5 text-[10px] text-blue-600">(incl. top-up)</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-sm font-semibold text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-right">
                        <div className="text-sm font-semibold">{fmtR(topUpEnabled ? topUpLenderEMI : consolidationEMI)}</div>
                        <div className="text-[10px] font-normal text-muted-foreground">
                          {fmtR(topUpEnabled ? inclClosureTotal + selectedLender.topUpAvailable : inclClosureTotal)}
                        </div>
                      </div>
                      <button
                        onClick={() => setConsolidatedDropOpen(o => !o)}
                        className="h-5 w-5 rounded flex items-center justify-center hover:bg-muted/50 text-muted-foreground shrink-0">
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${consolidatedDropOpen ? "" : "-rotate-90"}`} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                {consolidatedDropOpen && included.map((c) => (
                  <TableRow key={`cdrop-${c.id}`} className="bg-blue-50/30 hover:bg-blue-50/50">
                    <TableCell className="px-4 pl-8 py-1.5 text-xs font-medium text-blue-700">{c.name}</TableCell>
                    <TableCell className="px-4 py-1.5 text-xs font-semibold text-right text-blue-700">
                      {c.emi > 0 ? fmtR(c.emi) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {consolidatedDropOpen && included.length === 0 && (
                  <TableRow className="bg-blue-50/20">
                    <TableCell colSpan={2} className="px-4 py-2 text-xs text-center text-muted-foreground">No included creditors</TableCell>
                  </TableRow>
                )}

                {/* Divider */}
                <TableRow className="pointer-events-none">
                  <TableCell colSpan={2} className="p-0"><div className="h-px bg-border mx-4" /></TableCell>
                </TableRow>

                {/* Collapsible: Excluded Creditors — show EMI */}
                <TableRow
                  className="hover:bg-muted/10 cursor-pointer select-none"
                  onClick={() => setWfExcOpen((o) => !o)}
                >
                  <TableCell colSpan={2} className="px-4 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Excluded Creditors ({excluded.length})
                      </span>
                      <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${wfExcOpen ? "" : "-rotate-90"}`} />
                    </div>
                  </TableCell>
                </TableRow>
                {wfExcOpen && excluded.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/10">
                    <TableCell className="px-4 pl-7 py-2 text-sm text-foreground">{c.name}</TableCell>
                    <TableCell className="px-4 py-2 text-sm text-right font-medium">
                      {c.emi > 0 ? fmtR(c.emi) : "—"}
                    </TableCell>
                  </TableRow>
                ))}

                {included.length === 0 && excluded.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="px-4 py-4 text-xs text-center text-muted-foreground">No creditors added</TableCell>
                  </TableRow>
                )}

              </TableBody>
            </Table>
          </div>

        </div>
      </div>

      {/* ═══════════════ SECTION 5 · DOCUMENT MANAGER ═══════════════ */}
      <DocumentManager />

      {/* ═══════════════ ADD CREDITOR DIALOG ═══════════════ */}
      <Dialog open={addCreditorOpen} onOpenChange={setAddCreditorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Add New Creditor
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Creditor / Bank Name <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="e.g. HDFC Bank, Bajaj Finance"
                value={newCred.name}
                onChange={(e) => setNewCred({ ...newCred, name: e.target.value })}
                className="h-9 text-sm" autoFocus />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Debt Type</Label>
              <Select value={newCred.debtType} onValueChange={(v) => setNewCred({ ...newCred, debtType: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEBT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Outstanding Amount (₹)</Label>
                <Input type="number" placeholder="e.g. 250000"
                  value={newCred.closureAmount}
                  onChange={(e) => setNewCred({ ...newCred, closureAmount: e.target.value })}
                  className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Monthly EMI (₹)</Label>
                <Input type="number" placeholder="e.g. 8000"
                  value={newCred.emi}
                  onChange={(e) => setNewCred({ ...newCred, emi: e.target.value })}
                  className="h-9 text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Add To</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setNewCred({ ...newCred, addTo: "included" })}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                    newCred.addTo === "included"
                      ? "border-green-400 bg-green-50 text-green-800"
                      : "border-border text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  <div className="h-4 w-4 rounded-full bg-green-100 border border-green-400 flex items-center justify-center shrink-0">
                    <Plus className="h-2.5 w-2.5 text-green-600" />
                  </div>
                  Included
                </button>
                <button
                  onClick={() => setNewCred({ ...newCred, addTo: "excluded" })}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                    newCred.addTo === "excluded"
                      ? "border-red-400 bg-red-50 text-red-800"
                      : "border-border text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  <div className="h-4 w-4 rounded-full bg-red-100 border border-red-400 flex items-center justify-center shrink-0">
                    <Minus className="h-2.5 w-2.5 text-red-500" />
                  </div>
                  Excluded
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"
              onClick={() => { setAddCreditorOpen(false); setNewCred({ name: "", debtType: "PERSONAL_LOAN", closureAmount: "", emi: "", addTo: "included" }); }}>
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleAddCreditor} disabled={!newCred.name.trim()}>
              <Plus className="h-3.5 w-3.5" /> Add Creditor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default DashboardTab;
