import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

const AddressCard = () => {
  const [addresses, setAddresses] = useState({
    aadhaarAddress: "123, MG Road, Koramangala, Bangalore - 560034",
    permanentAddress: "45, Civil Lines, Jaipur, Rajasthan - 302001",
    currentAddress: "Flat 12B, Prestige Tower, HSR Layout, Bangalore - 560102",
    housingType: "Rented",
  });

  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Address Details</h3>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Save className="h-3 w-3" />
          Save
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Aadhaar Address</Label>
          <Input
            value={addresses.aadhaarAddress}
            onChange={(e) => setAddresses({ ...addresses, aadhaarAddress: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Permanent Address</Label>
          <Input
            value={addresses.permanentAddress}
            onChange={(e) => setAddresses({ ...addresses, permanentAddress: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Current Address</Label>
          <Input
            value={addresses.currentAddress}
            onChange={(e) => setAddresses({ ...addresses, currentAddress: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Housing Type</Label>
          <Input
            value={addresses.housingType}
            onChange={(e) => setAddresses({ ...addresses, housingType: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
