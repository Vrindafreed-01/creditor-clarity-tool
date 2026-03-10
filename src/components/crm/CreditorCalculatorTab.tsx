import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Minus, Search, MoreVertical, ChevronDown, FileSpreadsheet, Columns, Group } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Creditor {
  id: string;
  name: string;
  debtType: string;
  accountNumber: string;
  openDate: string;
  sanctionedAmount: number;
  currentBalance: number;
  closureAmount: number;
  tenure: number;
  currentROI: string;
  emi: number;
}

const includedCreditors: Creditor[] = [
  { id: "1", name: "SOUTH INDIAN BANK", debtType: "CREDIT_CARD", accountNumber: "XXXXXXXXXXXXXXX2379", openDate: "18th Jul 23", sanctionedAmount: 115361, currentBalance: 100000, closureAmount: 100000, tenure: 0, currentROI: "--", emi: 5000 },
  { id: "2", name: "Aditya Birla Capital Limited", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXXXXXX7905", openDate: "21st Jan 25", sanctionedAmount: 294427, currentBalance: 227879, closureAmount: 227879, tenure: 0, currentROI: "--", emi: 11000 },
  { id: "3", name: "Krazybee Services Private Limited", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXURRL", openDate: "12th Jul 25", sanctionedAmount: 246000, currentBalance: 197786, closureAmount: 197786, tenure: 30, currentROI: "--", emi: 7000 },
  { id: "4", name: "HDFC BANK LTD", debtType: "PERSONAL_LOAN", accountNumber: "XXXXX7969", openDate: "26th Aug 25", sanctionedAmount: 511541, currentBalance: 468092, closureAmount: 468092, tenure: 0, currentROI: "--", emi: 13000 },
  { id: "5", name: "Respo Financial Capital Private Limited", debtType: "PERSONAL_LOAN", accountNumber: "12345", openDate: "1st Oct 25", sanctionedAmount: 200000, currentBalance: 180000, closureAmount: 180000, tenure: 0, currentROI: "--", emi: 12000 },
];

const excludedCreditors: Creditor[] = [
  { id: "e1", name: "HDFC BANK LTD", debtType: "CREDIT_CARD", accountNumber: "XXXXXXXXXXXXXXX9181", openDate: "28th Sep 23", sanctionedAmount: 208530, currentBalance: 198834, closureAmount: 198834, tenure: 0, currentROI: "--", emi: 9941.70 },
  { id: "e2", name: "Responce Investments Limited", debtType: "PERSONAL_LOAN", accountNumber: "123456", openDate: "2nd Oct 26", sanctionedAmount: 1, currentBalance: 1, closureAmount: 1, tenure: 0, currentROI: "--", emi: 0 },
  { id: "e3", name: "SMFG India Credit Company Limited", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXX3029", openDate: "7th Jul 25", sanctionedAmount: 60000, currentBalance: 32311, closureAmount: 32311, tenure: 0, currentROI: "--", emi: 7000 },
  { id: "e4", name: "Early Salary Pvt. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXXXX3284", openDate: "6th Nov 25", sanctionedAmount: 8000, currentBalance: 5451, closureAmount: 5451, tenure: 0, currentROI: "--", emi: 5000 },
  { id: "e5", name: "HDB Financial Services Limited", debtType: "PERSONAL_LOAN", accountNumber: "XXXX0586", openDate: "6th Nov 25", sanctionedAmount: 32000, currentBalance: 21801, closureAmount: 21801, tenure: 6, currentROI: "--", emi: 0 },
];

const CreditorCalculatorTab = () => {
  const [included, setIncluded] = useState(includedCreditors);
  const [excluded, setExcluded] = useState(excludedCreditors);

  // Calculator state
  const [loanAmount, setLoanAmount] = useState(1700757);
  const [tenure, setTenure] = useState("72");
  const [rateOfInterest, setRateOfInterest] = useState(16);
  const [existingTotalEMI, setExistingTotalEMI] = useState(69942);
  const [calculated, setCalculated] = useState(false);

  const income = 100000;

  const totalSanctioned = included.reduce((s, c) => s + c.sanctionedAmount, 0);
  const totalCurrentBalance = included.reduce((s, c) => s + c.currentBalance, 0);
  const totalClosureAmount = included.reduce((s, c) => s + c.closureAmount, 0);
  const totalEMI = included.reduce((s, c) => s + c.emi, 0);

  const totalDebt = included.reduce((s, c) => s + c.closureAmount, 0);
  const creditScore = 751;

  const handleExclude = (id: string) => {
    const creditor = included.find(c => c.id === id);
    if (creditor) {
      setIncluded(included.filter(c => c.id !== id));
      setExcluded([...excluded, creditor]);
    }
  };

  const handleInclude = (id: string) => {
    const creditor = excluded.find(c => c.id === id);
    if (creditor) {
      setExcluded(excluded.filter(c => c.id !== id));
      setIncluded([...included, creditor]);
    }
  };

  // Calculator logic
  const monthlyRate = rateOfInterest / 100 / 12;
  const tenureMonths = parseInt(tenure);
  const loanEMI = monthlyRate > 0 && tenureMonths > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    : 0;
  const totalInterest = loanEMI * tenureMonths - loanAmount;
  const totalRepayment = loanEMI * tenureMonths;
  const netTangibleBenefit = income > 0 ? ((income - (loanEMI + totalEMI)) / income) * 100 : 0;
  const cashFreed = income - (loanEMI + totalEMI) - (income - existingTotalEMI);

  const allEMIs = [...included.map(c => ({ account: c.name, emi: c.emi }))];
  const excludedEMIs = excluded.map(c => ({ account: c.name, emi: c.emi }));

  const preFOIR = income > 0 ? ((existingTotalEMI) / income) * 100 : 0;
  const newTotalObligation = Math.round(loanEMI) + excluded.reduce((s, c) => s + c.emi, 0);
  const postFOIR = income > 0 ? (newTotalObligation / income) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Strip */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-foreground">Included Creditors</h2>
        <div className="h-6 w-px bg-border" />
        <Badge variant="outline" className="text-xs font-normal">Total Debt - ₹{totalDebt.toLocaleString()}</Badge>
        <Badge variant="outline" className="text-xs font-normal">Credit Score - {creditScore}</Badge>
        <Badge variant="outline" className="text-xs font-normal">Cibil Score - --</Badge>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                Actions <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2 text-sm">
                <FileSpreadsheet className="h-4 w-4" /> Download excel
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-sm">
                <Columns className="h-4 w-4" /> Show and hide
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-sm">
                <Group className="h-4 w-4" /> Group by
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Included Creditors Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8"></TableHead>
              <TableHead className="text-xs">Creditor Name</TableHead>
              <TableHead className="text-xs">Debt Type</TableHead>
              <TableHead className="text-xs">Account Number</TableHead>
              <TableHead className="text-xs">Open Date</TableHead>
              <TableHead className="text-xs text-right">Sanctioned Limited</TableHead>
              <TableHead className="text-xs text-right">Current Balance</TableHead>
              <TableHead className="text-xs text-right">Closure Amount</TableHead>
              <TableHead className="text-xs text-right">Tenure total</TableHead>
              <TableHead className="text-xs text-right">Current ROI</TableHead>
              <TableHead className="text-xs text-right">EMI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {included.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <input type="checkbox" className="h-4 w-4 rounded border-muted-foreground" />
                </TableCell>
                <TableCell className="text-xs font-medium text-primary">{c.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-normal">{c.debtType}</Badge>
                </TableCell>
                <TableCell className="text-xs">{c.accountNumber}</TableCell>
                <TableCell className="text-xs">{c.openDate}</TableCell>
                <TableCell className="text-xs text-right">₹{c.sanctionedAmount.toLocaleString()}.00</TableCell>
                <TableCell className="text-xs text-right">₹{c.currentBalance.toLocaleString()}.00</TableCell>
                <TableCell className="text-xs text-right">₹{c.closureAmount.toLocaleString()}.00</TableCell>
                <TableCell className="text-xs text-right">{c.tenure || 0}</TableCell>
                <TableCell className="text-xs text-right">{c.currentROI}</TableCell>
                <TableCell className="text-xs text-right">₹{c.emi.toLocaleString()}.00</TableCell>
              </TableRow>
            ))}
            {/* Totals row */}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell colSpan={5}></TableCell>
              <TableCell className="text-xs text-right">₹{totalSanctioned.toLocaleString()}.00</TableCell>
              <TableCell className="text-xs text-right">₹{totalCurrentBalance.toLocaleString()}.00</TableCell>
              <TableCell className="text-xs text-right">₹{totalClosureAmount.toLocaleString()}.00</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-xs text-right">₹{totalEMI.toLocaleString()}.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex items-center justify-end px-4 py-2 border-t text-xs text-muted-foreground gap-4">
          <span>Rows per page:</span>
          <Select defaultValue="15">
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>1-{included.length} of {included.length}</span>
        </div>
      </div>

      {/* Excluded Creditors */}
      <div className="bg-card rounded-lg border">
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-base font-semibold text-foreground">Excluded Creditors</h2>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  Actions <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2 text-sm">
                  <FileSpreadsheet className="h-4 w-4" /> Download excel
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-sm">
                  <Columns className="h-4 w-4" /> Show and hide
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-sm">
                  <Group className="h-4 w-4" /> Group by
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-primary border-primary">
              <Plus className="h-3.5 w-3.5" /> Add Creditor
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8"></TableHead>
              <TableHead className="text-xs">Creditor Name</TableHead>
              <TableHead className="text-xs">Debt Type</TableHead>
              <TableHead className="text-xs">Account Number</TableHead>
              <TableHead className="text-xs">Open Date</TableHead>
              <TableHead className="text-xs text-right">Sanctioned Limited</TableHead>
              <TableHead className="text-xs text-right">Current Balance</TableHead>
              <TableHead className="text-xs text-right">Closure Amount</TableHead>
              <TableHead className="text-xs text-right">Tenure total</TableHead>
              <TableHead className="text-xs text-right">Current ROI</TableHead>
              <TableHead className="text-xs text-right">EMI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {excluded.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <input type="checkbox" className="h-4 w-4 rounded border-muted-foreground" />
                </TableCell>
                <TableCell className="text-xs font-medium text-primary">{c.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-normal">{c.debtType}</Badge>
                </TableCell>
                <TableCell className="text-xs">{c.accountNumber}</TableCell>
                <TableCell className="text-xs">{c.openDate}</TableCell>
                <TableCell className="text-xs text-right">₹{c.sanctionedAmount.toLocaleString()}.00</TableCell>
                <TableCell className="text-xs text-right">₹{c.currentBalance.toLocaleString()}.00</TableCell>
                <TableCell className="text-xs text-right">₹{c.closureAmount.toLocaleString()}.00</TableCell>
                <TableCell className="text-xs text-right">{c.tenure || "--"}</TableCell>
                <TableCell className="text-xs text-right">{c.currentROI}</TableCell>
                <TableCell className="text-xs text-right">{c.emi > 0 ? `₹${c.emi.toLocaleString()}` : "--"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end px-4 py-2 border-t text-xs text-muted-foreground gap-4">
          <span>Rows per page:</span>
          <Select defaultValue="15">
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>1-{excluded.length} of {excluded.length}</span>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="bg-card rounded-lg border p-5 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="h-10 text-sm pl-7"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tenure</Label>
            <Select value={tenure} onValueChange={setTenure}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[12, 24, 36, 48, 60, 72, 84, 96].map(t => (
                  <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Rate of interest</Label>
            <Input
              type="number"
              value={rateOfInterest}
              onChange={(e) => setRateOfInterest(Number(e.target.value))}
              className="h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Existing Total EMI</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input
                type="number"
                value={existingTotalEMI}
                onChange={(e) => setExistingTotalEMI(Number(e.target.value))}
                className="h-10 text-sm pl-7"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="text-sm font-medium px-8"
            onClick={() => setCalculated(true)}
          >
            Calculate Loan EMI
          </Button>
        </div>

        {calculated && (
          <>
            {/* Results row 1 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <span className="text-sm text-muted-foreground">Loan EMI Amount</span>
                <span className="text-sm font-bold text-foreground">₹{Math.round(loanEMI).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <span className="text-sm text-muted-foreground">Total Interest Payable</span>
                <span className="text-sm font-bold text-foreground">₹{Math.round(totalInterest).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <span className="text-sm text-muted-foreground">Total Repayment Amount</span>
                <span className="text-sm font-bold text-foreground">₹{Math.round(totalRepayment).toLocaleString()}</span>
              </div>
            </div>
            {/* Results row 2 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <span className="text-sm text-muted-foreground">Income</span>
                <span className="text-sm font-bold text-foreground">₹{income.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <span className="text-sm text-muted-foreground">Net Tangible Benefit</span>
                <span className="text-sm font-bold text-foreground">{netTangibleBenefit.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <span className="text-sm text-muted-foreground">Cash FREED</span>
                <span className="text-sm font-bold text-foreground">₹{Math.round(cashFreed).toLocaleString()}</span>
              </div>
            </div>

            {/* Pre and Post consolidation tables */}
            <div className="grid grid-cols-2 gap-6">
              {/* Pre-consolidation */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-center">Account</TableHead>
                      <TableHead className="text-xs font-bold text-center">EMI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEMIs.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs text-center">{item.account}</TableCell>
                        <TableCell className="text-xs text-center">₹{item.emi.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {excludedEMIs.map((item, i) => (
                      <TableRow key={`ex-${i}`}>
                        <TableCell className="text-xs text-center">{item.account}</TableCell>
                        <TableCell className="text-xs text-center">₹{item.emi.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="text-xs text-center font-medium">Total Monthly Obligation</TableCell>
                      <TableCell className="text-xs text-center font-medium">₹{existingTotalEMI.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/30">
                      <TableCell className="text-xs text-center font-bold">Pre-consolidation FOIR</TableCell>
                      <TableCell className={`text-xs text-center font-bold ${preFOIR > 50 ? "text-destructive" : "text-green-600"}`}>
                        {preFOIR.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Post-consolidation */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-center">Account</TableHead>
                      <TableHead className="text-xs font-bold text-center">EMI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs text-center">Consolidation Loan</TableCell>
                      <TableCell className="text-xs text-center">₹{Math.round(loanEMI).toLocaleString()}</TableCell>
                    </TableRow>
                    {excludedEMIs.map((item, i) => (
                      <TableRow key={`post-${i}`}>
                        <TableCell className="text-xs text-center">{item.account}</TableCell>
                        <TableCell className="text-xs text-center">₹{item.emi.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="text-xs text-center font-medium">New Total Monthly Obligation</TableCell>
                      <TableCell className="text-xs text-center font-medium">₹{newTotalObligation.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/30">
                      <TableCell className="text-xs text-center font-bold">Post-consolidation FOIR</TableCell>
                      <TableCell className={`text-xs text-center font-bold ${postFOIR > 50 ? "text-destructive" : "text-green-600"}`}>
                        {postFOIR.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreditorCalculatorTab;
