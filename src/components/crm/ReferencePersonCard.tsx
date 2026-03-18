import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefPersonData } from "@/types/client";

interface ReferencePersonCardProps {
  personNumber: number;
  data: RefPersonData;
  onChange: (data: RefPersonData) => void;
  requestedDetailIds?: string[];
}

const ReferencePersonCard = ({
  personNumber,
  data,
  onChange,
}: ReferencePersonCardProps) => {
  const update = (key: keyof RefPersonData, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Reference Person {personNumber}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Name</Label>
          <Input value={data.name} onChange={(e) => update("name", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Relation with Borrower</Label>
          <Input value={data.relation} onChange={(e) => update("relation", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Mobile Number</Label>
          <Select value={data.mobile} onValueChange={(v) => update("mobile", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Email Id (Optional)</Label>
          <Input value={data.email} onChange={(e) => update("email", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="md:col-span-3 space-y-1.5">
          <Label className="crm-field-label">Address Line 1</Label>
          <Input value={data.address} onChange={(e) => update("address", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Pin Code</Label>
          <Input value={data.pinCode} onChange={(e) => update("pinCode", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default ReferencePersonCard;
