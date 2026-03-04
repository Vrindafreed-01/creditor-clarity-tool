import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EmployerListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillSearch?: string;
}

const employerData = [
  { name: "AARTI DRUGS LIMITED", aflCategory: "CAT C", pflCategory: "NOT LISTED", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "ACER INDIA PRIVATE LIMITED", aflCategory: "CAT C", pflCategory: "NOT LISTED", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "ADANI GAS LIMITED", aflCategory: "CAT B", pflCategory: "CAT C", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "ADANI INFRA (INDIA) LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "ADOBE SYSTEMS INDIA PRIVATE LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "AGILENT TECHNOLOGIES INDIA PVT LTD", aflCategory: "CAT C", pflCategory: "NOT LISTED", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "AHLUWALIA CONTRACTS (INDIA) LIMITED", aflCategory: "CAT AA", pflCategory: "CAT B", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "AJANTA PHARMA LIMITED", aflCategory: "CAT C", pflCategory: "NOT LISTED", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "ALEMBIC PHARMACEUTICALS", aflCategory: "CAT C", pflCategory: "NOT LISTED", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "ALLIANCE CAPITAL ASSET MANAGEMENT INDIA PRIVATE LIMITED", aflCategory: "NOT LISTED", pflCategory: "NOT LISTED", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "BAJAJ ALLIANZ LIFE INSURANCE COMPANY LIMITED", aflCategory: "CAT B", pflCategory: "CAT A", abclCategory: "", tataCategory: "", cholaCategory: "" },
  { name: "HDFC BANK LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "INFOSYS LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "TATA CONSULTANCY SERVICES LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "WIPRO LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "RELIANCE INDUSTRIES LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "STATE BANK OF INDIA", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "ICICI BANK LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "LARSEN & TOUBRO LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "HCL TECHNOLOGIES LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "TECH MAHINDRA LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "KOTAK MAHINDRA BANK LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "MAHINDRA & MAHINDRA LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "AXIS BANK LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
  { name: "BHARTI AIRTEL LIMITED", aflCategory: "CAT AA", pflCategory: "CAT A", abclCategory: "A", tataCategory: "", cholaCategory: "" },
];

const getCategoryBadgeColor = (category: string) => {
  if (!category || category === "NOT LISTED") return "secondary";
  if (category.includes("AA") || category === "CAT A" || category === "A") return "default";
  if (category.includes("B")) return "outline";
  return "secondary";
};

const EmployerListModal = ({ open, onOpenChange, prefillSearch = "" }: EmployerListModalProps) => {
  const [search, setSearch] = useState(prefillSearch);

  const filtered = useMemo(() => {
    if (!search.trim()) return employerData;
    return employerData.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">Employer Category List</DialogTitle>
        </DialogHeader>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="overflow-auto flex-1 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Company Name</TableHead>
                <TableHead className="text-xs font-semibold text-center">AFL</TableHead>
                <TableHead className="text-xs font-semibold text-center">PFL</TableHead>
                <TableHead className="text-xs font-semibold text-center">ABCL</TableHead>
                <TableHead className="text-xs font-semibold text-center">TATA</TableHead>
                <TableHead className="text-xs font-semibold text-center">CHOLA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                    No employers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((emp, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium">{emp.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCategoryBadgeColor(emp.aflCategory)} className="text-[10px]">
                        {emp.aflCategory || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCategoryBadgeColor(emp.pflCategory)} className="text-[10px]">
                        {emp.pflCategory || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCategoryBadgeColor(emp.abclCategory)} className="text-[10px]">
                        {emp.abclCategory || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCategoryBadgeColor(emp.tataCategory)} className="text-[10px]">
                        {emp.tataCategory || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCategoryBadgeColor(emp.cholaCategory)} className="text-[10px]">
                        {emp.cholaCategory || "—"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{filtered.length} results</p>
      </DialogContent>
    </Dialog>
  );
};

export default EmployerListModal;
