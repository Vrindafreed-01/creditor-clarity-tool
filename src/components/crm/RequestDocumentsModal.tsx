import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const requestableDocuments = [
  { id: "salary_slip_3m", label: "Salary Slip (Last 3 Months)" },
  { id: "salary_slip_6m", label: "Salary Slip (Last 6 Months)" },
  { id: "bank_stmt_6m", label: "Bank Statement (Last 6 Months)" },
  { id: "bank_stmt_12m", label: "Bank Statement (Last 12 Months)" },
  { id: "form16", label: "Form 16 (Latest)" },
  { id: "itr_1yr", label: "ITR (Last 1 Year)" },
  { id: "itr_2yr", label: "ITR (Last 2 Years)" },
  { id: "pan_copy", label: "PAN Card Copy" },
  { id: "aadhaar_copy", label: "Aadhaar Card Copy (Front & Back)" },
  { id: "passport_photo", label: "Passport Size Photograph" },
  { id: "address_proof", label: "Address Proof (Utility Bill / Rent Agreement)" },
  { id: "emp_id", label: "Employee ID Card Copy" },
  { id: "offer_letter", label: "Offer Letter / Appointment Letter" },
  { id: "credit_report", label: "Credit Report (CIBIL / Experian)" },
  { id: "existing_loan_stmt", label: "Existing Loan Statement" },
  { id: "cc_stmt_3m", label: "Credit Card Statement (Last 3 Months)" },
  { id: "property_docs", label: "Property Documents (if applicable)" },
  { id: "business_proof", label: "Business Registration Proof (if self-employed)" },
];

interface RequestDocumentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDocumentsModal = ({ open, onOpenChange }: RequestDocumentsModalProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === requestableDocuments.length ? [] : requestableDocuments.map((d) => d.id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Request Documents</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Select the documents you want to request from the client</p>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={toggleAll}>
              {selected.length === requestableDocuments.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="border rounded-lg divide-y max-h-[350px] overflow-y-auto">
            {requestableDocuments.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggle(item.id)}
              >
                <Checkbox checked={selected.includes(item.id)} />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="sm" disabled={selected.length === 0} onClick={() => onOpenChange(false)}>
              Send Request ({selected.length})
            </Button>
            <Button variant="outline" size="sm" disabled={selected.length === 0}>
              Update Request
            </Button>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDocumentsModal;
