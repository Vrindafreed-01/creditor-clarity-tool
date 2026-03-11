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

const INDIAN_CITIES = [
  "Agra", "Ahmedabad", "Amritsar", "Bengaluru", "Bhopal",
  "Chandigarh", "Chennai", "Coimbatore", "Delhi", "Dehradun",
  "Faridabad", "Ghaziabad", "Gurugram", "Guwahati", "Hyderabad",
  "Indore", "Jaipur", "Jamshedpur", "Kanpur", "Kochi",
  "Kolkata", "Lucknow", "Ludhiana", "Madurai", "Mangaluru",
  "Mumbai", "Nagpur", "Nashik", "Noida", "Patna",
  "Pune", "Raipur", "Rajkot", "Ranchi", "Siliguri",
  "Surat", "Thane", "Thiruvananthapuram", "Vadodara", "Varanasi",
  "Vijayawada", "Visakhapatnam",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry",
];

interface AddressState {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

interface AddressBlockProps {
  label: string;
  data: AddressState;
  onUpdate: (field: keyof AddressState, value: string) => void;
}

const AddressBlock = ({ label, data, onUpdate }: AddressBlockProps) => (
  <div className="space-y-3">
    <div className="space-y-1.5">
      <Label className="crm-field-label">{label}</Label>
      <Input
        value={data.address}
        onChange={(e) => onUpdate("address", e.target.value)}
        className="h-9 text-sm"
      />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* City dropdown */}
      <div className="space-y-1.5">
        <Label className="crm-field-label">City</Label>
        <Select value={data.city} onValueChange={(v) => onUpdate("city", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {INDIAN_CITIES.map((city) => (
              <SelectItem key={city} value={city} className="text-sm">
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State dropdown */}
      <div className="space-y-1.5">
        <Label className="crm-field-label">State</Label>
        <Select value={data.state} onValueChange={(v) => onUpdate("state", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {INDIAN_STATES.map((state) => (
              <SelectItem key={state} value={state} className="text-sm">
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country */}
      <div className="space-y-1.5">
        <Label className="crm-field-label">Country</Label>
        <Input
          value={data.country}
          onChange={(e) => onUpdate("country", e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      {/* Pin Code */}
      <div className="space-y-1.5">
        <Label className="crm-field-label">Pin Code</Label>
        <Input
          value={data.pinCode}
          onChange={(e) => onUpdate("pinCode", e.target.value)}
          className="h-9 text-sm"
        />
      </div>
    </div>
  </div>
);

const AddressCard = () => {
  const [aadhaar, setAadhaar] = useState<AddressState>({
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
  });
  const [permanent, setPermanent] = useState<AddressState>({
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
  });
  const [current, setCurrent] = useState<AddressState>({
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
  });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Residential Details
      </h3>
      <div className="space-y-5">
        <AddressBlock
          label="Aadhaar Address"
          data={aadhaar}
          onUpdate={(field, value) =>
            setAadhaar((prev) => ({ ...prev, [field]: value }))
          }
        />
        <AddressBlock
          label="Permanent Address"
          data={permanent}
          onUpdate={(field, value) =>
            setPermanent((prev) => ({ ...prev, [field]: value }))
          }
        />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="crm-field-label">Current Address</Label>
            <Input
              value={current.address}
              onChange={(e) =>
                setCurrent((prev) => ({ ...prev, address: e.target.value }))
              }
              className="h-9 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Current City dropdown */}
            <div className="space-y-1.5">
              <Label className="crm-field-label">City</Label>
              <Select
                value={current.city}
                onValueChange={(v) =>
                  setCurrent((prev) => ({ ...prev, city: v }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {INDIAN_CITIES.map((city) => (
                    <SelectItem key={city} value={city} className="text-sm">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current State */}
            <div className="space-y-1.5">
              <Label className="crm-field-label">State</Label>
              <Select
                value={current.state}
                onValueChange={(v) =>
                  setCurrent((prev) => ({ ...prev, state: v }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state} className="text-sm">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="crm-field-label">Country</Label>
              <Input
                value={current.country}
                onChange={(e) =>
                  setCurrent((prev) => ({ ...prev, country: e.target.value }))
                }
                className="h-9 text-sm"
              />
            </div>

            {/* Pin Code */}
            <div className="space-y-1.5">
              <Label className="crm-field-label">Pin Code</Label>
              <Input
                value={current.pinCode}
                onChange={(e) =>
                  setCurrent((prev) => ({ ...prev, pinCode: e.target.value }))
                }
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
