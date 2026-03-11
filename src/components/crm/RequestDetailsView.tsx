import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, ChevronDown, Check, MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

interface RequestDetailsViewProps {
  onClose: () => void;
}

const RequestDetailsView = ({ onClose }: RequestDetailsViewProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const removeItem = (id: string) => {
    setSelected((prev) => prev.filter((i) => i !== id));
    setComments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.length === requestableDetails.length) {
      setSelected([]);
      setComments({});
    } else {
      setSelected(requestableDetails.map((d) => d.id));
    }
  };

  const setComment = (id: string, value: string) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <div className="border-b px-6 py-3">
        <span className="text-sm text-muted-foreground">Actions</span>
        <span className="text-sm text-muted-foreground mx-2">/</span>
        <span className="text-sm text-foreground">Request Details</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-foreground">
            Request Details
          </h1>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dropdown selector */}
        <div className="flex justify-center mb-6">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-between w-[420px] border rounded-md px-4 py-2.5 text-sm text-left bg-background hover:bg-muted/30 transition-colors">
                <span
                  className={
                    selected.length === 0
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }
                >
                  {selected.length === 0
                    ? "Select Details to Request"
                    : `${selected.length} detail${selected.length > 1 ? "s" : ""} selected`}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[420px] p-0" align="center">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">
                  {selected.length} of {requestableDetails.length} selected
                </span>
                <button
                  onClick={toggleAll}
                  className="text-xs text-primary hover:underline"
                >
                  {selected.length === requestableDetails.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {requestableDetails.map((item) => {
                  const isSelected = selected.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggle(item.id)}
                    >
                      <span className="text-sm text-foreground">
                        {item.label}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Selected items — each with a comment field */}
        {selected.length > 0 && (
          <div className="space-y-3 mb-8">
            {selected.map((id) => {
              const item = requestableDetails.find((d) => d.id === id);
              return (
                <div
                  key={id}
                  className="border rounded-lg p-3 bg-muted/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {item?.label}
                    </span>
                    <button
                      onClick={() => removeItem(id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="relative">
                    <MessageSquare className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                    <Textarea
                      placeholder="Add a specific instruction or comment for this detail... (optional)"
                      value={comments[id] ?? ""}
                      onChange={(e) => setComment(id, e.target.value)}
                      className="text-xs resize-none min-h-[60px] pl-8 bg-background"
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-8 pt-4">
          <Button
            variant="ghost"
            className="text-sm text-primary"
            onClick={onClose}
          >
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

export default RequestDetailsView;
