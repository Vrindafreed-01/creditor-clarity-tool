import { useState, useEffect, useCallback, ReactNode } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Upload, X } from "lucide-react";

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
  comment: string;
  usedForLogin: boolean;
  archived: boolean;
}

const initialDocs: Document[] = [
  { id: "1", name: "Salary Slip - Jan 2024", type: "Income Proof - Salary Slip", dateRange: "Jan 2024", comment: "", usedForLogin: true, archived: false },
  { id: "2", name: "Salary Slip - Feb 2024", type: "Income Proof - Salary Slip", dateRange: "Feb 2024", comment: "", usedForLogin: true, archived: false },
  { id: "3", name: "Bank Statement - HDFC", type: "Income Proof - Bank Statement", dateRange: "Oct 2023 - Mar 2024", comment: "6 months statement", usedForLogin: true, archived: false },
  { id: "4", name: "PAN Card", type: "Others", dateRange: "", comment: "", usedForLogin: true, archived: false },
  { id: "5", name: "Aadhaar Card", type: "Others", dateRange: "", comment: "", usedForLogin: false, archived: false },
  { id: "6", name: "Form 16 - FY 2023-24", type: "Income Proof - Form 16", dateRange: "FY 2023-24", comment: "", usedForLogin: false, archived: false },
];

/* ── Document edit panel — rendered inside RightPanel ── */
interface DocumentEditPanelProps {
  initialDraft: Document;
  onSave: (draft: Document) => void;
  onClose: () => void;
}

const DocumentEditPanel = ({ initialDraft, onSave, onClose }: DocumentEditPanelProps) => {
  const [draft, setDraft] = useState<Document>(initialDraft);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <h3 className="text-sm font-semibold">Edit Document</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Document Name</Label>
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Document Type</Label>
          <Select
            value={draft.type}
            onValueChange={(v) => setDraft({ ...draft, type: v })}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Date Range</Label>
          <Input
            value={draft.dateRange}
            onChange={(e) => setDraft({ ...draft, dateRange: e.target.value })}
            placeholder="e.g. Jan 2024"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Comment</Label>
          <Textarea
            value={draft.comment}
            onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
            placeholder="Add a note..."
            className="text-sm resize-none"
            rows={3}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Used for Login</Label>
          <Select
            value={draft.usedForLogin ? "yes" : "no"}
            onValueChange={(v) => setDraft({ ...draft, usedForLogin: v === "yes" })}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t shrink-0">
        <Button className="w-full h-9 text-sm" onClick={() => onSave(draft)}>
          Save Document
        </Button>
      </div>
    </div>
  );
};

interface DocumentManagerProps {
  isEditing?: boolean;
  onSetEditPanel?: (content: ReactNode | null) => void;
}

const DocumentManager = ({ isEditing = false, onSetEditPanel }: DocumentManagerProps) => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setSelectedDocId(null);
      onSetEditPanel?.(null);
    }
  }, [isEditing, onSetEditPanel]);

  const closePanel = useCallback(() => {
    setSelectedDocId(null);
    onSetEditPanel?.(null);
  }, [onSetEditPanel]);

  const handlePanelSave = useCallback((draft: Document) => {
    setDocs((prev) => prev.map((d) => (d.id === draft.id ? draft : d)));
    closePanel();
  }, [closePanel]);

  const handleSelectDoc = (doc: Document) => {
    if (selectedDocId === doc.id) {
      closePanel();
    } else {
      setSelectedDocId(doc.id);
      onSetEditPanel?.(
        <DocumentEditPanel
          key={doc.id}
          initialDraft={doc}
          onSave={handlePanelSave}
          onClose={closePanel}
        />
      );
    }
  };

  return (
    <div className={`border rounded-lg bg-card transition-all duration-200 ${isEditing ? "border-amber-300 ring-1 ring-amber-200" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Document Manager</h3>
          {isEditing && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-amber-400 text-amber-700 bg-amber-50">
              Select a document to edit
            </Badge>
          )}
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 text-xs">
              <Upload className="h-3.5 w-3.5" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="crm-field-label">Document Type</Label>
                <Select>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
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
                <Label className="crm-field-label">Date Range (if applicable)</Label>
                <Input placeholder="e.g. Jan 2024 - Mar 2024" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Comment (optional)</Label>
                <Textarea placeholder="Add a note..." className="text-sm resize-none" rows={2} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setUploadOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => setUploadOpen(false)}>Upload</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {isEditing && <TableHead className="w-8 px-3" />}
              <TableHead className="text-xs">Document Name</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Date Range</TableHead>
              <TableHead className="text-xs">Comment</TableHead>
              <TableHead className="text-xs text-center">Used for Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.filter((d) => !d.archived).map((doc) => (
              <TableRow
                key={doc.id}
                className={`transition-colors ${
                  selectedDocId === doc.id
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : isEditing
                    ? "cursor-pointer hover:bg-muted/40"
                    : ""
                }`}
                onClick={() => isEditing && handleSelectDoc(doc)}
              >
                {/* Checkbox — edit mode only */}
                {isEditing && (
                  <TableCell className="px-3 py-2 w-8" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedDocId === doc.id}
                      onCheckedChange={() => handleSelectDoc(doc)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                )}

                {/* Document Name */}
                <TableCell>
                  <span className="text-sm font-medium">{doc.name}</span>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <span className="text-xs text-muted-foreground">{doc.type}</span>
                </TableCell>

                {/* Date Range */}
                <TableCell>
                  <span className="text-sm text-muted-foreground">{doc.dateRange || "—"}</span>
                </TableCell>

                {/* Comment */}
                <TableCell>
                  <span className="text-sm text-muted-foreground">{doc.comment || "—"}</span>
                </TableCell>

                {/* Used for Login */}
                <TableCell className="text-center">
                  <Badge variant={doc.usedForLogin ? "default" : "outline"} className="text-[10px] px-1.5">
                    {doc.usedForLogin ? "Yes" : "No"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentManager;
