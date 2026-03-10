import { Contact, CreditCard, Wifi, CheckCircle, Ticket } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: Contact, label: "Profile", id: "profile" },
  { icon: CreditCard, label: "Creditor", id: "creditor" },
  { icon: Wifi, label: "Connectivity", id: "connectivity" },
  { icon: CheckCircle, label: "Tasks", id: "tasks" },
  { icon: Ticket, label: "Tickets", id: "tickets" },
];

const LeftSidebar = () => {
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
    </aside>
  );
};

export default LeftSidebar;
