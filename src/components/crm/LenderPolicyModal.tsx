import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LenderPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const lenderPolicyData = [
  { lender: "AFL (Aditya Birla Finance)", product: "Personal Loan", minAmt: "50,000", maxAmt: "10,00,000", tenure: "12–60 months", minROI: "16%", maxROI: "24%", cibil: "≥ 650", notes: "Salaried employees only" },
  { lender: "PFL (Piramal Finance)", product: "Personal Loan", minAmt: "50,000", maxAmt: "15,00,000", tenure: "12–60 months", minROI: "14%", maxROI: "22%", cibil: "≥ 700", notes: "Metro & Urban cities" },
  { lender: "ABCL (Aditya Birla Capital)", product: "Personal Loan", minAmt: "1,00,000", maxAmt: "25,00,000", tenure: "12–60 months", minROI: "13%", maxROI: "22%", cibil: "≥ 700", notes: "A-rated employers preferred" },
  { lender: "TATA Capital", product: "Personal Loan", minAmt: "75,000", maxAmt: "35,00,000", tenure: "12–72 months", minROI: "10.99%", maxROI: "24%", cibil: "≥ 700", notes: "CAT A & above employer" },
  { lender: "IDFC First Bank", product: "Personal Loan", minAmt: "1,00,000", maxAmt: "40,00,000", tenure: "6–60 months", minROI: "10.49%", maxROI: "22%", cibil: "≥ 700", notes: "SA/A category employers" },
  { lender: "ICICI Bank", product: "Personal Loan", minAmt: "50,000", maxAmt: "50,00,000", tenure: "12–72 months", minROI: "10.75%", maxROI: "19%", cibil: "≥ 750", notes: "Superprime employers" },
  { lender: "L&T Finance", product: "Personal Loan", minAmt: "50,000", maxAmt: "15,00,000", tenure: "12–60 months", minROI: "12%", maxROI: "24%", cibil: "≥ 650", notes: "CAT B or above" },
  { lender: "HDFC Bank", product: "Personal Loan", minAmt: "50,000", maxAmt: "40,00,000", tenure: "12–60 months", minROI: "10.5%", maxROI: "21%", cibil: "≥ 750", notes: "Salary account preferred" },
  { lender: "Bajaj Finance", product: "Personal Loan", minAmt: "30,000", maxAmt: "35,00,000", tenure: "6–96 months", minROI: "11%", maxROI: "25%", cibil: "≥ 680", notes: "Pre-approved offers available" },
  { lender: "Kotak Mahindra Bank", product: "Personal Loan", minAmt: "50,000", maxAmt: "40,00,000", tenure: "12–60 months", minROI: "10.99%", maxROI: "24%", cibil: "≥ 700", notes: "Corporate salary acc preferred" },
  { lender: "Axis Bank", product: "Personal Loan", minAmt: "50,000", maxAmt: "40,00,000", tenure: "12–60 months", minROI: "10.49%", maxROI: "21%", cibil: "≥ 700", notes: "Pre-approved customers" },
  { lender: "Yes Bank", product: "Personal Loan", minAmt: "1,00,000", maxAmt: "40,00,000", tenure: "12–60 months", minROI: "10.99%", maxROI: "20%", cibil: "≥ 700", notes: "Salaried & self-employed" },
];

const getRoiBadge = (roi: string): "default" | "secondary" | "outline" => {
  const pct = parseFloat(roi.replace("%", ""));
  if (pct < 13) return "default";
  if (pct < 18) return "secondary";
  return "outline";
};

const LenderPolicyModal = ({ open, onOpenChange }: LenderPolicyModalProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return lenderPolicyData;
    const q = search.toLowerCase();
    return lenderPolicyData.filter(l =>
      l.lender.toLowerCase().includes(q) || l.product.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[780px] sm:max-w-[780px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <SheetTitle className="text-base">Lender Policy Reference</SheetTitle>
        </SheetHeader>
        <div className="px-5 pt-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lender or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 mb-3">{filtered.length} lenders</p>
        </div>
        <div className="overflow-auto flex-1 border-t">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold sticky left-0 bg-background z-10 min-w-[180px]">Lender</TableHead>
                <TableHead className="text-xs font-semibold min-w-[100px]">Min Amount</TableHead>
                <TableHead className="text-xs font-semibold min-w-[100px]">Max Amount</TableHead>
                <TableHead className="text-xs font-semibold min-w-[110px]">Tenure</TableHead>
                <TableHead className="text-xs font-semibold text-center min-w-[80px]">Min ROI</TableHead>
                <TableHead className="text-xs font-semibold text-center min-w-[80px]">Max ROI</TableHead>
                <TableHead className="text-xs font-semibold text-center min-w-[80px]">CIBIL</TableHead>
                <TableHead className="text-xs font-semibold min-w-[180px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">No lenders found</TableCell>
                </TableRow>
              ) : (
                filtered.map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-semibold sticky left-0 bg-background z-10 text-primary">{l.lender}</TableCell>
                    <TableCell className="text-xs">₹{l.minAmt}</TableCell>
                    <TableCell className="text-xs">₹{l.maxAmt}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.tenure}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getRoiBadge(l.minROI)} className="text-[10px]">{l.minROI}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px]">{l.maxROI}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs font-medium">{l.cibil}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.notes}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LenderPolicyModal;
