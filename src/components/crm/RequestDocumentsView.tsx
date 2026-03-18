import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Send, ChevronLeft, Trash2, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, ChevronLeft as ChevLeft, ChevronRight as ChevRight } from "lucide-react";
import { toast } from "sonner";
import { SentDocItem, SentDocumentRequest } from "@/types/client";

const DOC_CATEGORIES = [
  { id: "salary_slip", label: "Salary Slip", requiresMonths: true },
  { id: "bank_statement", label: "Bank Statement", requiresMonths: true },
  { id: "form_16", label: "Form 16", requiresMonths: false },
  { id: "itr", label: "ITR", requiresMonths: false },
  { id: "pan", label: "PAN Card", requiresMonths: false },
  { id: "aadhaar", label: "Aadhaar Card", requiresMonths: false },
  { id: "salary_cert", label: "Salary Certificate", requiresMonths: true },
  { id: "offer_letter", label: "Offer Letter", requiresMonths: false },
  { id: "credit_report", label: "Credit Report", requiresMonths: false },
  { id: "loan_statement", label: "Loan Statement", requiresMonths: true },
  { id: "cc_statement", label: "Credit Card Statement", requiresMonths: true },
  { id: "others", label: "Others", requiresMonths: false },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MonthPicker = ({ selected, onToggle }: { selected: string[]; onToggle: (m: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="inline-flex items-center gap-1 h-7 rounded-md px-2 text-xs border bg-muted/40 hover:bg-muted/60 transition-colors">
          <CalendarDays className="h-3 w-3 text-muted-foreground" />
          {selected.length > 0 ? `${selected.length} month${selected.length > 1 ? "s" : ""} selected` : "Select months"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3 shadow-xl rounded-xl" align="start" sideOffset={4}>
        <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={() => setYear(y => y - 1)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-muted">
            <ChevLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold">{year}</span>
          <button type="button" onClick={() => setYear(y => y + 1)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-muted">
            <ChevRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {MONTHS.map(m => {
            const val = `${m} ${year}`;
            const isSel = selected.includes(val);
            return (
              <button key={m} type="button" onClick={() => onToggle(val)}
                className={`h-8 rounded-full text-xs font-medium transition-colors ${isSel ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}>
                {m}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface DocRequest {
  id: string;
  docTypeId: string;
  docLabel: string;
  months: string[];
  comment: string;
}

interface RequestDocumentsViewProps {
  onClose: () => void;
  /** Called with document request items when "Send Request" is clicked */
  onSend?: (items: SentDocItem[]) => void;
  /** Previously sent document requests, for history display */
  sentRequests?: SentDocumentRequest[];
}

const RequestDocumentsView = ({
  onClose,
  onSend,
  sentRequests = [],
}: RequestDocumentsViewProps) => {
  const [draftType, setDraftType] = useState("");
  const [draftMonths, setDraftMonths] = useState<string[]>([]);
  const [draftComment, setDraftComment] = useState("");
  const [requests, setRequests] = useState<DocRequest[]>([]);

  const selectedCat = DOC_CATEGORIES.find(c => c.id === draftType);

  const toggleMonth = (m: string) => setDraftMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const handleAddRequest = () => {
    if (!draftType) return;
    const cat = DOC_CATEGORIES.find(c => c.id === draftType);
    if (!cat) return;
    const req: DocRequest = {
      id: Date.now().toString(),
      docTypeId: draftType,
      docLabel: cat.label,
      months: [...draftMonths],
      comment: draftComment.trim(),
    };
    setRequests(prev => [...prev, req]);
    setDraftType("");
    setDraftMonths([]);
    setDraftComment("");
  };

  const removeRequest = (id: string) => setRequests(prev => prev.filter(r => r.id !== id));

  const handleSend = () => {
    if (requests.length === 0) return;
    const items: SentDocItem[] = requests.map(r => ({
      docTypeId: r.docTypeId,
      docLabel: r.docLabel,
      months: r.months,
      comment: r.comment,
    }));
    onSend?.(items);
    toast.success(`${requests.length} document request(s) sent to client`);
    onClose();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-card">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-base font-semibold text-foreground">Request Documents</h2>
          <p className="text-xs text-muted-foreground">Select document types and months to request from the client</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* Add new document request form */}
        <div className="border rounded-xl p-4 bg-card space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Add Document Request</p>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Document Type</label>
            <Select value={draftType} onValueChange={(v) => { setDraftType(v); setDraftMonths([]); }}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select document type..." />
              </SelectTrigger>
              <SelectContent>
                {DOC_CATEGORIES.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCat?.requiresMonths && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Select Month(s)</label>
              <div className="flex items-center gap-2 flex-wrap">
                <MonthPicker selected={draftMonths} onToggle={toggleMonth} />
                {draftMonths.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {draftMonths.map(m => (
                      <Badge key={m} variant="secondary" className="text-[10px] gap-1 pl-2 pr-1">
                        {m}
                        <button type="button" onClick={() => toggleMonth(m)}>
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {draftType && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Comment <span className="text-muted-foreground font-normal">(optional, shown in brackets)</span></label>
              <Input
                value={draftComment}
                onChange={(e) => setDraftComment(e.target.value)}
                placeholder={`e.g. For HDFC account ending 2379`}
                className="h-8 text-sm"
              />
            </div>
          )}

          <Button
            size="sm"
            onClick={handleAddRequest}
            disabled={!draftType || (selectedCat?.requiresMonths === true && draftMonths.length === 0)}
            className="gap-1.5 text-xs h-8 w-full"
          >
            <Plus className="h-3.5 w-3.5" /> Add to Request List
          </Button>
        </div>

        {/* Pending request list */}
        {requests.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Pending Requests ({requests.length})
            </p>
            {requests.map((req) => (
              <div key={req.id} className="flex items-start gap-3 border rounded-lg px-3 py-2.5 bg-card">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-none mb-1">{req.docLabel}</p>
                  <div className="flex flex-wrap items-center gap-1">
                    {req.months.map(m => (
                      <Badge key={m} variant="outline" className="text-[10px] px-1.5 py-0">{m}</Badge>
                    ))}
                    {req.comment && (
                      <span className="text-xs text-muted-foreground italic">({req.comment})</span>
                    )}
                  </div>
                </div>
                <button onClick={() => removeRequest(req.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {requests.length === 0 && sentRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No document requests added yet.</p>
            <p className="text-xs mt-1 text-muted-foreground/60">Use the form above to add requests.</p>
          </div>
        )}

        {/* Sent request history */}
        {sentRequests.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Sent Requests ({sentRequests.length})
            </p>
            {sentRequests.map((req, idx) => (
              <div key={req.id} className="border rounded-xl p-4 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Request #{idx + 1}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(req.sentAt)}
                  </span>
                </div>
                <div className="space-y-2">
                  {req.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-foreground font-medium">{item.docLabel}</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.months.map(m => (
                            <Badge key={m} variant="outline" className="text-[10px] px-1.5 py-0">{m}</Badge>
                          ))}
                          {item.comment && (
                            <span className="text-[10px] text-muted-foreground italic">({item.comment})</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 shrink-0 ml-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-medium">Pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-card">
        <p className="text-xs text-muted-foreground">{requests.length} request(s) ready to send</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" disabled={requests.length === 0} onClick={handleSend} className="gap-1.5">
            <Send className="h-3.5 w-3.5" /> Send Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestDocumentsView;
