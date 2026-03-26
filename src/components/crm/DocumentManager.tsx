import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UnifiedDatePicker } from "@/components/ui/unified-date-picker";
import {
  Upload, X, Download, ExternalLink, FileText,
  ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, Printer, Pencil, Check,
} from "lucide-react";
import { toast } from "sonner";

/* ── MD3 Month-Year Picker ── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MonthYearPicker = ({
  value, onChange, placeholder = "Select",
}: { value: string; onChange: (v: string) => void; placeholder?: string }) => {
  const [open, setOpen] = useState(false);
  const parts = value ? value.split(" ") : [];
  const [year, setYear] = useState(() =>
    parts.length === 2 ? parseInt(parts[1]) || new Date().getFullYear() : new Date().getFullYear()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 h-8 rounded-lg px-2.5 text-xs border transition-all ${
            value
              ? "bg-primary/10 border-primary/30 text-primary font-semibold"
              : "bg-muted/40 border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/60"
          }`}
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          {value || placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3 shadow-xl rounded-xl" align="start" sideOffset={4}>
        {/* Year navigation */}
        <div className="flex items-center justify-between mb-2 px-0.5">
          <button
            type="button"
            onClick={() => setYear((y) => y - 1)}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold tabular-nums">{year}</span>
          <button
            type="button"
            onClick={() => setYear((y) => y + 1)}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {/* Month grid */}
        <div className="grid grid-cols-3 gap-1">
          {MONTHS.map((m) => {
            const val = `${m} ${year}`;
            const sel = value === val;
            return (
              <button
                key={m}
                type="button"
                onClick={() => { onChange(val); setOpen(false); }}
                className={`h-9 rounded-full text-xs font-medium transition-colors ${
                  sel
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-primary/10 text-foreground"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className="mt-2 w-full text-[10px] text-center text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
};

const documentTypes = [
  "Income Proof - Salary Slip",
  "Income Proof - Bank Statement",
  "Income Proof - Form 16",
  "Income Proof - Balance Sheet for Deposit",
  "Call Recordings",
  "Credit Report",
  "Others",
];

interface Document {
  id: string;
  name: string;
  type: string;
  dateRange: string;
  dateStart: string;
  dateEnd: string;
  comment: string;
  usedForLogin: boolean;
  archived: boolean;
  fileType?: "pdf" | "zip" | "img";
}

/* Parse "Oct 2024 – Mar 2025" → { dateStart: "Oct 2024", dateEnd: "Mar 2025" } */
const parseDateRange = (dr: string): { dateStart: string; dateEnd: string } => {
  if (!dr) return { dateStart: "", dateEnd: "" };
  const parts = dr.split("–").map((s) => s.trim());
  return { dateStart: parts[0] || "", dateEnd: parts[1] || "" };
};

const initialDocs: Document[] = [
  { id: "1", name: "1771572650463_Payslip 2025120.pdf", type: "Income Proof - Salary Slip",    dateRange: "Jan 2025",              ...parseDateRange("Jan 2025"),              comment: "",                      usedForLogin: true,  archived: false, fileType: "pdf" },
  { id: "2", name: "1771572650463_Payslip 2024120.pdf", type: "Income Proof - Salary Slip",    dateRange: "Dec 2024",              ...parseDateRange("Dec 2024"),              comment: "",                      usedForLogin: true,  archived: false, fileType: "pdf" },
  { id: "3", name: "1771572650463_Payslip 2024110.pdf", type: "Income Proof - Salary Slip",    dateRange: "Nov 2024",              ...parseDateRange("Nov 2024"),              comment: "",                      usedForLogin: true,  archived: false, fileType: "pdf" },
  { id: "4", name: "BankStatement_HDFC_6Months.pdf",    type: "Income Proof - Bank Statement", dateRange: "Oct 2024 – Mar 2025",   ...parseDateRange("Oct 2024 – Mar 2025"),   comment: "6 months statement",    usedForLogin: true,  archived: false, fileType: "pdf" },
  { id: "5", name: "KYC_Documents.zip",                 type: "Others",                        dateRange: "",                      ...parseDateRange(""),                      comment: "",                      usedForLogin: false, archived: false, fileType: "zip" },
  { id: "6", name: "SignedAgreement_KFSAPP.pdf",        type: "Others",                        dateRange: "",                      ...parseDateRange(""),                      comment: "Signed DCP agreement",  usedForLogin: true,  archived: false, fileType: "pdf" },
];

/* ── Document Viewer Sheet ── */
const DocViewerSheet = ({ doc, open, onClose }: { doc: Document | null; open: boolean; onClose: () => void }) => {
  if (!doc) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[85vw] sm:max-w-[85vw] p-0 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#2a2a2a] text-white shrink-0">
          <button onClick={onClose} className="hover:text-gray-300 transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-gray-600" />
          <span className="text-sm font-medium truncate flex-1">{doc.name}</span>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="flex items-center gap-1 bg-[#3a3a3a] rounded px-2 py-1">
              <span className="text-xs">1 / 1</span>
              <div className="flex gap-0.5 ml-1">
                <button className="hover:bg-gray-600 p-0.5 rounded"><ChevronLeft className="h-3 w-3" /></button>
                <button className="hover:bg-gray-600 p-0.5 rounded"><ChevronRight className="h-3 w-3" /></button>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#3a3a3a] rounded px-2 py-1">
              <button className="hover:bg-gray-600 p-0.5 rounded"><Minus className="h-3 w-3" /></button>
              <span className="text-xs px-1">100%</span>
              <button className="hover:bg-gray-600 p-0.5 rounded"><Plus className="h-3 w-3" /></button>
            </div>
            <button className="p-1.5 hover:bg-gray-700 rounded" onClick={() => { toast.success("Downloading..."); }}>
              <Download className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded"><Printer className="h-4 w-4" /></button>
            <button className="p-1.5 hover:bg-gray-700 rounded"><RotateCcw className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Page thumbnail */}
          <div className="w-[140px] shrink-0 bg-[#f5f5f5] border-r overflow-y-auto p-3">
            <div className="border-2 border-blue-500 rounded bg-white shadow-sm cursor-pointer">
              <div className="aspect-[3/4] flex flex-col items-center justify-center p-3 gap-2">
                <FileText className="h-10 w-10 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground text-center">Page 1</span>
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-1.5">1</p>
          </div>

          {/* Right: Document content */}
          <div className="flex-1 bg-[#525659] overflow-auto p-6 flex items-start justify-center">
            <div className="bg-white shadow-2xl w-full max-w-[720px] min-h-[900px] p-8 rounded-sm">
              <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-700">
                <div>
                  <div className="text-lg font-bold text-blue-800 uppercase tracking-wide">
                    {doc.type.includes("Salary") ? "CYBAGE SOFTWARE PRIVATE LIMITED" :
                     doc.type.includes("Bank") ? "HDFC BANK" : "DOCUMENT"}
                  </div>
                  {doc.type.includes("Salary") && (
                    <div className="text-xs text-muted-foreground mt-1">
                      S. No. 13/1+2+3A/1, Vadgaon Sheri PUNE 411014
                    </div>
                  )}
                </div>
                {doc.type.includes("Salary") && (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-800">
                      Pay Slip for {doc.dateRange || "December 2025"}
                    </div>
                  </div>
                )}
              </div>

              {doc.type.includes("Salary") ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-8 text-sm border border-gray-300">
                    <div className="p-2 border-b border-r border-gray-300">
                      <div className="text-xs text-muted-foreground">Employee No.</div>
                      <div className="font-medium">24618</div>
                    </div>
                    <div className="p-2 border-b border-gray-300">
                      <div className="text-xs text-muted-foreground">Monthly Gross</div>
                      <div className="font-medium">1,09,550.00</div>
                    </div>
                    <div className="p-2 border-b border-r border-gray-300">
                      <div className="text-xs text-muted-foreground">Name</div>
                      <div className="font-medium">Saurabh Narendra Deshpande</div>
                    </div>
                    <div className="p-2 border-b border-gray-300">
                      <div className="text-xs text-muted-foreground">EPF Company Contribution</div>
                      <div className="font-medium">1,950.00</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4 opacity-30" />
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs mt-1">{doc.type}</p>
                  {doc.dateRange && <p className="text-xs mt-0.5 text-muted-foreground">{doc.dateRange}</p>}
                  <p className="text-xs mt-4 text-muted-foreground/60">Document preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* ── Upload form state ── */
interface UploadForm {
  type: string;
  dateRange: string;
  comment: string;
  usedForLogin: string;
}

const DocumentManager = () => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<Document | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());

  const toggleDocSelect = (id: string) => setSelectedDocIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const [uploadForm, setUploadForm] = useState<UploadForm>({
    type: "", dateRange: "", comment: "", usedForLogin: "yes",
  });

  /* Direct-update helper — same pattern as creditor tables */
  const updateDoc = (id: string, field: keyof Document, value: unknown) =>
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));

  /* Save all — recompute dateRange from dateStart/dateEnd */
  const handleSaveAll = () => {
    setDocs((prev) =>
      prev.map((d) => ({
        ...d,
        dateRange: d.dateStart
          ? d.dateEnd
            ? `${d.dateStart} – ${d.dateEnd}`
            : d.dateStart
          : d.dateEnd || "",
      }))
    );
    setIsEditing(false);
    toast.success("Documents updated");
  };

  const openViewer = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewerDoc(doc);
    setViewerOpen(true);
  };

  const getFileTypeBadge = (ft?: string) => {
    if (!ft || ft === "pdf") return <span className="inline-flex items-center border rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted shrink-0">pdf</span>;
    if (ft === "zip") return <span className="inline-flex items-center border rounded px-1.5 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 shrink-0">zip</span>;
    return <span className="inline-flex items-center border rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground shrink-0">{ft}</span>;
  };

  const handleUpload = () => {
    toast.success("Document uploaded");
    setUploadForm({ type: "", dateRange: "", comment: "", usedForLogin: "yes" });
    setUploadOpen(false);
  };

  return (
    <>
      <div className={`border rounded-lg bg-card transition-all ${isEditing ? "border-primary/30 ring-1 ring-primary/10" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-semibold text-foreground">Document Manager</h3>
          <div className="flex items-center gap-2">
            {selectedDocIds.size > 0 && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => { toast.success(`Downloading ${selectedDocIds.size} file(s)`); setSelectedDocIds(new Set()); }}>
                <Download className="h-3.5 w-3.5" /> Download ({selectedDocIds.size})
              </Button>
            )}
            {isEditing ? (
              <Button size="sm" className="gap-1.5 text-xs h-8" onClick={handleSaveAll}>
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 border-primary/40 text-primary hover:bg-primary/5" onClick={() => setIsEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => setUploadOpen(true)}>
              <Upload className="h-3.5 w-3.5" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 px-3">
                  <Checkbox
                    checked={selectedDocIds.size === docs.filter(d => !d.archived).length && docs.filter(d => !d.archived).length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedDocIds(new Set(docs.filter(d => !d.archived).map(d => d.id)));
                      else setSelectedDocIds(new Set());
                    }}
                    className="h-4 w-4"
                  />
                </TableHead>
                <TableHead className="text-xs min-w-[160px]">Document Type</TableHead>
                <TableHead className="text-xs">Document Name</TableHead>
                <TableHead className="text-xs min-w-[200px]">Date Range</TableHead>
                <TableHead className="text-xs min-w-[120px]">Comment</TableHead>
                <TableHead className="text-xs text-center">Used for Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.filter((d) => !d.archived).map((doc) => (
                <TableRow
                  key={doc.id}
                  className={`transition-colors ${isEditing ? "bg-primary/5 hover:bg-primary/5" : "hover:bg-muted/10"}`}
                >
                  <TableCell className="px-3 py-3">
                    <Checkbox
                      checked={selectedDocIds.has(doc.id)}
                      onCheckedChange={() => toggleDocSelect(doc.id)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  {/* ── Document Type ── */}
                  <TableCell className="py-3 px-3">
                    {isEditing ? (
                      <Select
                        value={doc.type}
                        onValueChange={(v) => updateDoc(doc.id, "type", v)}
                      >
                        <SelectTrigger className="h-7 text-xs min-w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-muted-foreground leading-snug">{doc.type}</span>
                    )}
                  </TableCell>

                  {/* ── Document Name ── */}
                  <TableCell className="py-3">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        {getFileTypeBadge(doc.fileType)}
                        <Input
                          value={doc.name}
                          onChange={(e) => updateDoc(doc.id, "name", e.target.value)}
                          className="h-7 text-xs min-w-[200px]"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {getFileTypeBadge(doc.fileType)}
                        <button
                          onClick={(e) => openViewer(doc, e)}
                          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 text-left"
                        >
                          {doc.name}
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                        </button>
                      </div>
                    )}
                  </TableCell>

                  {/* ── Date Range ── */}
                  <TableCell className="py-3 px-3">
                    {isEditing ? (
                      <UnifiedDatePicker
                        mode="month-range"
                        value={doc.dateRange}
                        onChange={(v) => updateDoc(doc.id, "dateRange", v)}
                        placeholder="Select range"
                        compact
                        className="w-[180px]"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">{doc.dateRange || "—"}</span>
                    )}
                  </TableCell>

                  {/* ── Comment ── */}
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={doc.comment}
                        onChange={(e) => updateDoc(doc.id, "comment", e.target.value)}
                        className="h-7 text-xs w-32"
                        placeholder="Add note..."
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">{doc.comment || "—"}</span>
                    )}
                  </TableCell>

                  {/* ── Used for Login ── */}
                  <TableCell className="text-center">
                    {isEditing ? (
                      <Select
                        value={doc.usedForLogin ? "yes" : "no"}
                        onValueChange={(v) => updateDoc(doc.id, "usedForLogin", v === "yes")}
                      >
                        <SelectTrigger className="h-7 text-xs w-16 mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={doc.usedForLogin ? "default" : "outline"} className="text-[10px] px-1.5">
                        {doc.usedForLogin ? "Yes" : "No"}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Upload Dialog ── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="crm-field-label">Document Type</Label>
              <Select value={uploadForm.type} onValueChange={(v) => setUploadForm({ ...uploadForm, type: v, dateRange: "" })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="crm-field-label">Upload File</Label>
              <Input type="file" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="crm-field-label">
                {uploadForm.type.includes("Bank") ? "Statement Period" : "Date Range"}
                {!uploadForm.type && " (if applicable)"}
              </Label>
              <UnifiedDatePicker
                mode="month-range"
                value={uploadForm.dateRange}
                onChange={(v) => setUploadForm({ ...uploadForm, dateRange: v })}
                placeholder="Select range"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="crm-field-label">Comment (optional)</Label>
              <Textarea
                value={uploadForm.comment}
                onChange={(e) => setUploadForm({ ...uploadForm, comment: e.target.value })}
                placeholder="Add a note..."
                className="text-sm resize-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer */}
      <DocViewerSheet doc={viewerDoc} open={viewerOpen} onClose={() => setViewerOpen(false)} />
    </>
  );
};

export default DocumentManager;
