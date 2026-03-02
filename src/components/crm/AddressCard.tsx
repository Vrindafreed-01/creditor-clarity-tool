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
import { X } from "lucide-react";

interface AddressBlockProps {
  label: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  onUpdate: (field: string, value: string) => void;
}

const AddressBlock = ({ label, address, city, state, country, pinCode, onUpdate }: AddressBlockProps) => (
  <div className="space-y-3">
    <div className="space-y-1.5">
      <Label className="crm-field-label">{label}</Label>
      <Input value={address} onChange={(e) => onUpdate("address", e.target.value)} className="h-9 text-sm" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="space-y-1.5">
        <Label className="crm-field-label">City</Label>
        <div className="relative">
          <Input value={city} onChange={(e) => onUpdate("city", e.target.value)} className="h-9 text-sm pr-12" />
          {city && (
            <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5">
              <button onClick={() => onUpdate("city", "")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="crm-field-label">State</Label>
        <Select value={state} onValueChange={(v) => onUpdate("state", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
            <SelectItem value="Gujarat">Gujarat</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="crm-field-label">Country</Label>
        <Input value={country} onChange={(e) => onUpdate("country", e.target.value)} className="h-9 text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label className="crm-field-label">Pin Code</Label>
        <Input value={pinCode} onChange={(e) => onUpdate("pinCode", e.target.value)} className="h-9 text-sm" />
      </div>
    </div>
  </div>
);

const AddressCard = () => {
  const [aadhaar, setAadhaar] = useState({ address: "", city: "", state: "", country: "India", pinCode: "" });
  const [permanent, setPermanent] = useState({ address: "", city: "", state: "", country: "India", pinCode: "" });
  const [current, setCurrent] = useState({ address: "", city: "", state: "", country: "India", pinCode: "" });
  const [housingType, setHousingType] = useState("");

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Residential Details</h3>
      <div className="space-y-5">
        <AddressBlock
          label="Aadhaar Address"
          {...aadhaar}
          onUpdate={(field, value) => setAadhaar({ ...aadhaar, [field]: value })}
        />
        <AddressBlock
          label="Permanent Address"
          {...permanent}
          onUpdate={(field, value) => setPermanent({ ...permanent, [field]: value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="crm-field-label">Current Address</Label>
            <Input
              value={current.address}
              onChange={(e) => setCurrent({ ...current, address: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Housing Type</Label>
            <Input
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="crm-field-label">City</Label>
            <div className="relative">
              <Input value={current.city} onChange={(e) => setCurrent({ ...current, city: e.target.value })} className="h-9 text-sm pr-12" />
              {current.city && (
                <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5">
                  <button onClick={() => setCurrent({ ...current, city: "" })} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">State</Label>
            <Select value={current.state} onValueChange={(v) => setCurrent({ ...current, state: v })}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Country</Label>
            <Input value={current.country} onChange={(e) => setCurrent({ ...current, country: e.target.value })} className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="crm-field-label">Pin Code</Label>
            <Input value={current.pinCode} onChange={(e) => setCurrent({ ...current, pinCode: e.target.value })} className="h-9 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
