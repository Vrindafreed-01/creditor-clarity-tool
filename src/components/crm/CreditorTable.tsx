import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

interface Creditor {
  id: string;
  name: string;
  debtType: string;
  sanctionedAmount: number;
  currentOutstanding: number;
  emi: number;
  tenure: number;
  roi: number;
  status: string;
}

const initialCreditors: Creditor[] = [
  { id: "1", name: "HDFC Bank", debtType: "Personal Loan", sanctionedAmount: 500000, currentOutstanding: 320000, emi: 12500, tenure: 36, roi: 12.5, status: "Active" },
  { id: "2", name: "ICICI Bank", debtType: "Credit Card", sanctionedAmount: 200000, currentOutstanding: 45000, emi: 5000, tenure: 0, roi: 36, status: "Active" },
  { id: "3", name: "Bajaj Finserv", debtType: "Consumer Durable", sanctionedAmount: 60000, currentOutstanding: 15000, emi: 3500, tenure: 12, roi: 14, status: "Active" },
  { id: "4", name: "SBI", debtType: "Education Loan", sanctionedAmount: 800000, currentOutstanding: 600000, emi: 8000, tenure: 84, roi: 8.5, status: "Active" },
];

const CreditorTable = () => {
  const [creditors, setCreditors] = useState<Creditor[]>(initialCreditors);

  const totalDebt = creditors.reduce((s, c) => s + c.currentOutstanding, 0);
  const totalEMI = creditors.reduce((s, c) => s + c.emi, 0);

  const handleDelete = (id: string) => {
    setCreditors(creditors.filter((c) => c.id !== id));
  };

  const handleAdd = () => {
    const newCreditor: Creditor = {
      id: Date.now().toString(),
      name: "",
      debtType: "",
      sanctionedAmount: 0,
      currentOutstanding: 0,
      emi: 0,
      tenure: 0,
      roi: 0,
      status: "Active",
    };
    setCreditors([...creditors, newCreditor]);
  };

  const handleChange = (id: string, field: keyof Creditor, value: string | number) => {
    setCreditors(creditors.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <div className="bg-card rounded-lg border">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-px bg-border">
        {[
          { label: "Total Debt", value: `₹${totalDebt.toLocaleString()}` },
          { label: "Total EMI", value: `₹${totalEMI.toLocaleString()}` },
          { label: "FOIR", value: `${((totalEMI / 85000) * 100).toFixed(1)}%` },
          { label: "Credit Score", value: "742" },
        ].map((item) => (
          <div key={item.label} className="bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Creditor Details</h3>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add Creditor
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs">Creditor Name</TableHead>
            <TableHead className="text-xs">Debt Type</TableHead>
            <TableHead className="text-xs text-right">Sanctioned</TableHead>
            <TableHead className="text-xs text-right">Outstanding</TableHead>
            <TableHead className="text-xs text-right">EMI</TableHead>
            <TableHead className="text-xs text-right">Tenure</TableHead>
            <TableHead className="text-xs text-right">ROI %</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creditors.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Input value={c.name} onChange={(e) => handleChange(c.id, "name", e.target.value)} className="h-7 text-sm border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:bg-muted rounded px-1" />
              </TableCell>
              <TableCell>
                <Input value={c.debtType} onChange={(e) => handleChange(c.id, "debtType", e.target.value)} className="h-7 text-sm border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:bg-muted rounded px-1" />
              </TableCell>
              <TableCell className="text-right">
                <Input type="number" value={c.sanctionedAmount} onChange={(e) => handleChange(c.id, "sanctionedAmount", Number(e.target.value))} className="h-7 text-sm border-0 bg-transparent p-0 text-right focus-visible:ring-0 focus-visible:bg-muted rounded px-1" />
              </TableCell>
              <TableCell className="text-right">
                <Input type="number" value={c.currentOutstanding} onChange={(e) => handleChange(c.id, "currentOutstanding", Number(e.target.value))} className="h-7 text-sm border-0 bg-transparent p-0 text-right focus-visible:ring-0 focus-visible:bg-muted rounded px-1" />
              </TableCell>
              <TableCell className="text-right">
                <Input type="number" value={c.emi} onChange={(e) => handleChange(c.id, "emi", Number(e.target.value))} className="h-7 text-sm border-0 bg-transparent p-0 text-right focus-visible:ring-0 focus-visible:bg-muted rounded px-1" />
              </TableCell>
              <TableCell className="text-right">
                <Input type="number" value={c.tenure} onChange={(e) => handleChange(c.id, "tenure", Number(e.target.value))} className="h-7 text-sm border-0 bg-transparent p-0 text-right focus-visible:ring-0 focus-visible:bg-muted rounded px-1" />
              </TableCell>
              <TableCell className="text-right">
                <Input type="number" value={c.roi} onChange={(e) => handleChange(c.id, "roi", Number(e.target.value))} className="h-7 text-sm border-0 bg-transparent p-0 text-right focus-visible:ring-0 focus-visible:bg-muted rounded px-1" />
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs bg-status-eligible-bg text-status-eligible-foreground border-0">
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreditorTable;
