import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Search, MoreVertical, ChevronDown, Check, Upload, X, Pencil } from "lucide-react";
import { toast } from "sonner";

export interface PortalColumn {
  key: string;
  label: string;
  minWidth?: string;
  sticky?: boolean;
  badge?: (val: string) => "default" | "secondary" | "outline" | "destructive";
}

interface PortalListViewProps {
  title: string;
  subtitle?: string;
  columns: PortalColumn[];
  data: Array<Record<string, string>>;
  onDataChange: (data: Array<Record<string, string>>) => void;
  onBack: () => void;
}

const PortalListView = ({
  title,
  subtitle,
  columns,
  data,
  onDataChange,
  onBack,
}: PortalListViewProps) => {
  const [search, setSearch]           = useState("");
  const [isEditing, setIsEditing]     = useState(false);
  const [uploadOpen, setUploadOpen]   = useState(false);
  const [editRows, setEditRows]       = useState<Array<Record<string, string>>>(data);
  const [selected, setSelected]       = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const rows = isEditing ? editRows : data;
    if (!search.trim()) return rows.map((r, i) => ({ ...r, _idx: String(i) }));
    const q = search.toLowerCase();
    return rows
      .map((r, i) => ({ ...r, _idx: String(i) }))
      .filter((r) =>
        Object.entries(r).some(([k, v]) => k !== "_idx" && v.toLowerCase().includes(q))
      );
  }, [search, isEditing, editRows, data]);

  const handleEditCell = (rowIdx: number, key: string, value: string) => {
    setEditRows((prev) => prev.map((r, i) => (i === rowIdx ? { ...r, [key]: value } : r)));
  };

  const handleSave = () => {
    onDataChange(editRows);
    setIsEditing(false);
    toast.success("Changes saved successfully");
  };

  const handleDiscard = () => {
    setEditRows(data);
    setIsEditing(false);
    selected.clear();
    setSelected(new Set());
  };

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((_, i) => i)));
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Portal
          </button>
          <span className="text-muted-foreground">/</span>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handleDiscard}>
                <X className="h-3 w-3" /> Discard
              </Button>
              <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleSave}>
                <Check className="h-3 w-3" /> Save Changes
              </Button>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    Actions <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    className="gap-2 text-sm cursor-pointer"
                    onClick={() => { setEditRows(data); setIsEditing(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit Data
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 text-sm cursor-pointer"
                    onClick={() => setUploadOpen(true)}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload Sheet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs w-48"
                />
              </div>
              <button className="text-muted-foreground hover:text-foreground p-1">
                <MoreVertical className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Edit mode banner ── */}
      {isEditing && (
        <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-center gap-2 shrink-0">
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit mode — click any cell to edit. Press <strong>Save Changes</strong> when done.</span>
        </div>
      )}

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 px-4 py-3 bg-muted/20">
                <Checkbox
                  checked={selected.size > 0 && selected.size === filtered.length}
                  onCheckedChange={toggleAll}
                  className="h-4 w-4"
                />
              </TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold bg-muted/20 whitespace-nowrap ${col.sticky ? "sticky left-10 z-10" : ""}`}
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-12 text-sm text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, displayIdx) => {
                const realIdx = Number(row._idx);
                const isSelected = selected.has(displayIdx);
                return (
                  <TableRow
                    key={realIdx}
                    className={`${isSelected ? "bg-primary/5" : "hover:bg-muted/10"} transition-colors`}
                  >
                    <TableCell className="px-4 py-2.5 w-10">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(displayIdx)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    {columns.map((col) => {
                      const val = row[col.key] || "—";
                      return (
                        <TableCell
                          key={col.key}
                          className={`px-4 py-2.5 ${col.sticky ? "sticky left-10 bg-background z-10" : ""}`}
                        >
                          {isEditing ? (
                            <Input
                              value={row[col.key] || ""}
                              onChange={(e) => handleEditCell(realIdx, col.key, e.target.value)}
                              className="h-7 text-xs min-w-[80px]"
                            />
                          ) : col.badge ? (
                            <Badge variant={col.badge(val)} className="text-[10px]">{val}</Badge>
                          ) : (
                            <span className={`text-xs ${col.sticky ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                              {val}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Row count footer ── */}
      <div className="px-6 py-2.5 border-t text-xs text-muted-foreground flex items-center justify-between bg-card shrink-0">
        <span>
          {selected.size > 0 ? `${selected.size} selected · ` : ""}
          {filtered.length} of {data.length} records
        </span>
        {isEditing && (
          <span className="text-amber-700">{editRows.length} total rows editable</span>
        )}
      </div>

      {/* ── Upload Sheet Dialog ── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Sheet — {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports .xlsx, .xls, .csv files</p>
              <Input type="file" accept=".xlsx,.xls,.csv" className="h-9 text-sm" />
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-medium mb-1.5">Expected columns:</p>
              <div className="flex flex-wrap gap-1">
                {columns.map((col) => (
                  <span key={col.key} className="text-[10px] bg-background border rounded px-1.5 py-0.5 font-mono">
                    {col.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Import mode</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="radio" name="importMode" defaultChecked /> Replace all data
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="radio" name="importMode" /> Append rows
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => { setUploadOpen(false); toast.success(`${title} data updated from sheet`); }}>
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortalListView;
