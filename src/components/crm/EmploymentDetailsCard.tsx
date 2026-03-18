import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmploymentData } from "@/types/client";

interface EmploymentDetailsCardProps {
  data: EmploymentData;
  onChange: (data: EmploymentData) => void;
  requestedDetailIds?: string[];
}

const EmploymentDetailsCard = ({ data, onChange }: EmploymentDetailsCardProps) => {
  const update = (key: keyof EmploymentData, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Employment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Occupation</Label>
          <Select value={data.occupation} onValueChange={(v) => update("occupation", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Company Name</Label>
          <Input value={data.companyName} onChange={(e) => update("companyName", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Inhand Salary (₹)</Label>
          <Input type="number" value={data.inhandSalary} onChange={(e) => update("inhandSalary", e.target.value)} className="h-9 text-sm" placeholder="e.g. 80000" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Any Regular Incentive (₹)</Label>
          <Input type="number" value={data.regularIncentive} onChange={(e) => update("regularIncentive", e.target.value)} className="h-9 text-sm" placeholder="e.g. 5000" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Date of Joining (MM/DD/YYYY)</Label>
          <Input type="date" value={data.dateOfJoining} onChange={(e) => update("dateOfJoining", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total Work Experience</Label>
          <Input value={data.totalWorkExp} onChange={(e) => update("totalWorkExp", e.target.value)} className="h-9 text-sm" placeholder="e.g. 5 years" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Current Designation</Label>
          <Input value={data.currentDesignation} onChange={(e) => update("currentDesignation", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Office Address</Label>
          <Input value={data.officeAddress} onChange={(e) => update("officeAddress", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default EmploymentDetailsCard;
