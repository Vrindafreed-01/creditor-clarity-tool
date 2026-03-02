import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Check, X } from "lucide-react";

type MatchStatus = "eligible" | "ineligible";

interface LenderColumn {
  name: string;
  type: "qualified" | "preferred" | "normal";
  matches: Record<string, MatchStatus>;
}

const parameters = [
  { key: "creditScore", label: "Credit score", input: "680" },
  { key: "minSalary", label: "Min. In Hand Salary", input: "31,000" },
  { key: "maxFoir", label: "Max FOIR", input: "75%" },
  { key: "employerCat", label: "Employer CAT", input: "Airtel Digital" },
  { key: "serviceableLocation", label: "Serviceable Location", input: "Delhi" },
  { key: "maxAccounts", label: "Max Accounts", input: "5" },
  { key: "btMix", label: "BT Mix", input: "2" },
  { key: "ownedHouse", label: "Owned House", input: "Yes" },
];

const lenders: LenderColumn[] = [
  {
    name: "Axis Finance - 1",
    type: "normal",
    matches: { creditScore: "eligible", minSalary: "ineligible", maxFoir: "eligible", employerCat: "ineligible", serviceableLocation: "eligible", maxAccounts: "ineligible", btMix: "eligible", ownedHouse: "eligible" },
  },
  {
    name: "Axis Finance - 2",
    type: "normal",
    matches: { creditScore: "eligible", minSalary: "ineligible", maxFoir: "eligible", employerCat: "ineligible", serviceableLocation: "eligible", maxAccounts: "ineligible", btMix: "ineligible", ownedHouse: "eligible" },
  },
  {
    name: "Poonawala",
    type: "qualified",
    matches: { creditScore: "eligible", minSalary: "eligible", maxFoir: "eligible", employerCat: "eligible", serviceableLocation: "eligible", maxAccounts: "eligible", btMix: "eligible", ownedHouse: "eligible" },
  },
  {
    name: "Shriram Finance",
    type: "preferred",
    matches: { creditScore: "eligible", minSalary: "eligible", maxFoir: "eligible", employerCat: "eligible", serviceableLocation: "eligible", maxAccounts: "eligible", btMix: "eligible", ownedHouse: "eligible" },
  },
];

const StatusIcon = ({ status }: { status: MatchStatus }) =>
  status === "eligible" ? (
    <Check className="h-5 w-5 text-[hsl(var(--status-eligible))] mx-auto" />
  ) : (
    <X className="h-5 w-5 text-[hsl(var(--status-ineligible))] mx-auto" />
  );

const typeBadgeStyles: Record<string, string> = {
  qualified: "bg-status-eligible-bg text-status-eligible-foreground",
  preferred: "bg-primary/10 text-primary",
  normal: "",
};

const LenderMatchTable = () => {
  return (
    <div className="bg-card rounded-lg border" id="lender-match">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Lender Match Details</h3>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          Check Match Using Client PWA Data
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold w-[140px]">Parameters</TableHead>
              <TableHead className="text-xs font-semibold text-center w-[100px]">Inputs</TableHead>
              {lenders.map((l) => (
                <TableHead key={l.name} className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    {l.type !== "normal" && (
                      <Badge className={`${typeBadgeStyles[l.type]} text-[10px] border-0 px-2 py-0.5`}>
                        {l.type === "qualified" ? "Qualified lender" : "Preferred lender"}
                      </Badge>
                    )}
                    <span className="text-xs font-semibold">{l.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((param) => (
              <TableRow key={param.key}>
                <TableCell className="text-sm font-medium">{param.label}</TableCell>
                <TableCell className="text-sm text-center text-muted-foreground">{param.input}</TableCell>
                {lenders.map((l) => (
                  <TableCell key={l.name} className="text-center">
                    <StatusIcon status={l.matches[param.key]} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LenderMatchTable;
