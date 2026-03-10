import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const salesReps = [
  { id: "chandan", name: "chandan.pandey" },
  { id: "rahul", name: "rahul.sharma" },
  { id: "priya", name: "priya.verma" },
  { id: "amit", name: "amit.kumar" },
];

interface AssignSalesRepViewProps {
  onClose: () => void;
}

const AssignSalesRepView = ({ onClose }: AssignSalesRepViewProps) => {
  const [selectedRep, setSelectedRep] = useState("");

  return (
    <div>
      <div className="border-b px-6 py-3">
        <span className="text-sm text-muted-foreground">Actions</span>
        <span className="text-sm text-muted-foreground mx-2">/</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-foreground">Assign Sales Rep</h1>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center mb-12">
          <Select value={selectedRep} onValueChange={setSelectedRep}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select Sales Rep" />
            </SelectTrigger>
            <SelectContent>
              {salesReps.map((rep) => (
                <SelectItem key={rep.id} value={rep.id}>
                  {rep.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center gap-8">
          <Button variant="ghost" className="text-sm text-primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" disabled={!selectedRep}>
            Assign Sales Rep
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignSalesRepView;
