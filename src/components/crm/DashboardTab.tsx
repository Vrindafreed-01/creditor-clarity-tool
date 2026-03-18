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
  RefreshCw,
  Search,
  MoreVertical,
  Eye,
} from "lucide-react";
import type { Creditor } from "@/types/creditor";
import { DEBT_TYPES } from "@/types/creditor";

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

/* ── Lender suggestions ── */
const LENDER_SUGGESTIONS = [
  "AFL", "TATA Capital", "IDFC First", "Bajaj Finserv", "Piramal Finance",
  "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "SBI",
  "Bank of Baroda", "Canara Bank", "Union Bank", "IndusInd Bank",
  "Yes Bank", "Federal Bank", "RBL Bank", "Hero FinCorp",
  "Fullerton India", "Muthoot Finance", "Manappuram Finance",
  "L&T Finance", "Cholamandalam", "Shriram Finance", "IndiaBulls",
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
    rentAmount: "", additionalIncome: "", cibilScore: "",
  });
  const netSalary = parseFloat(qualForm.netSalary) || 0;

  /* ── Inline lender + FREED state ── */
  const [addingLender, setAddingLender] = useState(false);
  const [newLenderDraft, setNewLenderDraft] = useState({ name: "", tenureMonths: 60, roi: 12.0, topUpAvailable: 0 });
  const [lenderSearchOpen, setLenderSearchOpen] = useState(false);
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
  const [topUpEnabled, setTopUpEnabled] = useState(false);
  const [autoSelected, setAutoSelected] = useState(false);

  const handleSelectLender = (id: string) => {
    const newId = id === selectedLenderId ? null : id;
    setSelectedLenderId(newId);
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
    const best = lenderRows.reduce((prev, curr) => curr.reduction > prev.reduction ? curr : prev);
    setSelectedLenderId(best.id);
    setAutoSelected(true);
    setTimeout(() => lenderSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  /* ── Without/With FREED values ── */
  const selectedLender   = lenderData.find((l) => l.id === selectedLenderId) ?? lenderData[0];
  const consolidationEMI = calcPMT(inclClosureTotal, selectedLender.roi, selectedLender.tenureMonths);
  const newObligation    = consolidationEMI + exclEMITotal;
  const preFOIR          = netSalary > 0 ? (existingTotalEMI / netSalary) * 100 : 0;
  const postFOIR         = netSalary > 0 ? (newObligation / netSalary) * 100 : 0;

  const topUpLenderEMI     = calcPMT(inclClosureTotal + selectedLender.topUpAvailable, selectedLender.roi, selectedLender.tenureMonths);
  const topUpNewObligation = topUpLenderEMI + exclEMITotal;
  const postFOIRWithTopUp  = netSalary > 0 ? (topUpNewObligation / netSalary) * 100 : 0;

  const activeNewObligation = topUpEnabled ? topUpNewObligation : newObligation;
  const activePostFOIR      = topUpEnabled ? postFOIRWithTopUp : postFOIR;

  /* ── Sales rep action states ── */

  /* ── Generate Document state ── */
  const [docForm, setDocForm] = useState({
    loanNumber: "", tenure: "72", rateOfInterest: "", loanApprovedOn: "",
    emiStartDate: "", loanApprovedAmount: "",
  });
  const [agreements, setAgreements] = useState<Array<{
    ssaToken: string; generatedOn: string; status: string; signedOn: string;
    ipAddr: string; loanNumber: string; signed: boolean;
  }>>([]);
  const [showDocForm, setShowDocForm] = useState(true);

  const handleGenerateAgreement = () => {
    if (!docForm.loanNumber.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
    setAgreements((prev) => [...prev, {
      ssaToken: `SSA-${Date.now()}`,
      generatedOn: dateStr,
      status: "PENDING",
      signedOn: "—",
      ipAddr: "—",
      loanNumber: docForm.loanNumber,
      signed: false,
    }]);
    setShowDocForm(false);
  };

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
            <Label className="crm-field-label">Housing Type (Permanent City)</Label>
            <Select value={qualForm.housingType} onValueChange={(v) => setQualForm({ ...qualForm, housingType: v })}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Owned</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Monthly Rent Amount</Label>
            <Input type="number" value={qualForm.rentAmount}
              onChange={(e) => setQualForm({ ...qualForm, rentAmount: e.target.value })}
              className={inputCls} placeholder="e.g. 15000" />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Current City</Label>
            <Input value={qualForm.currentCity}
              onChange={(e) => setQualForm({ ...qualForm, currentCity: e.target.value })}
              className={inputCls} placeholder="Enter city" />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Housing Type (Current City)</Label>
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
            <Label className="crm-field-label">Additional Income (Incentive/Bonus)</Label>
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
          <div className="space-y-1.5">
            <Label className="crm-field-label">Cibil Score</Label>
            <Input type="number" value={qualForm.cibilScore}
              onChange={(e) => setQualForm({ ...qualForm, cibilScore: e.target.value })}
              className={inputCls} placeholder="e.g. 750" />
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
          <div className="border rounded-lg">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-green-50/50">
              <div className="h-5 w-5 rounded-full bg-green-100 border border-green-400 flex items-center justify-center shrink-0">
                <Plus className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-800">Included Creditors</span>
              <span className="ml-1 text-[10px] font-semibold text-green-700 bg-green-100 border border-green-300 rounded-full px-2 py-0.5">
                {included.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="sticky left-0 z-10 bg-card px-3 py-2 text-[10px] font-semibold bg-muted/30">Creditor Name</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Debt Type</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Open Date</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Sanctioned Limited</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Outstanding Amount</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">EMI</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">ROI</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Account No.</TableHead>
                    <TableHead className="sticky right-0 z-10 bg-card w-8 bg-muted/30" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {included.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/10">
                      <TableCell className="sticky left-0 z-10 bg-card px-3 py-2.5 min-w-[110px]">
                        {isDebtEditing ? (
                          <Input value={c.name}
                            onChange={(e) => setIncluded(p => p.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))}
                            className="h-7 text-xs border-primary/40" />
                        ) : (
                          <span className="text-xs font-medium text-primary leading-snug">{c.name}</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5">
                          {DEBT_ABBREV[c.debtType] ?? "AC"}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{c.openDate}</span>
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
                      <TableCell className="px-3 py-2.5 whitespace-nowrap">
                        {isDebtEditing ? (
                          <Input value={c.currentROI}
                            onChange={(e) => setIncluded(p => p.map(x => x.id === c.id ? { ...x, currentROI: e.target.value } : x))}
                            className="h-7 text-xs border-primary/40 w-16" />
                        ) : (
                          <span className="text-xs text-muted-foreground">{c.currentROI}</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2.5 whitespace-nowrap">
                        <button onClick={() => copyAcct(c.id, c.accountNumber)}
                          className="flex items-center gap-1 group hover:text-primary transition-colors"
                          title="Click to copy full account number">
                          <span className="text-xs font-mono text-foreground">••••{c.accountNumber.slice(-4)}</span>
                          {copiedId === c.id
                            ? <Check className="h-3 w-3 text-green-500" />
                            : <Copy className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />}
                        </button>
                      </TableCell>
                      <TableCell className="sticky right-0 z-10 bg-card px-2 py-2 text-center">
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
                    <TableRow><TableCell colSpan={9} className="text-center py-4 text-xs text-muted-foreground">No included creditors</TableCell></TableRow>
                  )}
                  {included.length > 0 && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20 border-t">
                      <TableCell colSpan={3} className="px-3 py-2 text-xs font-bold text-primary">Total</TableCell>
                      <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">{fmtV(inclSanctionedTotal)}</TableCell>
                      <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">{fmtV(inclClosureTotal)}</TableCell>
                      <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">{fmtV(inclEMITotal)}</TableCell>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* ── Excluded Creditors ── */}
          <div className="border rounded-lg">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-red-50/50">
              <div className="h-5 w-5 rounded-full bg-red-100 border border-red-400 flex items-center justify-center shrink-0">
                <Minus className="h-3 w-3 text-red-500" />
              </div>
              <span className="text-sm font-semibold text-red-800">Excluded Creditors</span>
              <span className="ml-1 text-[10px] font-semibold text-red-700 bg-red-100 border border-red-300 rounded-full px-2 py-0.5">
                {excluded.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="sticky left-0 z-10 bg-card px-3 py-2 text-[10px] font-semibold bg-muted/30">Creditor Name</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">STC</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Debt Type</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Open Date</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Sanctioned Limited</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">Outstanding Amount</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">EMI</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30 text-right">ROI</TableHead>
                    <TableHead className="px-3 py-2 text-[10px] font-semibold bg-muted/30">Account No.</TableHead>
                    <TableHead className="sticky right-0 z-10 bg-card w-8 bg-muted/30" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {excluded.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/10">
                      <TableCell className="sticky left-0 z-10 bg-card px-3 py-2.5 min-w-[110px]">
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
                        <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5">
                          {DEBT_ABBREV[c.debtType] ?? "AC"}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{c.openDate}</span>
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
                      <TableCell className="px-3 py-2.5 whitespace-nowrap">
                        {isDebtEditing ? (
                          <Input value={c.currentROI}
                            onChange={(e) => setExcluded(p => p.map(x => x.id === c.id ? { ...x, currentROI: e.target.value } : x))}
                            className="h-7 text-xs border-primary/40 w-16" />
                        ) : (
                          <span className="text-xs text-muted-foreground">{c.currentROI}</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2.5 whitespace-nowrap">
                        <button onClick={() => copyAcct(c.id, c.accountNumber)}
                          className="flex items-center gap-1 group hover:text-primary transition-colors"
                          title="Click to copy full account number">
                          <span className="text-xs font-mono text-foreground">••••{c.accountNumber.slice(-4)}</span>
                          {copiedId === c.id
                            ? <Check className="h-3 w-3 text-green-500" />
                            : <Copy className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />}
                        </button>
                      </TableCell>
                      <TableCell className="sticky right-0 z-10 bg-card px-2 py-2 text-center">
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
                    <TableRow><TableCell colSpan={10} className="text-center py-4 text-xs text-muted-foreground">No excluded creditors</TableCell></TableRow>
                  )}
                  {excluded.length > 0 && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20 border-t">
                      <TableCell colSpan={4} className="px-3 py-2 text-xs font-bold">Total</TableCell>
                      <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">{fmtV(exclSanctionedTotal)}</TableCell>
                      <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">{fmtV(exclClosureTotal)}</TableCell>
                      <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">{fmtV(exclEMITotal)}</TableCell>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

      </div>

      {/* ═══════════════ SECTION 2B · LENDER CHECK ═══════════════ */}
      <div className="bg-card rounded-lg border p-5">
        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleLoanDetails} className="gap-2 px-10 h-10 text-sm">
            Lender Check <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="w-full grid grid-cols-7 divide-x border rounded-lg overflow-hidden bg-muted/10">
            <div className="flex flex-col items-center gap-0.5 px-3 py-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Existing FOIR</span>
              <span className={`text-sm font-bold ${foirColor(existingFOIR)}`}>
                {netSalary > 0 ? `${existingFOIR.toFixed(2)}%` : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Current EMI</span>
              <span className="text-sm font-bold text-foreground">{fmtR(existingTotalEMI)}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">New FOIR</span>
              <span className={`text-sm font-bold ${selectedLenderId ? foirColor(activePostFOIR) : "text-muted-foreground"}`}>
                {selectedLenderId && netSalary > 0 ? `${activePostFOIR.toFixed(2)}%` : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">New EMI</span>
              <span className="text-sm font-bold text-foreground">
                {selectedLenderId ? fmtR(activeNewObligation) : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Reduction %</span>
              {selectedLenderId && existingTotalEMI > 0 ? (() => {
                const redPct = ((existingTotalEMI - activeNewObligation) / existingTotalEMI) * 100;
                return <span className={`text-sm font-bold ${redPct >= 0 ? "text-green-600" : "text-red-600"}`}>{redPct.toFixed(1)}%</span>;
              })() : <span className="text-sm font-bold text-muted-foreground">—</span>}
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Savings</span>
              {selectedLenderId ? (() => {
                const savings = existingTotalEMI - activeNewObligation;
                return <span className={`text-sm font-bold ${savings >= 0 ? "text-green-600" : "text-red-600"}`}>{savings >= 0 ? "↓ " : "↑ "}{fmtR(Math.abs(savings))}</span>;
              })() : <span className="text-sm font-bold text-muted-foreground">—</span>}
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">NDI</span>
              <span className="text-sm font-bold text-foreground">
                {selectedLenderId && netSalary > 0 ? fmtR(netSalary - activeNewObligation) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ SECTION 3 · PREFERRED LENDERS ═══════════════ */}
      <div ref={lenderSectionRef} className={`bg-card rounded-lg border p-5 space-y-4 transition-all ${isLenderEditing ? "border-primary/30 ring-1 ring-primary/10" : ""}`}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Preferred Lenders</h3>
          <div className="flex items-center gap-3">
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
                <TableHead className="text-xs font-semibold bg-muted/30 text-right">Total Repayment</TableHead>
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{l.name}</span>
                          {l.id === "1" && (
                            <span className="text-[9px] font-bold text-violet-700 bg-violet-100 border border-violet-300 rounded-full px-1.5 py-0.5">
                              User Preferred
                            </span>
                          )}
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
                            <span className="text-[10px] text-blue-600 font-medium">included: {fmtR(l.topUpEMI)}</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-right whitespace-nowrap">
                      <span className={`text-sm font-semibold ${l.reduction >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {l.reduction >= 0 ? "↓ " : "↑ "}{fmtR(Math.abs(l.reduction))}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">{fmtR(Math.round(l.computedEMI * l.tenureMonths))}</span>
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
                    <div className="relative">
                      <Input autoFocus value={newLenderDraft.name}
                        onChange={(e) => { setNewLenderDraft(p => ({ ...p, name: e.target.value })); setLenderSearchOpen(e.target.value.length > 0); }}
                        className="h-7 text-xs w-48 border-primary/40" placeholder="Lender name" />
                      {lenderSearchOpen && LENDER_SUGGESTIONS.filter(s => s.toLowerCase().includes(newLenderDraft.name.toLowerCase()) && newLenderDraft.name.length > 0).length > 0 && (
                        <div className="absolute z-50 bg-card border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto w-48">
                          {LENDER_SUGGESTIONS.filter(s => s.toLowerCase().includes(newLenderDraft.name.toLowerCase()) && newLenderDraft.name.length > 0).map(s => (
                            <button key={s} type="button"
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors"
                              onClick={() => { setNewLenderDraft(p => ({ ...p, name: s })); setLenderSearchOpen(false); }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
                  <TableCell className="py-2.5 text-right">
                    <span className="text-xs text-muted-foreground">{fmtR(Math.round(calcPMT(inclClosureTotal, newLenderDraft.roi, newLenderDraft.tenureMonths) * newLenderDraft.tenureMonths))}</span>
                  </TableCell>
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
                        onClick={() => { setAddingLender(false); setNewLenderDraft({ name: "", tenureMonths: 60, roi: 12.0, topUpAvailable: 0 }); setLenderSearchOpen(false); }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </div>

      {/* ═══════════════ SECTION 4 · SUMMARY ═══════════════ */}
      <div className="bg-card rounded-lg border p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Summary</h3>
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
                    Consolidation Loan
                    {topUpEnabled && (
                      <span className="ml-1.5 text-[10px] text-blue-600">(incl. top-up)</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-sm font-semibold text-right">
                    <span className="text-sm font-semibold">{fmtR(topUpEnabled ? topUpLenderEMI : consolidationEMI)}</span>
                  </TableCell>
                </TableRow>

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

      {/* ═══════════════ SECTION 5 · GENERATE AGREEMENT ═══════════════ */}
      <div className="bg-card rounded-lg border p-5 space-y-4">
        {showDocForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="crm-field-label">Loan Number</Label>
                <Input value={docForm.loanNumber}
                  onChange={(e) => setDocForm({ ...docForm, loanNumber: e.target.value })}
                  className={inputCls} placeholder="Enter loan number" />
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Tenure</Label>
                <Select value={docForm.tenure} onValueChange={(v) => setDocForm({ ...docForm, tenure: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[12, 24, 36, 48, 60, 72, 84, 96].map((t) => (
                      <SelectItem key={t} value={String(t)}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Rate of Interest</Label>
                <Input type="number" value={docForm.rateOfInterest}
                  onChange={(e) => setDocForm({ ...docForm, rateOfInterest: e.target.value })}
                  className={inputCls} placeholder="e.g. 16" />
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Consolidation Loan EMI</Label>
                <div className="h-9 flex items-center px-3 rounded-md border bg-muted/40 text-sm text-foreground">
                  {docForm.rateOfInterest && docForm.tenure && inclClosureTotal > 0
                    ? fmtR(calcPMT(inclClosureTotal, parseFloat(docForm.rateOfInterest), parseInt(docForm.tenure)))
                    : "₹ —"}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Loan Approved On</Label>
                <Input type="date" value={docForm.loanApprovedOn}
                  onChange={(e) => setDocForm({ ...docForm, loanApprovedOn: e.target.value })}
                  className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">EMI Start Date</Label>
                <Input type="date" value={docForm.emiStartDate}
                  onChange={(e) => setDocForm({ ...docForm, emiStartDate: e.target.value })}
                  className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Loan Approved Amount</Label>
                <Input type="number" value={docForm.loanApprovedAmount}
                  onChange={(e) => setDocForm({ ...docForm, loanApprovedAmount: e.target.value })}
                  className={inputCls} placeholder="₹ 0" />
              </div>
            </div>
            <div className="flex gap-3 justify-center pt-1">
              <Button variant="outline" size="sm" className="px-6" onClick={() => setShowDocForm(false)}>
                Cancel
              </Button>
              <Button variant="outline" size="sm" className="px-6 border-primary text-primary hover:bg-primary/5"
                onClick={handleGenerateAgreement}>
                Generate Agreement
              </Button>
            </div>
          </div>
        )}

        {/* DCP Agreement List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">DCP Agreement List</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-muted" onClick={() => {}}>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </button>
              <Button size="sm" variant="outline"
                className="gap-1.5 text-xs h-8 border-primary text-primary hover:bg-primary/5"
                onClick={() => setShowDocForm(true)}>
                <Plus className="h-3.5 w-3.5" /> Generate Agreement
              </Button>
              <button className="p-1.5 rounded hover:bg-muted">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>SSA Token</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signed On</TableHead>
                <TableHead>Ip Addr</TableHead>
                <TableHead>Loan Number</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead>Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-6">
                    No agreements generated yet
                  </TableCell>
                </TableRow>
              ) : (
                agreements.map((ag) => (
                  <TableRow key={ag.ssaToken} className="text-xs">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        {ag.ssaToken}
                        <button onClick={() => navigator.clipboard.writeText(ag.ssaToken)}
                          className="p-0.5 rounded hover:bg-muted">
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ag.generatedOn}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-muted-foreground/40 text-muted-foreground">
                        {ag.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ag.signedOn}</TableCell>
                    <TableCell className="text-muted-foreground">{ag.ipAddr}</TableCell>
                    <TableCell>{ag.loanNumber}</TableCell>
                    <TableCell>
                      <Badge className={ag.signed ? "bg-green-500 text-white text-[10px]" : "bg-gray-200 text-gray-600 text-[10px]"}>
                        {ag.signed ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 gap-1">
                        <Eye className="h-3 w-3" /> Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end gap-3 mt-3 text-xs text-muted-foreground">
            <span>Rows per page:</span>
            <Select defaultValue="15">
              <SelectTrigger className="h-7 w-14 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>{agreements.length === 0 ? "0-0 of 0" : `1-${agreements.length} of ${agreements.length}`}</span>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-muted disabled:opacity-40" disabled>‹</button>
              <button className="p-1 rounded hover:bg-muted disabled:opacity-40" disabled>›</button>
            </div>
          </div>
        </div>
      </div>

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
