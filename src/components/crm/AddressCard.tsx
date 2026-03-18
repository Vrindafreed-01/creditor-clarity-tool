import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressData } from "@/types/client";

interface AddressBlockProps {
  label: string;
  ownershipLabel: string;
  addressValue: string;
  ownershipValue: string;
  onAddressChange: (v: string) => void;
  onOwnershipChange: (v: string) => void;
}

const AddressBlock = ({
  label,
  ownershipLabel,
  addressValue,
  ownershipValue,
  onAddressChange,
  onOwnershipChange,
}: AddressBlockProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="md:col-span-3 space-y-1.5">
      <Label className="crm-field-label">{label}</Label>
      <Input
        value={addressValue}
        onChange={(e) => onAddressChange(e.target.value)}
        className="h-9 text-sm"
        placeholder="Enter full address"
      />
    </div>
    <div className="space-y-1.5">
      <Label className="crm-field-label">{ownershipLabel}</Label>
      <Select value={ownershipValue} onValueChange={onOwnershipChange}>
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

interface AddressCardProps {
  data: AddressData;
  onChange: (data: AddressData) => void;
  requestedDetailIds?: string[];
}

const AddressCard = ({ data, onChange }: AddressCardProps) => {
  const update = (key: keyof AddressData, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Residential Details</h3>
      <div className="space-y-5">
        <AddressBlock
          label="Aadhaar Address"
          ownershipLabel="Aadhaar Address (Owned / Rented)"
          addressValue={data.aadhaarAddress}
          ownershipValue={data.aadhaarOwnership}
          onAddressChange={(v) => update("aadhaarAddress", v)}
          onOwnershipChange={(v) => update("aadhaarOwnership", v)}
        />
        <AddressBlock
          label="Permanent Address"
          ownershipLabel="Permanent Address (Owned / Rented)"
          addressValue={data.permanentAddress}
          ownershipValue={data.permanentOwnership}
          onAddressChange={(v) => update("permanentAddress", v)}
          onOwnershipChange={(v) => update("permanentOwnership", v)}
        />
        <AddressBlock
          label="Current Address"
          ownershipLabel="Current Address (Owned / Rented)"
          addressValue={data.currentAddress}
          ownershipValue={data.currentOwnership}
          onAddressChange={(v) => update("currentAddress", v)}
          onOwnershipChange={(v) => update("currentOwnership", v)}
        />
      </div>
    </div>
  );
};

export default AddressCard;
