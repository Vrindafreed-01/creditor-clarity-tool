import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Upload, Pencil } from "lucide-react";

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

interface DocumentManagerProps {
  isEditing?: boolean;
}

const DocumentManager = ({ isEditing = false }: DocumentManagerProps) => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [uploadOpen, setUploadOpen] = useState(false);

  const updateDoc = (id: string, field: keyof Document, value: string | boolean) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  return (
    <div className={`bg-card rounded-lg border transition-all duration-200 ${isEditing ? "border-amber-300 ring-1 ring-amber-200" : ""}`}>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Document Manager</h3>
          {isEditing && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-amber-400 text-amber-700 bg-amber-50 gap-1">
              <Pencil className="h-2.5 w-2.5" />
              Editing
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

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs">Document Name</TableHead>
            <TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Date Range</TableHead>
            <TableHead className="text-xs">Comment</TableHead>
            <TableHead className="text-xs text-center">Used for Login</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.filter((d) => !d.archived).map((doc) => (
            <TableRow key={doc.id} className={isEditing ? "bg-amber-50/30" : ""}>
              {/* Document Name */}
              <TableCell>
                {isEditing ? (
                  <Input
                    value={doc.name}
                    onChange={(e) => updateDoc(doc.id, "name", e.target.value)}
                    className="h-7 text-sm w-48 py-0 px-2"
                  />
                ) : (
                  <span className="text-sm font-medium">{doc.name}</span>
                )}
              </TableCell>

              {/* Type — always a Select */}
              <TableCell>
                <Select value={doc.type} onValueChange={(v) => updateDoc(doc.id, "type", v)}>
                  <SelectTrigger className={`h-7 text-xs border-0 bg-transparent p-0 pl-1 focus:ring-0 w-auto min-w-[180px] ${isEditing ? "border border-input rounded-md bg-background px-2" : ""}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Date Range */}
              <TableCell>
                {isEditing ? (
                  <Input
                    value={doc.dateRange}
                    onChange={(e) => updateDoc(doc.id, "dateRange", e.target.value)}
                    placeholder="e.g. Jan 2024"
                    className="h-7 text-sm w-36 py-0 px-2"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{doc.dateRange || "—"}</span>
                )}
              </TableCell>

              {/* Comment */}
              <TableCell>
                {isEditing ? (
                  <Input
                    value={doc.comment}
                    onChange={(e) => updateDoc(doc.id, "comment", e.target.value)}
                    placeholder="Add comment"
                    className="h-7 text-sm w-40 py-0 px-2"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{doc.comment || "—"}</span>
                )}
              </TableCell>

              {/* Used for Login — always a Select */}
              <TableCell className="text-center">
                <Select
                  value={doc.usedForLogin ? "yes" : "no"}
                  onValueChange={(v) => updateDoc(doc.id, "usedForLogin", v === "yes")}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentManager;
