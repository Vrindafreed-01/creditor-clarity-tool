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
import { RefreshCw } from "lucide-react";

type MatchStatus = "eligible" | "ineligible" | "conditional";

interface LenderMatch {
  lender: string;
  salaryMatch: MatchStatus;
  cityMatch: MatchStatus;
  employerMatch: MatchStatus;
  foirEligible: MatchStatus;
  finalStatus: MatchStatus;
}

const statusStyles: Record<MatchStatus, string> = {
  eligible: "bg-status-eligible-bg text-status-eligible-foreground",
  ineligible: "bg-status-ineligible-bg text-status-ineligible-foreground",
  conditional: "bg-status-conditional-bg text-status-conditional-foreground",
};

const statusLabels: Record<MatchStatus, string> = {
  eligible: "Eligible",
  ineligible: "Not Eligible",
  conditional: "Conditional",
};

const mockData: LenderMatch[] = [
  { lender: "HDFC Bank", salaryMatch: "eligible", cityMatch: "eligible", employerMatch: "eligible", foirEligible: "eligible", finalStatus: "eligible" },
  { lender: "ICICI Bank", salaryMatch: "eligible", cityMatch: "eligible", employerMatch: "conditional", foirEligible: "eligible", finalStatus: "conditional" },
  { lender: "Axis Bank", salaryMatch: "eligible", cityMatch: "ineligible", employerMatch: "eligible", foirEligible: "eligible", finalStatus: "ineligible" },
  { lender: "SBI", salaryMatch: "eligible", cityMatch: "eligible", employerMatch: "eligible", foirEligible: "conditional", finalStatus: "conditional" },
  { lender: "Kotak Mahindra", salaryMatch: "ineligible", cityMatch: "eligible", employerMatch: "eligible", foirEligible: "eligible", finalStatus: "ineligible" },
  { lender: "Bajaj Finserv", salaryMatch: "eligible", cityMatch: "eligible", employerMatch: "eligible", foirEligible: "eligible", finalStatus: "eligible" },
];

const StatusBadge = ({ status }: { status: MatchStatus }) => (
  <Badge variant="secondary" className={`${statusStyles[status]} text-xs font-medium border-0`}>
    {statusLabels[status]}
  </Badge>
);

const LenderMatchTable = () => {
  return (
    <div className="bg-card rounded-lg border">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Lender Match Results</h3>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          Check Match Using Client PWA Data
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium">Lender Name</TableHead>
            <TableHead className="text-xs font-medium">Salary Match</TableHead>
            <TableHead className="text-xs font-medium">City Match</TableHead>
            <TableHead className="text-xs font-medium">Employer Match</TableHead>
            <TableHead className="text-xs font-medium">FOIR Eligible</TableHead>
            <TableHead className="text-xs font-medium">Final Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((row) => (
            <TableRow key={row.lender}>
              <TableCell className="text-sm font-medium">{row.lender}</TableCell>
              <TableCell><StatusBadge status={row.salaryMatch} /></TableCell>
              <TableCell><StatusBadge status={row.cityMatch} /></TableCell>
              <TableCell><StatusBadge status={row.employerMatch} /></TableCell>
              <TableCell><StatusBadge status={row.foirEligible} /></TableCell>
              <TableCell><StatusBadge status={row.finalStatus} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LenderMatchTable;
