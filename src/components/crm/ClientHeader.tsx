import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Copy, CreditCard, FileText, Users, FolderOpen } from "lucide-react";
import { toast } from "sonner";

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
  phone?: string;
  channel?: string;
  onCheckLenderMatch: () => void;
}

const CopyableText = ({ text, className = "" }: { text: string; className?: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span>{text}</span>
      <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
        <Copy className="h-3 w-3" />
      </button>
    </span>
  );
};

const ClientHeader = ({
  clientName,
  clientId,
  stage,
  phone = "77210 69734",
  channel = "DCP",
}: ClientHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 bg-card border-b">
      {/* Main client info bar */}
      <div className="px-6 py-3 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <CopyableText text={clientId} className="text-sm font-medium text-primary" />
            <CopyableText text={clientName} className="text-sm font-semibold text-foreground" />
            <CopyableText text={phone} className="text-sm text-foreground" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <FileText className="h-4 w-4" />
              <Users className="h-4 w-4" />
              <FolderOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">{channel}</Badge>
            <Badge variant="outline" className={`text-xs font-medium ${stageStyles[stage] || stageStyles.Lead}`}>
              {stage}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
