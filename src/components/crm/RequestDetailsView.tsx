import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, ChevronDown, Check, MessageSquare, Clock, CheckCircle2, ChevronLeft, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { SentDetailItem, SentDetailRequest } from "@/types/client";

const requestableDetails = [
  { id: "pan", label: "PAN Card Number" },
  { id: "aadhaar", label: "Aadhaar Card Number" },
  { id: "dob", label: "Date of Birth" },
  { id: "father", label: "Father's Name" },
  { id: "mother", label: "Mother's Name" },
  { id: "marital", label: "Marital Status" },
  { id: "address_current", label: "Current Residential Address" },
  { id: "address_permanent", label: "Permanent Address" },
  { id: "employer", label: "Employer Name & Address" },
  { id: "designation", label: "Current Designation" },
  { id: "work_exp", label: "Total Work Experience" },
  { id: "salary", label: "Net In-Hand Salary" },
  { id: "bank_acc", label: "Bank Account Details" },
  { id: "ifsc", label: "Bank IFSC Code" },
  { id: "ref1", label: "Reference Person 1 Details" },
  { id: "ref2", label: "Reference Person 2 Details" },
  { id: "existing_loans", label: "Existing Loan / EMI Details" },
  { id: "credit_card", label: "Credit Card Outstanding" },
];

interface RequestDetailsViewProps {
  onClose: () => void;
  emptyDetailIds?: string[];
  onSend?: (items: SentDetailItem[]) => void;
  sentRequests?: SentDetailRequest[];
  isDetailFilled?: (id: string) => boolean;
}

const RequestDetailsView = ({
  onClose,
  emptyDetailIds = [],
  onSend,
  sentRequests = [],
  isDetailFilled,
}: RequestDetailsViewProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  // Show form only when no requests sent yet, or when user explicitly wants to add more
  const [showForm, setShowForm] = useState(sentRequests.length === 0);

  useEffect(() => {
    if (emptyDetailIds.length > 0 && selected.length === 0) {
      setSelected(emptyDetailIds);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const removeItem = (id: string) => {
    setSelected((prev) => prev.filter((i) => i !== id));
    setComments((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const toggleAll = () => {
    if (selected.length === requestableDetails.length) { setSelected([]); setComments({}); }
    else setSelected(requestableDetails.map((d) => d.id));
  };

  const setComment = (id: string, value: string) =>
    setComments((prev) => ({ ...prev, [id]: value }));

  const handleSend = () => {
    if (selected.length === 0) return;
    const items: SentDetailItem[] = selected.map((id) => ({
      id,
      label: requestableDetails.find((d) => d.id === id)?.label ?? id,
      comment: comments[id] || undefined,
    }));
    onSend?.(items);
    toast.success(`Details request sent for ${items.length} field(s)`);
    onClose();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-card">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-foreground">Request Details</h2>
          <p className="text-xs text-muted-foreground">
            {sentRequests.length > 0
              ? `${sentRequests.length} request(s) sent`
              : "Empty fields are pre-selected. Adjust as needed before sending."}
          </p>
        </div>
        {sentRequests.length > 0 && !showForm && (
          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 shrink-0" onClick={() => setShowForm(true)}>
            <Plus className="h-3.5 w-3.5" /> New Request
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* ── New request form — only shown when no prior requests, or user clicked "New Request" ── */}
        {showForm && (
          <div className="space-y-4">
            {sentRequests.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Request</p>
                <button onClick={() => setShowForm(false)} className="text-xs text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
              </div>
            )}

            {/* Dropdown */}
            <div className="flex justify-center">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-between w-full max-w-[480px] border rounded-md px-4 py-2.5 text-sm text-left bg-background hover:bg-muted/30 transition-colors">
                    <span className={selected.length === 0 ? "text-muted-foreground" : "text-foreground"}>
                      {selected.length === 0
                        ? "Select Details to Request"
                        : `${selected.length} detail${selected.length > 1 ? "s" : ""} selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[480px] p-0" align="center">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="text-xs text-muted-foreground">
                      {selected.length} of {requestableDetails.length} selected
                    </span>
                    <button onClick={toggleAll} className="text-xs text-primary hover:underline">
                      {selected.length === requestableDetails.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {requestableDetails.map((item) => {
                      const isSelected = selected.includes(item.id);
                      const isEmpty = emptyDetailIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggle(item.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground">{item.label}</span>
                            {isEmpty && (
                              <span className="text-[9px] px-1.5 py-0 rounded border text-amber-600 border-amber-300 bg-amber-50">
                                Empty
                              </span>
                            )}
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Selected items */}
            {selected.length > 0 && (
              <div className="space-y-3">
                {selected.map((id) => {
                  const item = requestableDetails.find((d) => d.id === id);
                  return (
                    <div key={id} className="border rounded-lg p-3 bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item?.label}</span>
                        <button onClick={() => removeItem(id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="relative">
                        <MessageSquare className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                        <Textarea
                          placeholder="Add a specific instruction or comment... (optional)"
                          value={comments[id] ?? ""}
                          onChange={(e) => setComment(id, e.target.value)}
                          className="text-xs resize-none min-h-[60px] pl-8 bg-background"
                          rows={2}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Sent request history ── */}
        {sentRequests.length > 0 && (
          <div className="space-y-3">
            {!showForm && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Requested Details
              </p>
            )}
            {sentRequests.map((req, idx) => (
              <div key={req.id} className="border rounded-xl bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
                  <span className="text-xs font-semibold text-foreground">
                    Request #{idx + 1}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(req.sentAt)}</span>
                </div>
                <div className="divide-y">
                  {req.items.map((item) => {
                    const filled = isDetailFilled?.(item.id) ?? false;
                    return (
                      <div key={item.id} className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground">{item.label}</span>
                          {item.comment && (
                            <p className="text-[10px] text-muted-foreground italic mt-0.5">({item.comment})</p>
                          )}
                        </div>
                        {filled ? (
                          <div className="flex items-center gap-1 text-green-600 shrink-0 ml-3">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold">Received</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600 shrink-0 ml-3">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold">Pending</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {sentRequests.length === 0 && selected.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No details selected.</p>
            <p className="text-xs mt-1 text-muted-foreground/60">Use the dropdown above to select details to request.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {showForm && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-card">
          <p className="text-xs text-muted-foreground">{selected.length} detail(s) selected</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" disabled={selected.length === 0} onClick={handleSend}>
              Send Request ({selected.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetailsView;
