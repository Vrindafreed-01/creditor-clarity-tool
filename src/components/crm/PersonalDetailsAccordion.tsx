import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnifiedDatePicker } from "@/components/ui/unified-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonalData } from "@/types/client";

interface PersonalDetailsAccordionProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  requestedDetailIds?: string[];
}

const PersonalDetailsAccordion = ({
  data,
  onChange,
}: PersonalDetailsAccordionProps) => {
  const update = (key: keyof PersonalData, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Name as per PAN Card</Label>
          <Input value={data.nameAsPan} onChange={(e) => update("nameAsPan", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Name as per Aadhaar Card</Label>
          <Input value={data.nameAsAadhaar} onChange={(e) => update("nameAsAadhaar", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Father's Name</Label>
          <Input value={data.fatherName} onChange={(e) => update("fatherName", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Mother's Name</Label>
          <Input value={data.motherName} onChange={(e) => update("motherName", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Spouse Name</Label>
          <Input value={data.spouseName} onChange={(e) => update("spouseName", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">PAN No</Label>
          <Input value={data.panNo} onChange={(e) => update("panNo", e.target.value)} className="h-9 text-sm" placeholder="ABCDE1234F" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Aadhaar Card Number</Label>
          <Input value={data.aadhaar} onChange={(e) => update("aadhaar", e.target.value)} className="h-9 text-sm" placeholder="XXXX XXXX XXXX" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Date of Birth</Label>
          <UnifiedDatePicker value={data.dob} onChange={(v) => update("dob", v)} placeholder="MM/DD/YYYY" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Mobile Number</Label>
          <Input value={data.mobile} onChange={(e) => update("mobile", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Alternate Mobile Number</Label>
          <Input value={data.alternateMobile} onChange={(e) => update("alternateMobile", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Personal Email Address</Label>
          <Input value={data.personalEmail} onChange={(e) => update("personalEmail", e.target.value)} className="h-9 text-sm" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Official Email ID</Label>
          <Input value={data.officialEmail} onChange={(e) => update("officialEmail", e.target.value)} className="h-9 text-sm" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Gender</Label>
          <Select value={data.gender} onValueChange={(v) => update("gender", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Marital Status</Label>
          <Select value={data.maritalStatus} onValueChange={(v) => update("maritalStatus", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsAccordion;
