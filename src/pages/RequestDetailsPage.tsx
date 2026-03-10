import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const RequestDetailsPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === requestableDetails.length
        ? []
        : requestableDetails.map((d) => d.id)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-6 py-3">
        <span className="text-sm text-muted-foreground">Actions</span>
        <span className="text-sm text-muted-foreground mx-2">/</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Request Details</h1>
          <Button variant="ghost" size="sm" className="text-xs" onClick={toggleAll}>
            {selected.length === requestableDetails.length ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <div className="border rounded-lg divide-y mb-8">
          {requestableDetails.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggle(item.id)}
            >
              <Checkbox checked={selected.includes(item.id)} />
              <span className="text-sm text-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" className="text-sm" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" disabled={selected.length === 0}>
              Update Request
            </Button>
            <Button size="sm" disabled={selected.length === 0}>
              Send Request ({selected.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
