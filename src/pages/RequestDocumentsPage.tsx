import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const RequestDocumentsPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === requestableDocuments.length
        ? []
        : requestableDocuments.map((d) => d.id)
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
          <h1 className="text-xl font-semibold">Request Documents</h1>
          <Button variant="ghost" size="sm" className="text-xs" onClick={toggleAll}>
            {selected.length === requestableDocuments.length ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <div className="border rounded-lg divide-y mb-8">
          {requestableDocuments.map((item) => (
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

export default RequestDocumentsPage;
