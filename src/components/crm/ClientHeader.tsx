import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Search, ChevronDown } from "lucide-react";

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
  onRequestDocuments: () => void;
}

const ClientHeader = ({
  clientName,
  clientId,
  stage,
  onCheckLenderMatch,
  onRequestDetails,
  onRequestDocuments,
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
          <Button size="sm" className="gap-1.5 text-xs" onClick={onCheckLenderMatch}>
            <Search className="h-3.5 w-3.5" />
            Check Lender Match
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                Select Actions
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onRequestDetails} className="text-sm font-medium cursor-pointer">
                Request Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRequestDocuments} className="text-sm font-medium cursor-pointer">
                Request Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
