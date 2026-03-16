import { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction, ReactNode } from "react";
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
import { Plus, Minus, X } from "lucide-react";
import type { Creditor } from "@/types/creditor";
import { DEBT_TYPES } from "@/types/creditor";

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
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <h3 className="text-sm font-semibold">Edit Creditor</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
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
          <Label className="text-xs text-muted-foreground">Total Outstanding Loan</Label>
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
      <div className="px-4 py-3 border-t shrink-0">
        <Button className="w-full h-9 text-sm" onClick={() => onSave(draft)}>Save Creditor</Button>
      </div>
    </div>
  );
};

/* ── Formatted value helper ── */
const fmtV = (n: number) =>
  n === 0
    ? "₹0"
    : `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── Column header helper ── */
const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <TableHead
    className={`px-3 py-2.5 text-[11px] font-semibold text-muted-foreground bg-muted/30 whitespace-nowrap ${
      right ? "text-right" : ""
    }`}
  >
    {children}
  </TableHead>
);

interface CreditorTabProps {
  included: Creditor[];
  setIncluded: Dispatch<SetStateAction<Creditor[]>>;
  excluded: Creditor[];
  setExcluded: Dispatch<SetStateAction<Creditor[]>>;
  isEditing: boolean;
  onSetEditPanel?: (content: ReactNode | null) => void;
}

const CreditorTab = ({
  included,
  setIncluded,
  excluded,
  setExcluded,
  isEditing,
  onSetEditPanel,
}: CreditorTabProps) => {
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

  const handlePanelSave = useCallback(
    (draft: Creditor) => {
      if (selectedFromRef.current === "included") {
        setIncluded((prev) => prev.map((c) => (c.id === draft.id ? draft : c)));
      } else {
        setExcluded((prev) => prev.map((c) => (c.id === draft.id ? draft : c)));
      }
      closePanel();
    },
    [closePanel, setIncluded, setExcluded]
  );

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

  /* Totals — no Current Balance */
  const inclSanctioned = included.reduce((s, c) => s + c.sanctionedAmount, 0);
  const inclClosure    = included.reduce((s, c) => s + c.closureAmount, 0);
  const inclEMI        = included.reduce((s, c) => s + c.emi, 0);
  const exclSanctioned = excluded.reduce((s, c) => s + c.sanctionedAmount, 0);
  const exclClosure    = excluded.reduce((s, c) => s + c.closureAmount, 0);
  const exclEMI        = excluded.reduce((s, c) => s + c.emi, 0);

  /* Column count: Name | Type | AcctNo | OpenDate | Sanctioned | Closure | EMI | Tenure | ROI = 9 (+1 checkbox if editing) */
  const colCount = isEditing ? 10 : 9;

  return (
    <div className="space-y-6">

      {/* ══ Included Creditors ══ */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="flex items-center gap-3 px-5 py-3 border-b bg-green-50/50">
          <div className="h-5 w-5 rounded-full bg-green-100 border border-green-400 flex items-center justify-center shrink-0">
            <Plus className="h-3 w-3 text-green-600" />
          </div>
          <h3 className="text-sm font-semibold text-green-800">Included Creditors</h3>
          <span className="ml-1 text-[10px] font-semibold text-green-700 bg-green-100 border border-green-300 rounded-full px-2 py-0.5">
            {included.length}
          </span>
          {isEditing && (
            <Badge className="text-[10px] bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-100 ml-auto">
              Select a row to edit
            </Badge>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {isEditing && <TH> </TH>}
                <TH>Creditor Name</TH>
                <TH>Debt Type</TH>
                <TH>Account Number</TH>
                <TH>Open Date</TH>
                <TH right>Sanctioned Limited</TH>
                <TH right>Total Outstanding Loan</TH>
                <TH right>EMI</TH>
                <TH right>Tenure total</TH>
                <TH right>Current ROI</TH>
              </TableRow>
            </TableHeader>
            <TableBody>
              {included.map((c) => (
                <TableRow
                  key={c.id}
                  className={`transition-colors ${
                    selectedCreditorId === c.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : isEditing
                      ? "cursor-pointer hover:bg-muted/40"
                      : "hover:bg-muted/10"
                  }`}
                  onClick={() => isEditing && handleSelectCreditor(c, "included")}
                >
                  {isEditing && (
                    <TableCell className="px-3 py-2 w-8" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCreditorId === c.id}
                        onCheckedChange={() => handleSelectCreditor(c, "included")}
                        className="h-4 w-4"
                      />
                    </TableCell>
                  )}
                  <TableCell className="px-3 py-3 min-w-[150px]">
                    <span className="text-xs font-medium text-primary leading-snug">{c.name}</span>
                  </TableCell>
                  <TableCell className="px-3 py-3 whitespace-nowrap">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal border-muted-foreground/30">
                      {c.debtType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.accountNumber}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.openDate}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-right whitespace-nowrap">
                    {fmtV(c.sanctionedAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs font-medium text-right whitespace-nowrap">
                    {fmtV(c.closureAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs font-semibold text-right whitespace-nowrap">
                    {fmtV(c.emi)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-right whitespace-nowrap text-muted-foreground">
                    {c.tenure > 0 ? c.tenure : "--"}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-right whitespace-nowrap text-muted-foreground">
                    {c.currentROI || "--"}
                  </TableCell>
                </TableRow>
              ))}

              {included.length === 0 && (
                <TableRow>
                  <TableCell colSpan={colCount} className="text-center py-8 text-xs text-muted-foreground">
                    No included creditors
                  </TableCell>
                </TableRow>
              )}

              {included.length > 0 && (
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-2">
                  {isEditing && <TableCell />}
                  <TableCell colSpan={4} className="px-3 py-2 text-xs font-bold text-primary">&nbsp;</TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">
                    {fmtV(inclSanctioned)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">
                    {fmtV(inclClosure)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right text-primary whitespace-nowrap">
                    {fmtV(inclEMI)}
                  </TableCell>
                  <TableCell /><TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-2 border-t text-xs text-muted-foreground">
          <span>Rows per page: <strong>15</strong></span>
          <span>1–{included.length} of {included.length}</span>
        </div>
      </div>

      {/* ══ Excluded Creditors ══ */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="flex items-center gap-3 px-5 py-3 border-b bg-red-50/50">
          <div className="h-5 w-5 rounded-full bg-red-100 border border-red-400 flex items-center justify-center shrink-0">
            <Minus className="h-3 w-3 text-red-500" />
          </div>
          <h3 className="text-sm font-semibold text-red-800">Excluded Creditors</h3>
          <span className="ml-1 text-[10px] font-semibold text-red-700 bg-red-100 border border-red-300 rounded-full px-2 py-0.5">
            {excluded.length}
          </span>
          {isEditing && (
            <Badge className="text-[10px] bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-100 ml-auto">
              Select a row to edit
            </Badge>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {isEditing && <TH> </TH>}
                <TH>Creditor Name</TH>
                <TH>Debt Type</TH>
                <TH>Account Number</TH>
                <TH>Open Date</TH>
                <TH right>Sanctioned Limited</TH>
                <TH right>Total Outstanding Loan</TH>
                <TH right>EMI</TH>
                <TH right>Tenure total</TH>
                <TH right>Current ROI</TH>
              </TableRow>
            </TableHeader>
            <TableBody>
              {excluded.map((c) => (
                <TableRow
                  key={c.id}
                  className={`transition-colors ${
                    selectedCreditorId === c.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : isEditing
                      ? "cursor-pointer hover:bg-muted/40"
                      : "hover:bg-muted/10"
                  }`}
                  onClick={() => isEditing && handleSelectCreditor(c, "excluded")}
                >
                  {isEditing && (
                    <TableCell className="px-3 py-2 w-8" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCreditorId === c.id}
                        onCheckedChange={() => handleSelectCreditor(c, "excluded")}
                        className="h-4 w-4"
                      />
                    </TableCell>
                  )}
                  <TableCell className="px-3 py-3 min-w-[150px]">
                    <span className="text-xs font-medium text-foreground leading-snug">{c.name}</span>
                  </TableCell>
                  <TableCell className="px-3 py-3 whitespace-nowrap">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal border-muted-foreground/30">
                      {c.debtType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.accountNumber}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.openDate}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-right whitespace-nowrap">
                    {fmtV(c.sanctionedAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs font-medium text-right whitespace-nowrap">
                    {fmtV(c.closureAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs font-semibold text-right whitespace-nowrap">
                    {fmtV(c.emi)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-right whitespace-nowrap text-muted-foreground">
                    {c.tenure > 0 ? c.tenure : "--"}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-xs text-right whitespace-nowrap text-muted-foreground">
                    {c.currentROI || "--"}
                  </TableCell>
                </TableRow>
              ))}

              {excluded.length === 0 && (
                <TableRow>
                  <TableCell colSpan={colCount} className="text-center py-8 text-xs text-muted-foreground">
                    No excluded creditors
                  </TableCell>
                </TableRow>
              )}

              {excluded.length > 0 && (
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-2">
                  {isEditing && <TableCell />}
                  <TableCell colSpan={4} className="px-3 py-2 text-xs font-bold">&nbsp;</TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">
                    {fmtV(exclSanctioned)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">
                    {fmtV(exclClosure)}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs font-bold text-right whitespace-nowrap">
                    {fmtV(exclEMI)}
                  </TableCell>
                  <TableCell /><TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-2 border-t text-xs text-muted-foreground">
          <span>Rows per page: <strong>15</strong></span>
          <span>1–{excluded.length} of {excluded.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CreditorTab;
