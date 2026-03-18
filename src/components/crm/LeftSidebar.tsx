import { Contact, CreditCard, Wifi, CheckCircle, Ticket, ClipboardCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: Contact, label: "Profile", id: "profile" },
  { icon: CreditCard, label: "Creditor", id: "creditor" },
  { icon: Wifi, label: "Connectivity", id: "connectivity" },
  { icon: CheckCircle, label: "Tasks", id: "tasks" },
  { icon: Ticket, label: "Tickets", id: "tickets" },
];

interface LeftSidebarProps {
  pendingScrubCount?: number;
  onTLTasksClick?: () => void;
}

const LeftSidebar = ({ pendingScrubCount = 0, onTLTasksClick }: LeftSidebarProps) => {
  return (
    <aside className="sticky top-0 h-screen w-14 bg-card border-r flex flex-col items-center py-4 gap-1 z-40 shrink-0">
      {/* Logo area */}
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-primary font-bold text-sm">K</span>
      </div>

      {/* Nav icons */}
      {navItems.map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <item.icon className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Divider */}
      <div className="w-6 h-px bg-border my-2" />

      {/* TL Tasks — Scrub Approvals */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onTLTasksClick}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <ClipboardCheck className="h-5 w-5" />
            {pendingScrubCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 leading-none">
                {pendingScrubCount > 9 ? "9+" : pendingScrubCount}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          TL Tasks — Scrub Approvals
          {pendingScrubCount > 0 && (
            <span className="ml-1 text-red-400">({pendingScrubCount} pending)</span>
          )}
        </TooltipContent>
      </Tooltip>
    </aside>
  );
};

export default LeftSidebar;
