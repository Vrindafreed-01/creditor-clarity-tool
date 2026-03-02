import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";

const dummyClients = [
  { id: "1", name: "Sathva", phone: "0223456789", email: "sathvanaturals@gmail.com" },
  { id: "2", name: "Arshad", phone: "0882826823", email: "Arshad_atul@yahoo.com" },
  { id: "3", name: "Priya", phone: "1234555679", email: "priya.test@gmail.com" },
  { id: "4", name: "Rakesh", phone: "1234567890", email: "rakeshbari110@gmail.com" },
  { id: "5", name: "Meena", phone: "2638476277", email: "meena.k@gmail.com" },
];

interface RequestDocumentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDocumentsModal = ({ open, onOpenChange }: RequestDocumentsModalProps) => {
  const [selectedClient, setSelectedClient] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Request Documents</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Select Details" />
              </SelectTrigger>
              <SelectContent>
                {dummyClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.phone}, {client.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
            {dummyClients.map((client) => (
              <div
                key={client.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedClient === client.id ? "bg-muted" : ""}`}
                onClick={() => setSelectedClient(client.id)}
              >
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4.5 w-4.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.phone}, {client.email}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="sm" disabled={!selectedClient} onClick={() => onOpenChange(false)}>
              Send Request
            </Button>
            <Button variant="outline" size="sm" disabled={!selectedClient}>
              Update Request
            </Button>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDocumentsModal;
