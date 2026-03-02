import { Button } from "@/components/ui/button";
import { FileText, BarChart3, CreditCard } from "lucide-react";

const cards = [
  {
    title: "Generate Agreement",
    description: "Create loan agreement document for the client",
    icon: FileText,
    action: "Generate",
  },
  {
    title: "Bank Statement Analysis",
    description: "Analyze uploaded bank statements for income patterns",
    icon: BarChart3,
    action: "Analyze",
  },
  {
    title: "Credit Card Analysis",
    description: "Review credit card usage and payment behavior",
    icon: CreditCard,
    action: "Analyze",
  },
];

const AgreementAnalysis = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-card rounded-lg border p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">{card.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-4 flex-1">{card.description}</p>
          <Button size="sm" className="w-full text-xs">
            {card.action}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AgreementAnalysis;
