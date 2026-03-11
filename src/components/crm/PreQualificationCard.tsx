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
    netSalary: "",
    residingCity: "",
    housingType: "",
    currentCity: "",
    currentCityHousing: "",
    companyName: "",
    employmentType: "",
    lenderFitmentCheck: "",
  });

  return (
    <div className="space-y-4">
      {/* Qualification Details */}
      <div className="bg-card rounded-lg border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Qualification Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="crm-field-label">Net Inhand Salary</Label>
            <Input
              value={formData.netSalary}
              onChange={(e) => setFormData({ ...formData, netSalary: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Residing City</Label>
            <Input
              value={formData.residingCity}
              onChange={(e) => setFormData({ ...formData, residingCity: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Housing Type</Label>
            <Select value={formData.housingType} onValueChange={(v) => setFormData({ ...formData, housingType: v })}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Owned</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Current City</Label>
            <Input
              value={formData.currentCity}
              onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Current City Housing</Label>
            <Select value={formData.currentCityHousing} onValueChange={(v) => setFormData({ ...formData, currentCityHousing: v })}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Owned</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
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
            <Label className="crm-field-label">Employment Type</Label>
            <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v })}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
                <SelectItem value="self-employed-professional">Self Employed Professional</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-4">
          <div className="space-y-1.5 flex-1 max-w-[calc(25%-12px)]">
            <Label className="crm-field-label">Lender Fitment Check</Label>
            <div className="relative">
              <Input
                value={formData.lenderFitmentCheck}
                onChange={(e) => setFormData({ ...formData, lenderFitmentCheck: e.target.value })}
                className="h-9 text-sm pr-9"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button size="sm" className="gap-1.5 h-9" onClick={onCheckLenderMatch}>
            <Search className="h-3.5 w-3.5" />
            Check Lender Match
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreQualificationCard;
