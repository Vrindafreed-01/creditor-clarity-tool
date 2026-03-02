import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface PreQualificationCardProps {
  onCheckLenderMatch: () => void;
}

const PreQualificationCard = ({ onCheckLenderMatch }: PreQualificationCardProps) => {
  const [formData, setFormData] = useState({
    netSalary: "85,000",
    employmentType: "salaried",
    companyName: "Infosys Ltd",
    residingCity: "Bangalore",
    ownedHouse: "rented",
    totalExperience: "6",
    designation: "Senior Software Engineer",
  });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Pre-Qualification Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Net Inhand Salary</Label>
          <Input
            value={formData.netSalary}
            onChange={(e) => setFormData({ ...formData, netSalary: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Employment Type</Label>
          <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v })}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Company Name</Label>
          <Input
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Residing City</Label>
          <Select value={formData.residingCity} onValueChange={(v) => setFormData({ ...formData, residingCity: v })}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Owned House</Label>
          <Select value={formData.ownedHouse} onValueChange={(v) => setFormData({ ...formData, ownedHouse: v })}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total Work Experience</Label>
          <Input
            value={formData.totalExperience}
            onChange={(e) => setFormData({ ...formData, totalExperience: e.target.value })}
            className="h-9 text-sm"
            suffix="years"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Current Designation</Label>
          <Input
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Button size="sm" className="gap-1.5" onClick={onCheckLenderMatch}>
          <Search className="h-3.5 w-3.5" />
          Check Lender Match
        </Button>
      </div>
    </div>
  );
};

export default PreQualificationCard;
