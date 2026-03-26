import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedDatePicker } from "@/components/ui/unified-date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send, X } from "lucide-react";

interface RequestItem {
  id: string;
  field: string;
  sentDate: string;
  status: "pending" | "completed";
}

const docTypes = [
  "Salary Slip (Latest 3 months)",
  "Bank Statement (6 months)",
  "Form 16",
  "ITR (2 years)",
  "Address Proof",
  "PAN Card",
  "Aadhaar Card",
  "Employment Certificate",
  "Property Documents",
];

const initialRequests: RequestItem[] = [
  { id: "1", field: "Salary Slip - Mar 2024", sentDate: "2024-03-15", status: "completed" },
  { id: "2", field: "Bank Statement (6 months)", sentDate: "2024-03-15", status: "pending" },
  { id: "3", field: "Form 16 - FY 2023-24", sentDate: "2024-03-16", status: "pending" },
];

const RequestDocument = () => {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSend = () => {
    const newRequests = selected.map((field) => ({
      id: Date.now().toString() + field,
      field,
      sentDate: new Date().toISOString().split("T")[0],
      status: "pending" as const,
    }));
    setRequests([...requests, ...newRequests]);
    setSelected([]);
    setOpen(false);
  };

  const handleCancel = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="bg-card rounded-lg border">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Request Documents</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Send className="h-3.5 w-3.5" />
              Request Document from Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Documents</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="crm-field-label">Select Document Types</Label>
                {docTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      checked={selected.includes(type)}
                      onCheckedChange={() => toggleSelect(type)}
                    />
                    <span className="text-sm">{type}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Date Range (if applicable)</Label>
                <UnifiedDatePicker mode="month-range" value="" onChange={() => {}} placeholder="Select range" />
              </div>
              <div className="space-y-1.5">
                <Label className="crm-field-label">Add Note</Label>
                <Textarea placeholder="Instructions for client..." className="text-sm resize-none" rows={2} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSend} disabled={selected.length === 0}>
                  Send Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Field Requested</TableHead>
              <TableHead className="text-xs">Sent Date</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm">{r.field}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.sentDate}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-xs border-0 ${
                      r.status === "completed"
                        ? "bg-status-eligible-bg text-status-eligible-foreground"
                        : "bg-status-conditional-bg text-status-conditional-foreground"
                    }`}
                  >
                    {r.status === "completed" ? "Completed" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {r.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleCancel(r.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RequestDocument;
