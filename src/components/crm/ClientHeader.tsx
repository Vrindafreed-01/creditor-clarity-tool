import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Send, Search, ChevronDown } from "lucide-react";

const stageStyles: Record<string, string> = {
  Lead: "bg-secondary text-secondary-foreground",
  Qualified: "bg-[hsl(var(--stage-qualified-bg))] text-[hsl(var(--stage-qualified))]",
  "Login Done": "bg-[hsl(var(--status-eligible-bg))] text-[hsl(var(--status-eligible-foreground))]",
  "Scrub Done": "bg-[hsl(var(--stage-scrub-done-bg))] text-[hsl(var(--stage-scrub-done))]",
};

interface ClientHeaderProps {
  clientName: string;
  clientId: string;
  stage: string;
  onCheckLenderMatch: () => void;
  onRequestDetails: () => void;
}

const ClientHeader = ({
  clientName,
  clientId,
  stage,
  onCheckLenderMatch,
  onRequestDetails,
}: ClientHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">{clientName}</h1>
              <Badge variant="outline" className={stageStyles[stage] || stageStyles.Lead}>
                {stage}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">ID: {clientId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Download CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onRequestDetails}>
            <Send className="h-3.5 w-3.5" />
            Request Details
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={onCheckLenderMatch}>
            <Search className="h-3.5 w-3.5" />
            Check Lender Match
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                Actions
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Client</DropdownMenuItem>
              <DropdownMenuItem>Assign Rep</DropdownMenuItem>
              <DropdownMenuItem>Move Stage</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Archive Client</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
