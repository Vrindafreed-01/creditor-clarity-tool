import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ServiceabilityListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillSearch?: string;
}

const serviceabilityData = [
  { city: "HYDERABAD", state: "TS", aflCategory: "Metro", pflZone: "South", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "KOLKATA", state: "WB", aflCategory: "Metro", pflZone: "East", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "AHMEDABAD", state: "GJ", aflCategory: "Metro", pflZone: "West", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "BANGALORE", state: "KA", aflCategory: "Metro", pflZone: "South", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "MUMBAI", state: "MH", aflCategory: "Metro", pflZone: "West", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "DELHI NCR", state: "DL", aflCategory: "Metro", pflZone: "North 1", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "PUNE", state: "MH", aflCategory: "Metro", pflZone: "West", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "CHENNAI", state: "TN", aflCategory: "Metro", pflZone: "South", abclCategory: "A", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "INDORE", state: "MP", aflCategory: "Urban", pflZone: "North 1", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "SURAT", state: "GJ", aflCategory: "Urban", pflZone: "West", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "VADODARA", state: "GJ", aflCategory: "Urban", pflZone: "West", abclCategory: "B", tataLocation: "No", piramalLocation: "No" },
  { city: "CHANDIGARH", state: "CH", aflCategory: "Urban", pflZone: "North 1", abclCategory: "B", tataLocation: "No", piramalLocation: "No" },
  { city: "JAIPUR", state: "RJ", aflCategory: "Urban", pflZone: "North 1", abclCategory: "B", tataLocation: "Yes", piramalLocation: "Yes" },
  { city: "NASHIK", state: "MH", aflCategory: "Urban", pflZone: "West", abclCategory: "B", tataLocation: "No", piramalLocation: "No" },
  { city: "NAGPUR", state: "MH", aflCategory: "Urban", pflZone: "West", abclCategory: "B", tataLocation: "No", piramalLocation: "No" },
  { city: "COIMBATORE", state: "TN", aflCategory: "Urban", pflZone: "South", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "LUCKNOW", state: "UP", aflCategory: "Urban", pflZone: "North 1", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "VIJAYAWADA", state: "AP", aflCategory: "Semi Urban", pflZone: "South", abclCategory: "C", tataLocation: "Yes", piramalLocation: "No" },
  { city: "GUNTUR", state: "AP", aflCategory: "Semi Urban", pflZone: "South", abclCategory: "C", tataLocation: "Yes", piramalLocation: "No" },
  { city: "VISAKHAPATNAM", state: "AP", aflCategory: "Semi Urban", pflZone: "South", abclCategory: "C", tataLocation: "Yes", piramalLocation: "No" },
  { city: "RAIPUR", state: "CG", aflCategory: "Semi Urban", pflZone: "East", abclCategory: "C", tataLocation: "Yes", piramalLocation: "No" },
  { city: "BHUBANESWAR", state: "OD", aflCategory: "Semi Urban", pflZone: "East", abclCategory: "C", tataLocation: "No", piramalLocation: "No" },
  { city: "PATNA", state: "BR", aflCategory: "Semi Urban", pflZone: "East", abclCategory: "C", tataLocation: "No", piramalLocation: "No" },
  { city: "RAJKOT", state: "GJ", aflCategory: "Semi Urban", pflZone: "West", abclCategory: "C", tataLocation: "No", piramalLocation: "No" },
  { city: "BHOPAL", state: "MP", aflCategory: "Semi Urban", pflZone: "North 1", abclCategory: "C", tataLocation: "Yes", piramalLocation: "No" },
  { city: "COCHIN", state: "KL", aflCategory: "Urban", pflZone: "South", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "TRIVANDRUM", state: "KL", aflCategory: "Urban", pflZone: "South", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "MYSORE", state: "KA", aflCategory: "Urban", pflZone: "South", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "MANGALORE", state: "KA", aflCategory: "Urban", pflZone: "South", abclCategory: "B", tataLocation: "Yes", piramalLocation: "No" },
  { city: "VARANASI", state: "UP", aflCategory: "Semi Urban", pflZone: "North 1", abclCategory: "C", tataLocation: "Yes", piramalLocation: "No" },
];

const getCategoryColor = (cat: string) => {
  if (cat === "Metro") return "default";
  if (cat === "Urban") return "secondary";
  if (cat === "Semi Urban") return "outline";
  return "secondary";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">Serviceability Locations</DialogTitle>
        </DialogHeader>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search city or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="overflow-auto flex-1 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">City</TableHead>
                <TableHead className="text-xs font-semibold">State</TableHead>
                <TableHead className="text-xs font-semibold text-center">AFL Category</TableHead>
                <TableHead className="text-xs font-semibold text-center">PFL Zone</TableHead>
                <TableHead className="text-xs font-semibold text-center">ABCL</TableHead>
                <TableHead className="text-xs font-semibold text-center">TATA</TableHead>
                <TableHead className="text-xs font-semibold text-center">Piramal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                    No locations found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((loc, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium">{loc.city}</TableCell>
                    <TableCell className="text-xs">{loc.state}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getCategoryColor(loc.aflCategory)} className="text-[10px]">
                        {loc.aflCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs">{loc.pflZone}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px]">{loc.abclCategory}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={loc.tataLocation === "Yes" ? "default" : "secondary"} className="text-[10px]">
                        {loc.tataLocation}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={loc.piramalLocation === "Yes" ? "default" : "secondary"} className="text-[10px]">
                        {loc.piramalLocation}
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

export default ServiceabilityListModal;
