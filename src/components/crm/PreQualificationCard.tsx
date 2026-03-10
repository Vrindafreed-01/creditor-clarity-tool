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
  const [totalOutstanding, setTotalOutstanding] = useState("");
  const [formData, setFormData] = useState({
    netSalary: "",
    residingCity: "",
    housingType: "",
    currentCity: "",
    currentCityHousing: "",
    companyName: "",
    lenderFitmentCheck: "",
  });

  return (
    <div className="space-y-4">
      {/* Total Outstanding */}
      <div className="bg-card rounded-lg border p-4 flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">Total Outstanding</Label>
        <Input
          value={totalOutstanding}
          onChange={(e) => setTotalOutstanding(e.target.value)}
          className="h-9 text-sm w-60"
          placeholder="Enter amount"
        />
      </div>

      {/* Qualification Details */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Qualification Details</h3>
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
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
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
        </div>
        <div className="mt-5 flex justify-end">
          <Button size="sm" className="gap-1.5" onClick={onCheckLenderMatch}>
            <Search className="h-3.5 w-3.5" />
            Check Lender Match
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreQualificationCard;
