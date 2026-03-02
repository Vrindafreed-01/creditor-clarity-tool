import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const requestableDetails = [
  { id: "pan", label: "PAN Card Number" },
  { id: "aadhaar", label: "Aadhaar Card Number" },
  { id: "dob", label: "Date of Birth" },
  { id: "father", label: "Father's Name" },
  { id: "mother", label: "Mother's Name" },
  { id: "marital", label: "Marital Status" },
  { id: "address_current", label: "Current Residential Address" },
  { id: "address_permanent", label: "Permanent Address" },
  { id: "employer", label: "Employer Name & Address" },
  { id: "designation", label: "Current Designation" },
  { id: "work_exp", label: "Total Work Experience" },
  { id: "salary", label: "Net In-Hand Salary" },
  { id: "bank_acc", label: "Bank Account Details" },
  { id: "ifsc", label: "Bank IFSC Code" },
  { id: "ref1", label: "Reference Person 1 Details" },
  { id: "ref2", label: "Reference Person 2 Details" },
  { id: "existing_loans", label: "Existing Loan / EMI Details" },
  { id: "credit_card", label: "Credit Card Outstanding" },
];

interface RequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDetailsModal = ({ open, onOpenChange }: RequestDetailsModalProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === requestableDetails.length ? [] : requestableDetails.map((d) => d.id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Select the details you want to request from the client</p>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={toggleAll}>
              {selected.length === requestableDetails.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="border rounded-lg divide-y max-h-[350px] overflow-y-auto">
            {requestableDetails.map((item) => (
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

export default RequestDetailsModal;
