import { Badge } from "@/components/ui/badge";
import { Copy, CreditCard, FileText, Users, FolderOpen, Globe } from "lucide-react";
import { toast } from "sonner";

/* Maps both legacy stage strings and the dynamic scrub-derived client stages */
const stageStyles: Record<string, string> = {
  // Legacy
  Lead: "bg-secondary text-secondary-foreground",
  Qualified:
    "bg-[hsl(var(--stage-qualified-bg))] text-[hsl(var(--stage-qualified))]",
  "Login Done":
    "bg-[hsl(var(--status-eligible-bg))] text-[hsl(var(--status-eligible-foreground))]",
  "Scrub Done":
    "bg-[hsl(var(--stage-scrub-done-bg))] text-[hsl(var(--stage-scrub-done))]",

  // Base / pre-scrub
  DCP_AGREEMENT_SIGNED:
    "bg-blue-50 text-blue-700 border-blue-200",

  // Rep action stages
  "File Rejected": "bg-red-50 text-red-700 border-red-300",

  // Scrub-derived (from SCRUB_STATUS_CONFIG.clientStage)
  "Scrub Requested":
    "bg-amber-50 text-amber-700 border-amber-300",
  "Scrub Approved":
    "bg-green-50 text-green-700 border-green-300",
  "Scrub Rejected":
    "bg-red-50 text-red-700 border-red-300",
  "Under Review – Rep Pending":
    "bg-orange-50 text-orange-700 border-orange-300",
  "Under Review – Credit Pending":
    "bg-blue-50 text-blue-700 border-blue-300",
  Invalid:
    "bg-gray-100 text-gray-600 border-gray-300",
};

interface ClientHeaderProps {
  clientName: string;
  clientId: string;
  stage: string;
  phone?: string;
  channel?: string;
  onCheckLenderMatch: () => void;
  onPortalClick: () => void;
  requestDetailsStatus?: "none" | "pending" | "completed";
  requestDocsStatus?: "none" | "pending" | "completed";
}

const CopyableText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span>{text}</span>
      <button
        onClick={handleCopy}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
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
  onPortalClick,
  requestDetailsStatus = "none",
  requestDocsStatus = "none",
}: ClientHeaderProps) => {
  const stageCls = stageStyles[stage] ?? stageStyles.Lead;

  /* Format the stage label — convert DCP_AGREEMENT_SIGNED → DCP Agreement Signed */
  const stageLabel =
    stage === "DCP_AGREEMENT_SIGNED"
      ? "DCP Agreement Signed"
      : stage;

  return (
    <div className="sticky top-0 z-30 bg-card border-b shadow-sm">
      <div className="px-6 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <CopyableText
              text={clientId}
              className="text-sm font-medium text-primary"
            />
            <CopyableText
              text={clientName}
              className="text-sm font-semibold text-foreground"
            />
            <CopyableText
              text={phone}
              className="text-sm text-foreground"
            />
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <FileText className="h-4 w-4" />
              <Users className="h-4 w-4" />
              <FolderOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Request status badges — shown when any request has been sent */}
            {requestDetailsStatus !== "none" && (
              <Badge
                variant="outline"
                className={`text-[10px] font-medium gap-1 ${
                  requestDetailsStatus === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-green-50 text-green-700 border-green-300"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${requestDetailsStatus === "pending" ? "bg-amber-500" : "bg-green-500"}`} />
                Details · {requestDetailsStatus === "pending" ? "Pending" : "Done"}
              </Badge>
            )}
            {requestDocsStatus !== "none" && (
              <Badge
                variant="outline"
                className={`text-[10px] font-medium gap-1 ${
                  requestDocsStatus === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-green-50 text-green-700 border-green-300"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${requestDocsStatus === "pending" ? "bg-amber-500" : "bg-green-500"}`} />
                Docs · {requestDocsStatus === "pending" ? "Pending" : "Done"}
              </Badge>
            )}
            <button
              onClick={onPortalClick}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border rounded-md px-2.5 py-1.5 transition-colors hover:bg-muted/50"
            >
              <Globe className="h-3.5 w-3.5" />
              Portal
            </button>
            <Badge
              variant="outline"
              className="text-xs font-medium"
            >
              {channel}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-medium ${stageCls}`}
            >
              {stageLabel}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
