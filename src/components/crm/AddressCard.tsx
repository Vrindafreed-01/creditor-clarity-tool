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

interface AddressState {
  address: string;
  ownershipType: string;
}

interface ResidenceDurationState {
  yearsAtPresent: string;
  yearsAtPermanent: string;
}

interface AddressBlockProps {
  label: string;
  ownershipLabel: string;
  data: AddressState;
  onUpdate: (field: keyof AddressState, value: string) => void;
}

const AddressBlock = ({ label, ownershipLabel, data, onUpdate }: AddressBlockProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="md:col-span-3 space-y-1.5">
      <Label className="crm-field-label">{label}</Label>
      <Input
        value={data.address}
        onChange={(e) => onUpdate("address", e.target.value)}
        className="h-9 text-sm"
        placeholder="Enter full address"
      />
    </div>
    <div className="space-y-1.5">
      <Label className="crm-field-label">{ownershipLabel}</Label>
      <Select value={data.ownershipType} onValueChange={(v) => onUpdate("ownershipType", v)}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Owned / Rented" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="owned">Owned</SelectItem>
          <SelectItem value="rented">Rented</SelectItem>
          <SelectItem value="parental">Parental</SelectItem>
          <SelectItem value="company-provided">Company Provided</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const AddressCard = () => {
  const [aadhaar, setAadhaar] = useState<AddressState>({ address: "", ownershipType: "" });
  const [permanent, setPermanent] = useState<AddressState>({ address: "", ownershipType: "" });
  const [current, setCurrent] = useState<AddressState>({ address: "", ownershipType: "" });
  const [duration, setDuration] = useState<ResidenceDurationState>({ yearsAtPresent: "", yearsAtPermanent: "" });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Residential Details</h3>
      <div className="space-y-5">
        <AddressBlock
          label="Aadhaar Address"
          ownershipLabel="Aadhaar Address (Owned / Rented)"
          data={aadhaar}
          onUpdate={(field, value) => setAadhaar((prev) => ({ ...prev, [field]: value }))}
        />
        <AddressBlock
          label="Permanent Address"
          ownershipLabel="Permanent Address (Owned / Rented)"
          data={permanent}
          onUpdate={(field, value) => setPermanent((prev) => ({ ...prev, [field]: value }))}
        />
        <AddressBlock
          label="Current Address"
          ownershipLabel="Current Address (Owned / Rented)"
          data={current}
          onUpdate={(field, value) => setCurrent((prev) => ({ ...prev, [field]: value }))}
        />
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="crm-field-label">Total Years at Present Address</Label>
            <Input
              value={duration.yearsAtPresent}
              onChange={(e) => setDuration((prev) => ({ ...prev, yearsAtPresent: e.target.value }))}
              className="h-9 text-sm"
              placeholder="e.g. 3"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Total Years at Permanent Address</Label>
            <Input
              value={duration.yearsAtPermanent}
              onChange={(e) => setDuration((prev) => ({ ...prev, yearsAtPermanent: e.target.value }))}
              className="h-9 text-sm"
              placeholder="e.g. 10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
