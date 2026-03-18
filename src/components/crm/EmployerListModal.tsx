import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EmployerListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillSearch?: string;
}

export const employerData = [
  { name: "AARTI DRUGS LIMITED", afl: "CAT C", pfl: "NOT LISTED", abcl: "", tata: "Category C", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "ACER INDIA PRIVATE LIMITED", afl: "CAT C", pfl: "NOT LISTED", abcl: "", tata: "Category A", idfc: "CAT C", lnt: "CAT C", icici: "Open Market" },
  { name: "ADANI GAS LIMITED", afl: "CAT B", pfl: "CAT C", abcl: "", tata: "Category B", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "ADANI INFRA (INDIA) LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category C", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "ADOBE SYSTEMS INDIA PRIVATE LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "AGILENT TECHNOLOGIES INDIA PVT LTD", afl: "CAT C", pfl: "NOT LISTED", abcl: "", tata: "Category B", idfc: "CAT C", lnt: "CAT C", icici: "Open Market" },
  { name: "AHLUWALIA CONTRACTS (INDIA) LIMITED", afl: "CAT AA", pfl: "CAT B", abcl: "", tata: "Category B", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "AJANTA PHARMA LIMITED", afl: "CAT C", pfl: "NOT LISTED", abcl: "", tata: "Category A", idfc: "CAT C", lnt: "CAT C", icici: "Open Market" },
  { name: "ALEMBIC PHARMACEUTICALS", afl: "CAT C", pfl: "NOT LISTED", abcl: "", tata: "Category A", idfc: "CAT C", lnt: "CAT C", icici: "Open Market" },
  { name: "BAJAJ ALLIANZ LIFE INSURANCE COMPANY LIMITED", afl: "CAT B", pfl: "CAT A", abcl: "", tata: "Category A", idfc: "CAT A", lnt: "CAT B", icici: "Preferred" },
  { name: "HDFC BANK LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "INFOSYS LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "TATA CONSULTANCY SERVICES LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "WIPRO LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "RELIANCE INDUSTRIES LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "STATE BANK OF INDIA", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Government Sector", idfc: "CAT SA", lnt: "CAT B", icici: "Government" },
  { name: "ICICI BANK LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "LARSEN & TOUBRO LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "HCL TECHNOLOGIES LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "TECH MAHINDRA LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "KOTAK MAHINDRA BANK LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "MAHINDRA & MAHINDRA LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT A", lnt: "CAT B", icici: "Preferred" },
  { name: "AXIS BANK LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "BHARTI AIRTEL LIMITED", afl: "CAT AA", pfl: "CAT A", abcl: "A", tata: "Category A", idfc: "CAT SA", lnt: "CAT B", icici: "Superprime" },
  { name: "ACCURATE POWERTECH INDIA PRIVATE LIMITED", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "Category C", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "ACCURACY SHIPPING LIMITED", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "Category A", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "A&I HOSPITALITY PRIVATE LIMITED", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "Delist", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "A B HOTELS LIMITED", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "Category C", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "A & A EARTH MOVERS PRIVATE LIMITED", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "Category B", idfc: "CAT C", lnt: "CAT D", icici: "Open Market" },
  { name: "CHINA STATE CONSTRUCTION ENGINEERING HONG KONG LTD", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "", idfc: "CAT SA", lnt: "", icici: "" },
  { name: "THE BANK OF NEW YORK MELLON", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "", idfc: "CAT SA", lnt: "", icici: "" },
  { name: "TBWA INDIA PRIVATE LIMITED", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "", idfc: "CAT C", lnt: "", icici: "" },
  { name: "ST COLUMBUS SCHOOL", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "Category C", idfc: "", lnt: "", icici: "" },
  { name: "HUBBALLI-DHARWADBUS RAPID TRANSIT SYSTEM (HDBRTS)", afl: "NOT LISTED", pfl: "NOT LISTED", abcl: "", tata: "Government Sector", idfc: "", lnt: "", icici: "Government" },
];

const getCategoryBadgeColor = (category: string): "default" | "secondary" | "outline" | "destructive" => {
  if (!category || category === "NOT LISTED" || category === "—") return "secondary";
  if (category.includes("AA") || category === "CAT A" || category === "A" || category === "CAT SA" || category === "Superprime" || category === "Category A") return "default";
  if (category.includes("B") || category === "Preferred" || category === "Category B") return "outline";
  if (category === "Delist") return "destructive";
  return "secondary";
};

const EmployerListModal = ({ open, onOpenChange, prefillSearch = "" }: EmployerListModalProps) => {
  const [search, setSearch] = useState(prefillSearch);

  const filtered = useMemo(() => {
    if (!search.trim()) return employerData;
    return employerData.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const lenderColumns = [
    { key: "afl", label: "AFL" },
    { key: "pfl", label: "PFL" },
    { key: "abcl", label: "ABCL" },
    { key: "tata", label: "TATA" },
    { key: "idfc", label: "IDFC" },
    { key: "icici", label: "ICICI" },
    { key: "lnt", label: "L&T" },
  ] as const;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[680px] sm:max-w-[680px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <SheetTitle className="text-base">Employer Category List</SheetTitle>
        </SheetHeader>
        <div className="px-5 pt-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 mb-3">{filtered.length} results</p>
        </div>
        <div className="overflow-auto flex-1 border-t">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold sticky left-0 bg-background z-10 min-w-[200px]">Company Name</TableHead>
                {lenderColumns.map(col => (
                  <TableHead key={col.key} className="text-xs font-semibold text-center min-w-[80px]">{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                    No employers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((emp, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium sticky left-0 bg-background z-10">{emp.name}</TableCell>
                    {lenderColumns.map(col => {
                      const val = emp[col.key] || "—";
                      return (
                        <TableCell key={col.key} className="text-center">
                          <Badge variant={getCategoryBadgeColor(val)} className="text-[10px]">
                            {val}
                          </Badge>
                        </TableCell>
                      );
                    })}
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

export default EmployerListModal;
