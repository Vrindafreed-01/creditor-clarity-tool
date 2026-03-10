import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

const EmploymentDetailsCard = () => {
  const [data, setData] = useState({
    employmentType: "",
    currentDesignation: "",
    totalWorkExp: "",
    employerName: "",
    dateOfJoining: "",
    officeAddress: "",
  });

  const update = (key: string, value: string) => setData({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Employment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Employment Type</Label>
          <Select value={data.employmentType} onValueChange={(v) => update("employmentType", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Current Designation</Label>
          <Input value={data.currentDesignation} onChange={(e) => update("currentDesignation", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total Work Exp.</Label>
          <Input value={data.totalWorkExp} onChange={(e) => update("totalWorkExp", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Company Name</Label>
          <Input value={data.employerName} onChange={(e) => update("employerName", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Date of Joining</Label>
          <div className="relative">
            <Input value={data.dateOfJoining} onChange={(e) => update("dateOfJoining", e.target.value)} className="h-9 text-sm pr-8" type="date" />
            <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="md:col-span-3 space-y-1.5">
          <Label className="crm-field-label">Office Address</Label>
          <Input value={data.officeAddress} onChange={(e) => update("officeAddress", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default EmploymentDetailsCard;
