import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

interface RequestDocumentsViewProps {
  onClose: () => void;
}

const RequestDocumentsView = ({ onClose }: RequestDocumentsViewProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const removeItem = (id: string) => {
    setSelected((prev) => prev.filter((i) => i !== id));
  };

  const toggleAll = () => {
    setSelected(
      selected.length === requestableDocuments.length
        ? []
        : requestableDocuments.map((d) => d.id)
    );
  };

  return (
    <div>
      <div className="border-b px-6 py-3">
        <span className="text-sm text-muted-foreground">Actions</span>
        <span className="text-sm text-muted-foreground mx-2">/</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-foreground">Request Documents</h1>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-between w-[380px] border rounded-md px-4 py-2.5 text-sm text-left bg-background hover:bg-muted/30 transition-colors">
                <span className={selected.length === 0 ? "text-muted-foreground" : "text-foreground"}>
                  {selected.length === 0
                    ? "Select Documents to Request"
                    : `${selected.length} document${selected.length > 1 ? "s" : ""} selected`}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0" align="center">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  {selected.length} of {requestableDocuments.length} selected
                </span>
                <button onClick={toggleAll} className="text-xs text-primary hover:underline">
                  {selected.length === requestableDocuments.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {requestableDocuments.map((item) => {
                  const isSelected = selected.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggle(item.id)}
                    >
                      <span className="text-sm text-foreground">{item.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {selected.map((id) => {
              const item = requestableDocuments.find((d) => d.id === id);
              return (
                <Badge key={id} variant="secondary" className="text-xs gap-1 pr-1">
                  {item?.label}
                  <button onClick={() => removeItem(id)} className="hover:text-destructive transition-colors ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-8 pt-4">
          <Button variant="ghost" className="text-sm text-primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" disabled={selected.length === 0}>
            Send Request ({selected.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestDocumentsView;
