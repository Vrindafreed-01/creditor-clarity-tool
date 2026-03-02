import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const profileFields = [
  "Father's Name",
  "Mother's Name",
  "PAN",
  "Aadhaar",
  "DOB",
  "Current Address",
  "Permanent Address",
  "Bank Account Number",
  "IFSC Code",
];

const documentTypes = [
  "Salary Slip (3 months)",
  "Bank Statement (6 months)",
  "Form 16",
  "ITR",
  "PAN Card Copy",
  "Aadhaar Card Copy",
  "Address Proof",
  "Employment Certificate",
];

interface RequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDetailsModal = ({ open, onOpenChange }: RequestDetailsModalProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const toggle = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Details from Client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <p className="crm-section-title mb-3">Profile Fields</p>
            <div className="grid grid-cols-2 gap-2">
              {profileFields.map((field) => (
                <div key={field} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedProfile.includes(field)}
                    onCheckedChange={() => toggle(field, selectedProfile, setSelectedProfile)}
                  />
                  <span className="text-sm">{field}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="crm-section-title mb-3">Document Types</p>
            <div className="grid grid-cols-2 gap-2">
              {documentTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedDocs.includes(type)}
                    onCheckedChange={() => toggle(type, selectedDocs, setSelectedDocs)}
                  />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={selectedProfile.length === 0 && selectedDocs.length === 0}
            >
              Send Request ({selectedProfile.length + selectedDocs.length} items)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
