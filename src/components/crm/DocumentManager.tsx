import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { Upload, Pencil, MessageSquare, Archive, Check, X } from "lucide-react";

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

const DocumentManager = () => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");

  const toggleField = (id: string, field: "usedForLogin" | "archived") => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, [field]: !d[field] } : d)));
  };

  const handleTypeChange = (id: string, newType: string) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, type: newType } : d)));
  };

  const startRename = (doc: Document) => {
    setEditingNameId(doc.id);
    setEditingNameValue(doc.name);
  };

  const confirmRename = () => {
    if (editingNameId) {
      setDocs(docs.map((d) => (d.id === editingNameId ? { ...d, name: editingNameValue } : d)));
      setEditingNameId(null);
      setEditingNameValue("");
    }
  };

  const cancelRename = () => {
    setEditingNameId(null);
    setEditingNameValue("");
  };

  return (
    <div className="bg-card rounded-lg border">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Document Manager</h3>
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

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs">Document Name</TableHead>
            <TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Date Range</TableHead>
            <TableHead className="text-xs">Comment</TableHead>
            <TableHead className="text-xs text-center">Used for Login</TableHead>
            <TableHead className="text-xs text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.filter((d) => !d.archived).map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                {editingNameId === doc.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editingNameValue}
                      onChange={(e) => setEditingNameValue(e.target.value)}
                      className="h-7 text-sm w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmRename();
                        if (e.key === "Escape") cancelRename();
                      }}
                    />
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-status-eligible-foreground" onClick={confirmRename}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={cancelRename}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm font-medium">{doc.name}</span>
                )}
              </TableCell>
              <TableCell>
                <Select value={doc.type} onValueChange={(v) => handleTypeChange(doc.id, v)}>
                  <SelectTrigger className="h-7 text-xs border-0 bg-transparent p-0 pl-1 focus:ring-0 w-auto min-w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{doc.dateRange || "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{doc.comment || "—"}</TableCell>
              <TableCell className="text-center">
                <Select
                  value={doc.usedForLogin ? "yes" : "no"}
                  onValueChange={(v) => {
                    setDocs(docs.map((d) => (d.id === doc.id ? { ...d, usedForLogin: v === "yes" } : d)));
                  }}
                >
                  <SelectTrigger className="h-7 text-xs border-0 bg-transparent p-0 pl-1 focus:ring-0 w-auto min-w-[60px] mx-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => startRename(doc)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => toggleField(doc.id, "archived")}>
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentManager;
