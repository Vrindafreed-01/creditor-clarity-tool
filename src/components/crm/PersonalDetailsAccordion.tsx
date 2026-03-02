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
import { Calendar } from "lucide-react";

const PersonalDetailsAccordion = () => {
  const [data, setData] = useState({
    nameAsPan: "",
    fatherName: "",
    motherName: "",
    dob: "",
    age: "",
    aadhaar: "",
    pan: "",
    maritalStatus: "",
    mobile: "",
    personalEmail: "",
    officialEmail: "",
    gender: "",
  });

  const update = (key: string, value: string) => setData({ ...data, [key]: value });

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Name as per PAN Card</Label>
          <Input value={data.nameAsPan} onChange={(e) => update("nameAsPan", e.target.value)} className="h-9 text-sm" />
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
          <Label className="crm-field-label">Date of Birth</Label>
          <div className="relative">
            <Input value={data.dob} onChange={(e) => update("dob", e.target.value)} className="h-9 text-sm pr-8" type="date" />
            <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Age</Label>
          <Input value={data.age} onChange={(e) => update("age", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">AADHAAR CARD NUMBER</Label>
          <Input value={data.aadhaar} onChange={(e) => update("aadhaar", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">PAN CARD NUMBER</Label>
          <Input value={data.pan} onChange={(e) => update("pan", e.target.value)} className="h-9 text-sm" />
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
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Mobile number</Label>
          <Input value={data.mobile} onChange={(e) => update("mobile", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Personal Email Address</Label>
          <Input value={data.personalEmail} onChange={(e) => update("personalEmail", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Official Email Address</Label>
          <Select value={data.officialEmail} onValueChange={(v) => update("officialEmail", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office1">Office Email 1</SelectItem>
              <SelectItem value="office2">Office Email 2</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
    </div>
  );
};

export default PersonalDetailsAccordion;
