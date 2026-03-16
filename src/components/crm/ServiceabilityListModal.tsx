import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ServiceabilityListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillSearch?: string;
}

export const serviceabilityData = [
  { city: "HYDERABAD", state: "TS", afl: "Metro", pfl: "South", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "KOLKATA", state: "WB", afl: "Metro", pfl: "East", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "AHMEDABAD", state: "GJ", afl: "Metro", pfl: "West", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "BANGALORE", state: "KA", afl: "Metro", pfl: "South", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "MUMBAI", state: "MH", afl: "Metro", pfl: "West", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "DELHI NCR", state: "DL", afl: "Metro", pfl: "North 1", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "PUNE", state: "MH", afl: "Metro", pfl: "West", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "CHENNAI", state: "TN", afl: "Metro", pfl: "South", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "INDORE", state: "MP", afl: "Urban", pfl: "North 1", abcl: "B", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "SURAT", state: "GJ", afl: "Urban", pfl: "West", abcl: "B", tata: "Yes", piramal: "No", idfc: "Yes", lnt: "No" },
  { city: "VADODARA", state: "GJ", afl: "Urban", pfl: "West", abcl: "B", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "CHANDIGARH", state: "CH", afl: "Urban", pfl: "North 1", abcl: "B", tata: "No", piramal: "No", idfc: "Yes", lnt: "No" },
  { city: "JAIPUR", state: "RJ", afl: "Urban", pfl: "North 1", abcl: "B", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "NASHIK", state: "MH", afl: "Urban", pfl: "West", abcl: "B", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "NAGPUR", state: "MH", afl: "Urban", pfl: "West", abcl: "B", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "COIMBATORE", state: "TN", afl: "Urban", pfl: "South", abcl: "B", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "LUCKNOW", state: "UP", afl: "Urban", pfl: "North 1", abcl: "B", tata: "Yes", piramal: "No", idfc: "Yes", lnt: "No" },
  { city: "VIJAYAWADA", state: "AP", afl: "Semi Urban", pfl: "South", abcl: "C", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "GUNTUR", state: "AP", afl: "Semi Urban", pfl: "South", abcl: "C", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "VISAKHAPATNAM", state: "AP", afl: "Semi Urban", pfl: "South", abcl: "C", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "RAIPUR", state: "CG", afl: "Semi Urban", pfl: "East", abcl: "C", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "BHUBANESWAR", state: "OD", afl: "Semi Urban", pfl: "East", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "PATNA", state: "BR", afl: "Semi Urban", pfl: "East", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "RAJKOT", state: "GJ", afl: "Semi Urban", pfl: "West", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "BHOPAL", state: "MP", afl: "Semi Urban", pfl: "North 1", abcl: "C", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "COCHIN", state: "KL", afl: "Urban", pfl: "South", abcl: "B", tata: "Yes", piramal: "No", idfc: "Yes", lnt: "No" },
  { city: "TRIVANDRUM", state: "KL", afl: "Urban", pfl: "South", abcl: "B", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "MYSORE", state: "KA", afl: "Urban", pfl: "South", abcl: "B", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "MANGALORE", state: "KA", afl: "Urban", pfl: "South", abcl: "B", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "VARANASI", state: "UP", afl: "Semi Urban", pfl: "North 1", abcl: "C", tata: "Yes", piramal: "No", idfc: "No", lnt: "No" },
  { city: "NOIDA", state: "UP", afl: "Metro", pfl: "North 1", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "GURGAON", state: "HR", afl: "Metro", pfl: "North 1", abcl: "A", tata: "Yes", piramal: "Yes", idfc: "Yes", lnt: "Yes" },
  { city: "GHAZIABAD", state: "UP", afl: "Metro", pfl: "North 1", abcl: "A", tata: "Yes", piramal: "No", idfc: "Yes", lnt: "No" },
  { city: "FARIDABAD", state: "HR", afl: "Urban", pfl: "North 1", abcl: "B", tata: "No", piramal: "No", idfc: "Yes", lnt: "No" },
  { city: "KARNAL", state: "HR", afl: "Semi Urban", pfl: "North 1", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "PANIPAT", state: "HR", afl: "Semi Urban", pfl: "North 1", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "AMBALA", state: "HR", afl: "Semi Urban", pfl: "North 1", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "ROHTAK", state: "HR", afl: "Semi Urban", pfl: "North 1", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "SONEPAT", state: "HR", afl: "Semi Urban", pfl: "North 1", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "BHAGALPUR", state: "BR", afl: "Semi Urban", pfl: "East", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "DARBHANGA", state: "BR", afl: "Semi Urban", pfl: "East", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "MUZAFFARPUR", state: "BR", afl: "Semi Urban", pfl: "East", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
  { city: "DURGAPUR", state: "WB", afl: "Semi Urban", pfl: "East", abcl: "C", tata: "No", piramal: "No", idfc: "No", lnt: "No" },
];

const getCategoryColor = (cat: string): "default" | "secondary" | "outline" => {
  if (cat === "Metro" || cat === "A" || cat === "Yes") return "default";
  if (cat === "Urban" || cat === "B") return "secondary";
  return "outline";
};

const ServiceabilityListModal = ({ open, onOpenChange, prefillSearch = "" }: ServiceabilityListModalProps) => {
  const [search, setSearch] = useState(prefillSearch);

  const filtered = useMemo(() => {
    if (!search.trim()) return serviceabilityData;
    const q = search.toLowerCase();
    return serviceabilityData.filter(s =>
      s.city.toLowerCase().includes(q) || s.state.toLowerCase().includes(q)
    );
  }, [search]);

  const lenderColumns = [
    { key: "afl", label: "AFL" },
    { key: "pfl", label: "PFL Zone" },
    { key: "abcl", label: "ABCL" },
    { key: "tata", label: "TATA" },
    { key: "piramal", label: "Piramal" },
    { key: "idfc", label: "IDFC" },
    { key: "lnt", label: "L&T" },
  ] as const;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[620px] sm:max-w-[620px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <SheetTitle className="text-base">Serviceability Locations</SheetTitle>
        </SheetHeader>
        <div className="px-5 pt-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search city or state..."
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
                <TableHead className="text-xs font-semibold sticky left-0 bg-background z-10 min-w-[120px]">City</TableHead>
                <TableHead className="text-xs font-semibold min-w-[60px]">State</TableHead>
                {lenderColumns.map(col => (
                  <TableHead key={col.key} className="text-xs font-semibold text-center min-w-[70px]">{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">
                    No locations found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((loc, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium sticky left-0 bg-background z-10">{loc.city}</TableCell>
                    <TableCell className="text-xs">{loc.state}</TableCell>
                    {lenderColumns.map(col => {
                      const val = loc[col.key];
                      return (
                        <TableCell key={col.key} className="text-center">
                          <Badge variant={getCategoryColor(val)} className="text-[10px]">
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

export default ServiceabilityListModal;
