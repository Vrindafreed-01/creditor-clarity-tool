import { useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Minus, X } from "lucide-react";

interface Creditor {
  id: string;
  name: string;
  debtType: string;
  accountNumber: string;
  openDate: string;
  sanctionedAmount: number;
  currentBalance: number;
  closureAmount: number;
  tenure: number;
  currentROI: string;
  emi: number;
}

const DEBT_TYPES = ["CREDIT_CARD", "PERSONAL_LOAN", "HOME_LOAN", "AUTO_LOAN", "BUSINESS_LOAN"];

const initialIncluded: Creditor[] = [
  { id: "1", name: "SOUTH INDIAN BANK", debtType: "CREDIT_CARD", accountNumber: "XXXXXXXXXXXXXXX2379", openDate: "18 Jul 23", sanctionedAmount: 115361, currentBalance: 100000, closureAmount: 100000, tenure: 0, currentROI: "--", emi: 5000 },
  { id: "2", name: "Aditya Birla Capital Limited", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXXXXXX7905", openDate: "21 Jan 25", sanctionedAmount: 294427, currentBalance: 227879, closureAmount: 227879, tenure: 0, currentROI: "--", emi: 11000 },
  { id: "3", name: "Krazybee Services Pvt. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXURRL", openDate: "12 Jul 25", sanctionedAmount: 246000, currentBalance: 197786, closureAmount: 197786, tenure: 30, currentROI: "--", emi: 7000 },
  { id: "4", name: "HDFC BANK LTD", debtType: "PERSONAL_LOAN", accountNumber: "XXXXX7969", openDate: "26 Aug 25", sanctionedAmount: 511541, currentBalance: 468092, closureAmount: 468092, tenure: 0, currentROI: "--", emi: 13000 },
  { id: "5", name: "Respo Financial Capital Pvt. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "12345", openDate: "1 Oct 25", sanctionedAmount: 200000, currentBalance: 180000, closureAmount: 180000, tenure: 0, currentROI: "--", emi: 12000 },
];

const initialExcluded: Creditor[] = [
  { id: "e1", name: "HDFC BANK LTD", debtType: "CREDIT_CARD", accountNumber: "XXXXXXXXXXXXXXX9181", openDate: "28 Sep 23", sanctionedAmount: 208530, currentBalance: 198834, closureAmount: 198834, tenure: 0, currentROI: "--", emi: 9942 },
  { id: "e2", name: "Responce Investments Limited", debtType: "PERSONAL_LOAN", accountNumber: "123456", openDate: "2 Oct 26", sanctionedAmount: 1, currentBalance: 1, closureAmount: 1, tenure: 0, currentROI: "--", emi: 0 },
  { id: "e3", name: "SMFG India Credit Co. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXX3029", openDate: "7 Jul 25", sanctionedAmount: 60000, currentBalance: 32311, closureAmount: 32311, tenure: 0, currentROI: "--", emi: 7000 },
  { id: "e4", name: "Early Salary Pvt. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXXXX3284", openDate: "6 Nov 25", sanctionedAmount: 8000, currentBalance: 5451, closureAmount: 5451, tenure: 0, currentROI: "--", emi: 5000 },
  { id: "e5", name: "HDB Financial Services Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXX0586", openDate: "6 Nov 25", sanctionedAmount: 32000, currentBalance: 21801, closureAmount: 21801, tenure: 6, currentROI: "--", emi: 0 },
];

const fmt = (n: number) => `₹${Math.round(n).toLocaleString()}`;

/* ── Table column headers ── */
const TableColumns = ({ isEditing }: { isEditing: boolean }) => (
  <TableRow className="hover:bg-transparent">
    {isEditing && <TableHead className="w-8 px-2 py-2" />}
    <TableHead className="w-8 px-2 py-2" />
    <TableHead className="text-[10px] px-2 py-2 font-semibold min-w-[90px]">Creditor Name</TableHead>
    <TableHead className="text-[10px] px-2 py-2 font-semibold min-w-[80px]">Debt Type</TableHead>
    <TableHead className="text-[10px] px-2 py-2 font-semibold min-w-[85px]">Account No.</TableHead>
    <TableHead className="text-[10px] px-2 py-2 font-semibold min-w-[68px]">Open Date</TableHead>
    <TableHead className="text-[10px] px-2 py-2 font-semibold text-right min-w-[80px]">Sanctioned</TableHead>
    <TableHead className="text-[10px] px-2 py-2 font-semibold text-right min-w-[75px]">Balance</TableHead>
    <TableHead className="text-[10px] px-2 py-2 font-semibold text-right min-w-[65px]">EMI</TableHead>
  </TableRow>
);

/* ── Creditor row ── */
const CreditorRow = ({
  creditor,
  actionLabel,
  actionBtnClass,
  actionIcon,
  onAction,
  isEditing,
  isSelected,
  onSelect,
}: {
  creditor: Creditor;
  actionLabel: string;
  actionBtnClass: string;
  actionIcon: ReactNode;
  onAction: (id: string) => void;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (creditor: Creditor) => void;
}) => (
  <TableRow
    className={`group transition-colors ${
      isSelected
        ? "bg-primary/5 border-l-2 border-l-primary"
        : isEditing
        ? "cursor-pointer hover:bg-muted/40"
        : "hover:bg-muted/30"
    }`}
    onClick={() => isEditing && onSelect(creditor)}
  >
    {/* Checkbox — edit mode only */}
    {isEditing && (
      <TableCell className="px-2 py-1.5 w-8" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(creditor)}
          className="h-4 w-4"
        />
      </TableCell>
    )}

    {/* +/- action button */}
    <TableCell className="px-2 py-1.5 w-8" onClick={(e) => { e.stopPropagation(); onAction(creditor.id); }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${actionBtnClass}`}>
            {actionIcon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {actionLabel}
        </TooltipContent>
      </Tooltip>
    </TableCell>

    {/* Creditor Name */}
    <TableCell className="px-2 py-1.5 max-w-[100px]">
      <span className="block truncate text-[11px] font-medium text-primary" title={creditor.name}>
        {creditor.name}
      </span>
    </TableCell>

    {/* Debt Type */}
    <TableCell className="px-2 py-1.5">
      <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal whitespace-nowrap border-muted-foreground/30">
        {creditor.debtType.replace(/_/g, "\u00A0")}
      </Badge>
    </TableCell>

    {/* Account No. */}
    <TableCell className="px-2 py-1.5 max-w-[90px]">
      <span className="block truncate text-[11px] text-muted-foreground" title={creditor.accountNumber}>
        {creditor.accountNumber}
      </span>
    </TableCell>

    {/* Open Date */}
    <TableCell className="px-2 py-1.5">
      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{creditor.openDate}</span>
    </TableCell>

    {/* Sanctioned */}
    <TableCell className="px-2 py-1.5 text-right">
      <span className="text-[11px] whitespace-nowrap">{fmt(creditor.sanctionedAmount)}</span>
    </TableCell>

    {/* Balance */}
    <TableCell className="px-2 py-1.5 text-right">
      <span className="text-[11px] whitespace-nowrap">{fmt(creditor.currentBalance)}</span>
    </TableCell>

    {/* EMI */}
    <TableCell className="px-2 py-1.5 text-right">
      <span className="text-[11px] whitespace-nowrap font-medium">
        {creditor.emi > 0 ? fmt(creditor.emi) : "—"}
      </span>
    </TableCell>
  </TableRow>
);

/* ── Creditor edit panel — rendered inside RightPanel ── */
interface CreditorEditPanelProps {
  initialDraft: Creditor;
  onSave: (draft: Creditor) => void;
  onClose: () => void;
}

const CreditorEditPanel = ({ initialDraft, onSave, onClose }: CreditorEditPanelProps) => {
  const [draft, setDraft] = useState<Creditor>(initialDraft);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <h3 className="text-sm font-semibold">Edit Creditor</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Creditor Name</Label>
          <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Account Number</Label>
          <Input value={draft.accountNumber} onChange={(e) => setDraft({ ...draft, accountNumber: e.target.value })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Type of Debt</Label>
          <Select value={draft.debtType} onValueChange={(v) => setDraft({ ...draft, debtType: v })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEBT_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">{t.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Open Date</Label>
          <Input value={draft.openDate} onChange={(e) => setDraft({ ...draft, openDate: e.target.value })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Sanctioned Limit</Label>
          <Input type="number" value={draft.sanctionedAmount} onChange={(e) => setDraft({ ...draft, sanctionedAmount: Number(e.target.value) })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Current Balance</Label>
          <Input type="number" value={draft.currentBalance} onChange={(e) => setDraft({ ...draft, currentBalance: Number(e.target.value) })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Closure Amount</Label>
          <Input type="number" value={draft.closureAmount} onChange={(e) => setDraft({ ...draft, closureAmount: Number(e.target.value) })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Total Tenure</Label>
          <Input type="number" value={draft.tenure} onChange={(e) => setDraft({ ...draft, tenure: Number(e.target.value) })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Rate of Interest</Label>
          <Input value={draft.currentROI} onChange={(e) => setDraft({ ...draft, currentROI: e.target.value })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">EMI</Label>
          <Input type="number" value={draft.emi} onChange={(e) => setDraft({ ...draft, emi: Number(e.target.value) })} className="h-8 text-sm" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t shrink-0">
        <Button className="w-full h-9 text-sm" onClick={() => onSave(draft)}>
          Save Creditor
        </Button>
      </div>
    </div>
  );
};

interface CreditorCalculatorTabProps {
  isEditing?: boolean;
  onSetEditPanel?: (content: ReactNode | null) => void;
}

const CreditorCalculatorTab = ({ isEditing = false, onSetEditPanel }: CreditorCalculatorTabProps) => {
  const [included, setIncluded] = useState(initialIncluded);
  const [excluded, setExcluded] = useState(initialExcluded);

  const [loanAmount, setLoanAmount] = useState(1700757);
  const [tenure, setTenure] = useState("72");
  const [rateOfInterest, setRateOfInterest] = useState(16);
  const [existingTotalEMI, setExistingTotalEMI] = useState(69942);
  const [calculated, setCalculated] = useState(true);

  // ── Edit panel state ──────────────────────────────────────────────────────────
  const [selectedCreditorId, setSelectedCreditorId] = useState<string | null>(null);
  const selectedFromRef = useRef<"included" | "excluded" | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setSelectedCreditorId(null);
      selectedFromRef.current = null;
      onSetEditPanel?.(null);
    }
  }, [isEditing, onSetEditPanel]);

  const closePanel = useCallback(() => {
    setSelectedCreditorId(null);
    selectedFromRef.current = null;
    onSetEditPanel?.(null);
  }, [onSetEditPanel]);

  const handlePanelSave = useCallback((draft: Creditor) => {
    if (selectedFromRef.current === "included") {
      setIncluded((prev) => prev.map((c) => (c.id === draft.id ? draft : c)));
    } else {
      setExcluded((prev) => prev.map((c) => (c.id === draft.id ? draft : c)));
    }
    closePanel();
  }, [closePanel]);

  const handleSelectCreditor = (creditor: Creditor, from: "included" | "excluded") => {
    if (selectedCreditorId === creditor.id) {
      closePanel();
    } else {
      setSelectedCreditorId(creditor.id);
      selectedFromRef.current = from;
      onSetEditPanel?.(
        <CreditorEditPanel
          key={creditor.id}
          initialDraft={creditor}
          onSave={handlePanelSave}
          onClose={closePanel}
        />
      );
    }
  };

  const income = 100000;
  const totalSanctioned = included.reduce((s, c) => s + c.sanctionedAmount, 0);
  const totalCurrentBalance = included.reduce((s, c) => s + c.currentBalance, 0);
  const totalEMI = included.reduce((s, c) => s + c.emi, 0);
  const totalDebt = included.reduce((s, c) => s + c.closureAmount, 0);

  const handleExclude = (id: string) => {
    const creditor = included.find((c) => c.id === id);
    if (creditor) {
      setIncluded((prev) => prev.filter((c) => c.id !== id));
      setExcluded((prev) => [...prev, creditor]);
      if (selectedCreditorId === id) closePanel();
    }
  };

  const handleInclude = (id: string) => {
    const creditor = excluded.find((c) => c.id === id);
    if (creditor) {
      setExcluded((prev) => prev.filter((c) => c.id !== id));
      setIncluded((prev) => [...prev, creditor]);
      if (selectedCreditorId === id) closePanel();
    }
  };

  // ── Calculator ────────────────────────────────────────────────────────────────
  const monthlyRate = rateOfInterest / 100 / 12;
  const tenureMonths = parseInt(tenure);
  const loanEMI =
    monthlyRate > 0 && tenureMonths > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
      : 0;
  const totalInterest = loanEMI * tenureMonths - loanAmount;
  const totalRepayment = loanEMI * tenureMonths;
  const netTangibleBenefit = income > 0 ? ((income - (loanEMI + totalEMI)) / income) * 100 : 0;
  const cashFreed = income - (loanEMI + totalEMI) - (income - existingTotalEMI);

  const allEMIs = included.map((c) => ({ account: c.name, emi: c.emi }));
  const excludedEMIs = excluded.map((c) => ({ account: c.name, emi: c.emi }));

  const preFOIR = income > 0 ? (existingTotalEMI / income) * 100 : 0;
  const newTotalObligation = Math.round(loanEMI) + excluded.reduce((s, c) => s + c.emi, 0);
  const postFOIR = income > 0 ? (newTotalObligation / income) * 100 : 0;

  const totalsColSpan = isEditing ? 6 : 5;

  return (
    <div className="space-y-5">
      {/* ── Header strip ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-foreground">Creditors</h2>
        <div className="h-4 w-px bg-border" />
        <Badge variant="outline" className="text-xs font-normal">
          Total Debt — {fmt(totalDebt)}
        </Badge>
        {isEditing && (
          <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100">
            Select a creditor row to edit its details
          </Badge>
        )}
      </div>

      {/* ── Side-by-side creditor tables ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Include Creditors */}
        <div className={`border rounded-lg overflow-hidden ${isEditing ? "border-amber-300 ring-1 ring-amber-200" : ""}`}>
          <div className="px-3 py-2 bg-green-50/60 border-b flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-green-100 border border-green-400 flex items-center justify-center shrink-0">
              <Plus className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-800">Include Creditors</span>
            <span className="ml-auto text-[10px] font-semibold text-green-700 bg-green-100 border border-green-300 rounded-full px-1.5 py-0.5">
              {included.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableColumns isEditing={isEditing} /></TableHeader>
              <TableBody>
                {included.map((c) => (
                  <CreditorRow
                    key={c.id}
                    creditor={c}
                    actionLabel="Exclude creditor"
                    actionBtnClass="bg-orange-500 hover:bg-orange-600 text-white"
                    actionIcon={<Minus className="h-3 w-3" />}
                    onAction={handleExclude}
                    isEditing={isEditing}
                    isSelected={selectedCreditorId === c.id}
                    onSelect={(cred) => handleSelectCreditor(cred, "included")}
                  />
                ))}
                {included.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isEditing ? 9 : 8} className="text-center py-6 text-xs text-muted-foreground">
                      No included creditors
                    </TableCell>
                  </TableRow>
                )}
                {included.length > 0 && (
                  <TableRow className="bg-muted/40 border-t-2 border-muted">
                    <TableCell colSpan={totalsColSpan} className="px-2 py-1.5 text-[10px] text-muted-foreground font-semibold">
                      Totals
                    </TableCell>
                    <TableCell className="px-2 py-1.5 text-[11px] text-right font-semibold whitespace-nowrap">
                      {fmt(totalSanctioned)}
                    </TableCell>
                    <TableCell className="px-2 py-1.5 text-[11px] text-right font-semibold whitespace-nowrap">
                      {fmt(totalCurrentBalance)}
                    </TableCell>
                    <TableCell className="px-2 py-1.5 text-[11px] text-right font-semibold whitespace-nowrap">
                      {fmt(totalEMI)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Exclude Creditors */}
        <div className={`border rounded-lg overflow-hidden ${isEditing ? "border-amber-300 ring-1 ring-amber-200" : ""}`}>
          <div className="px-3 py-2 bg-red-50/60 border-b flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-red-100 border border-red-400 flex items-center justify-center shrink-0">
              <Minus className="h-3 w-3 text-red-500" />
            </div>
            <span className="text-xs font-semibold text-red-800">Exclude Creditors</span>
            <span className="ml-auto text-[10px] font-semibold text-red-700 bg-red-100 border border-red-300 rounded-full px-1.5 py-0.5">
              {excluded.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableColumns isEditing={isEditing} /></TableHeader>
              <TableBody>
                {excluded.map((c) => (
                  <CreditorRow
                    key={c.id}
                    creditor={c}
                    actionLabel="Include creditor"
                    actionBtnClass="bg-[#1e3a5f] hover:bg-[#152d4a] text-white"
                    actionIcon={<Plus className="h-3 w-3" />}
                    onAction={handleInclude}
                    isEditing={isEditing}
                    isSelected={selectedCreditorId === c.id}
                    onSelect={(cred) => handleSelectCreditor(cred, "excluded")}
                  />
                ))}
                {excluded.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isEditing ? 9 : 8} className="text-center py-6 text-xs text-muted-foreground">
                      No excluded creditors
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ── Calculator Section ── */}
      <div className="bg-card rounded-lg border p-5 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="h-9 text-sm pl-7" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tenure (months)</Label>
            <Select value={tenure} onValueChange={setTenure}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[12, 24, 36, 48, 60, 72, 84, 96].map((t) => (
                  <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Rate of Interest (%)</Label>
            <Input type="number" value={rateOfInterest} onChange={(e) => setRateOfInterest(Number(e.target.value))} className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Existing Total EMI</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input type="number" value={existingTotalEMI} onChange={(e) => setExistingTotalEMI(Number(e.target.value))} className="h-9 text-sm pl-7" />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="text-sm font-medium px-8" onClick={() => setCalculated(true)}>
            Calculate Loan EMI
          </Button>
        </div>

        {calculated && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/20">
                <span className="text-xs text-muted-foreground">Loan EMI Amount</span>
                <span className="text-sm font-bold">{fmt(loanEMI)}</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/20">
                <span className="text-xs text-muted-foreground">Total Interest Payable</span>
                <span className="text-sm font-bold">{fmt(totalInterest)}</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/20">
                <span className="text-xs text-muted-foreground">Total Repayment</span>
                <span className="text-sm font-bold">{fmt(totalRepayment)}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/20">
                <span className="text-xs text-muted-foreground">Income</span>
                <span className="text-sm font-bold">{fmt(income)}</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/20">
                <span className="text-xs text-muted-foreground">Net Tangible Benefit</span>
                <span className="text-sm font-bold">{netTangibleBenefit.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/20">
                <span className="text-xs text-muted-foreground">Cash FREED</span>
                <span className="text-sm font-bold">{fmt(cashFreed)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="border rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-muted/30 border-b">
                  <span className="text-xs font-semibold">Pre-Consolidation FOIR</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-semibold">Account</TableHead>
                      <TableHead className="text-[10px] font-semibold text-right">EMI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEMIs.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs py-1.5 max-w-[180px] truncate">{item.account}</TableCell>
                        <TableCell className="text-xs py-1.5 text-right">{fmt(item.emi)}</TableCell>
                      </TableRow>
                    ))}
                    {excludedEMIs.map((item, i) => (
                      <TableRow key={`ex-${i}`}>
                        <TableCell className="text-xs py-1.5 max-w-[180px] truncate">{item.account}</TableCell>
                        <TableCell className="text-xs py-1.5 text-right">{fmt(item.emi)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t">
                      <TableCell className="text-xs py-1.5 font-medium">Total Monthly Obligation</TableCell>
                      <TableCell className="text-xs py-1.5 text-right font-medium">{fmt(existingTotalEMI)}</TableCell>
                    </TableRow>
                    <TableRow className={preFOIR > 50 ? "bg-red-50" : "bg-green-50"}>
                      <TableCell className="text-xs py-1.5 font-bold">Pre-Consolidation FOIR</TableCell>
                      <TableCell className={`text-xs py-1.5 text-right font-bold ${preFOIR > 50 ? "text-destructive" : "text-green-700"}`}>
                        {preFOIR.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-muted/30 border-b">
                  <span className="text-xs font-semibold">Post-Consolidation FOIR</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-semibold">Account</TableHead>
                      <TableHead className="text-[10px] font-semibold text-right">EMI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs py-1.5">Consolidation Loan</TableCell>
                      <TableCell className="text-xs py-1.5 text-right">{fmt(loanEMI)}</TableCell>
                    </TableRow>
                    {excludedEMIs.map((item, i) => (
                      <TableRow key={`post-${i}`}>
                        <TableCell className="text-xs py-1.5 max-w-[180px] truncate">{item.account}</TableCell>
                        <TableCell className="text-xs py-1.5 text-right">{fmt(item.emi)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t">
                      <TableCell className="text-xs py-1.5 font-medium">New Total Monthly Obligation</TableCell>
                      <TableCell className="text-xs py-1.5 text-right font-medium">{fmt(newTotalObligation)}</TableCell>
                    </TableRow>
                    <TableRow className={postFOIR > 50 ? "bg-red-50" : "bg-green-50"}>
                      <TableCell className="text-xs py-1.5 font-bold">Post-Consolidation FOIR</TableCell>
                      <TableCell className={`text-xs py-1.5 text-right font-bold ${postFOIR > 50 ? "text-destructive" : "text-green-700"}`}>
                        {postFOIR.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreditorCalculatorTab;
