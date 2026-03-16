import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Building2,
  MapPin,
  BookOpen,
  ArrowLeft,
  TrendingUp,
  CreditCard,
  FileText,
  BarChart3,
  Users,
  ClipboardList,
  Banknote,
  ChevronRight,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";
import PortalListView, { PortalColumn } from "./PortalListView";
import { employerData } from "./EmployerListModal";
import { serviceabilityData } from "./ServiceabilityListModal";
import { lenderPolicyData } from "./LenderPolicyModal";

// ── Badge helpers ──────────────────────────────────────────────────────────────

const getEmployerBadge = (val: string): "default" | "secondary" | "outline" | "destructive" => {
  if (!val || val === "NOT LISTED" || val === "—") return "secondary";
  if (
    val.includes("AA") || val === "CAT A" || val === "A" ||
    val === "CAT SA" || val === "Superprime" || val === "Category A"
  ) return "default";
  if (val.includes("B") || val === "Preferred" || val === "Category B") return "outline";
  if (val === "Delist") return "destructive";
  return "secondary";
};

const getServiceBadge = (val: string): "default" | "secondary" | "outline" | "destructive" => {
  if (val === "Metro" || val === "A" || val === "Yes") return "default";
  if (val === "Urban" || val === "B") return "secondary";
  return "outline";
};

const getLenderRoiBadge = (val: string): "default" | "secondary" | "outline" | "destructive" => {
  const pct = parseFloat(val.replace("%", ""));
  if (pct < 13) return "default";
  if (pct < 18) return "secondary";
  return "outline";
};

// ── Column definitions ─────────────────────────────────────────────────────────

const EMPLOYER_COLUMNS: PortalColumn[] = [
  { key: "name",  label: "Company Name", sticky: true, minWidth: "200px" },
  { key: "afl",   label: "AFL",   badge: getEmployerBadge },
  { key: "pfl",   label: "PFL",   badge: getEmployerBadge },
  { key: "abcl",  label: "ABCL",  badge: getEmployerBadge },
  { key: "tata",  label: "TATA",  badge: getEmployerBadge },
  { key: "idfc",  label: "IDFC",  badge: getEmployerBadge },
  { key: "lnt",   label: "L&T",   badge: getEmployerBadge },
  { key: "icici", label: "ICICI", badge: getEmployerBadge },
];

const SERVICEABILITY_COLUMNS: PortalColumn[] = [
  { key: "city",    label: "City",     sticky: true, minWidth: "120px" },
  { key: "state",   label: "State",    minWidth: "60px" },
  { key: "afl",     label: "AFL",      badge: getServiceBadge },
  { key: "pfl",     label: "PFL Zone", badge: getServiceBadge },
  { key: "abcl",    label: "ABCL",     badge: getServiceBadge },
  { key: "tata",    label: "TATA",     badge: getServiceBadge },
  { key: "piramal", label: "Piramal",  badge: getServiceBadge },
  { key: "idfc",    label: "IDFC",     badge: getServiceBadge },
  { key: "lnt",     label: "L&T",      badge: getServiceBadge },
];

const LENDER_COLUMNS: PortalColumn[] = [
  { key: "lender",  label: "Lender",     sticky: true, minWidth: "180px" },
  { key: "minAmt",  label: "Min Amount", minWidth: "100px" },
  { key: "maxAmt",  label: "Max Amount", minWidth: "100px" },
  { key: "tenure",  label: "Tenure",     minWidth: "110px" },
  { key: "minROI",  label: "Min ROI",    minWidth: "80px", badge: getLenderRoiBadge },
  { key: "maxROI",  label: "Max ROI",    minWidth: "80px" },
  { key: "cibil",   label: "CIBIL",      minWidth: "80px" },
  { key: "notes",   label: "Notes",      minWidth: "180px" },
];

// ── Initial data conversions ───────────────────────────────────────────────────

const initialEmployerRows: Array<Record<string, string>> = employerData.map((e) => ({
  name:  e.name,
  afl:   e.afl   || "—",
  pfl:   e.pfl   || "—",
  abcl:  e.abcl  || "—",
  tata:  e.tata  || "—",
  idfc:  e.idfc  || "—",
  lnt:   e.lnt   || "—",
  icici: e.icici || "—",
}));

const initialServiceabilityRows: Array<Record<string, string>> = serviceabilityData.map((s) => ({
  city:    s.city,
  state:   s.state,
  afl:     s.afl     || "—",
  pfl:     s.pfl     || "—",
  abcl:    s.abcl    || "—",
  tata:    s.tata    || "—",
  piramal: s.piramal || "—",
  idfc:    s.idfc    || "—",
  lnt:     s.lnt     || "—",
}));

const initialLenderRows: Array<Record<string, string>> = lenderPolicyData.map((l) => ({
  lender:  l.lender,
  minAmt:  `₹${l.minAmt}`,
  maxAmt:  `₹${l.maxAmt}`,
  tenure:  l.tenure,
  minROI:  l.minROI,
  maxROI:  l.maxROI,
  cibil:   l.cibil,
  notes:   l.notes,
}));

// ── Portal card ────────────────────────────────────────────────────────────────

interface PortalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
  clickable?: boolean;
  onClick?: () => void;
}

const PortalCard = ({
  icon,
  title,
  description,
  count,
  clickable = false,
  onClick,
}: PortalCardProps) => (
  <div
    onClick={clickable ? onClick : undefined}
    className={`flex items-start gap-3 p-3 rounded-lg border bg-card transition-all duration-150 ${
      clickable
        ? "cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm"
        : "opacity-50 cursor-default"
    }`}
  >
    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 text-primary">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {count !== undefined && (
          <Badge variant="secondary" className="text-[9px] px-1 h-4">
            {count}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    {clickable && (
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
    )}
  </div>
);

// ── Portal section header ──────────────────────────────────────────────────────

const PortalSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">
      {title}
    </p>
    <div className="space-y-2">{children}</div>
  </div>
);

// ── PortalPage ─────────────────────────────────────────────────────────────────

type PortalSubView = "employers" | "serviceability" | "lender-policy";

interface PortalPageProps {
  onBack: () => void;
}

const PortalPage = ({ onBack }: PortalPageProps) => {
  const [subView, setSubView]           = useState<PortalSubView | null>(null);
  const [search, setSearch]             = useState("");
  const [employerRows, setEmployerRows] = useState(initialEmployerRows);
  const [serviceabilityRows, setServiceabilityRows] = useState(initialServiceabilityRows);
  const [lenderRows, setLenderRows]     = useState(initialLenderRows);

  // ── Sub-views (full-page table) ──────────────────────────────────────────────
  if (subView === "employers") {
    return (
      <PortalListView
        title="Employers List"
        subtitle={`${employerRows.length} companies`}
        columns={EMPLOYER_COLUMNS}
        data={employerRows}
        onDataChange={setEmployerRows}
        onBack={() => setSubView(null)}
      />
    );
  }

  if (subView === "serviceability") {
    return (
      <PortalListView
        title="Serviceability List"
        subtitle={`${serviceabilityRows.length} cities`}
        columns={SERVICEABILITY_COLUMNS}
        data={serviceabilityRows}
        onDataChange={setServiceabilityRows}
        onBack={() => setSubView(null)}
      />
    );
  }

  if (subView === "lender-policy") {
    return (
      <PortalListView
        title="Lender Policy"
        subtitle={`${lenderRows.length} lenders`}
        columns={LENDER_COLUMNS}
        data={lenderRows}
        onDataChange={setLenderRows}
        onBack={() => setSubView(null)}
      />
    );
  }

  // ── Portal home grid ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full bg-background">

      {/* ── Header ── */}
      <div className="px-6 py-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Client
          </button>
          <span className="text-muted-foreground">/</span>
          <h2 className="text-sm font-semibold text-foreground">Portal</h2>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search portal tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* ── Category grid ── */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-8 max-w-6xl">

          {/* SALES */}
          <PortalSection title="Sales">
            <PortalCard
              icon={<BarChart3 className="h-4 w-4" />}
              title="Sales Dashboard"
              description="Pipeline & conversion metrics"
            />
            <PortalCard
              icon={<Users className="h-4 w-4" />}
              title="Lead Pipeline"
              description="Active leads & follow-ups"
            />
            <PortalCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Client Onboarding"
              description="New client setup flow"
            />
          </PortalSection>

          {/* CRM TOOLS */}
          <PortalSection title="CRM Tools">
            <PortalCard
              icon={<Building2 className="h-4 w-4" />}
              title="Employers List"
              description="Category ratings across lenders"
              count={employerRows.length}
              clickable
              onClick={() => setSubView("employers")}
            />
            <PortalCard
              icon={<MapPin className="h-4 w-4" />}
              title="Serviceability List"
              description="City-wise lender coverage"
              count={serviceabilityRows.length}
              clickable
              onClick={() => setSubView("serviceability")}
            />
            <PortalCard
              icon={<BookOpen className="h-4 w-4" />}
              title="Lender Policy"
              description="ROI, CIBIL & tenure guidelines"
              count={lenderRows.length}
              clickable
              onClick={() => setSubView("lender-policy")}
            />
          </PortalSection>

          {/* PAYMENT */}
          <PortalSection title="Payment">
            <PortalCard
              icon={<Banknote className="h-4 w-4" />}
              title="Payment Tracker"
              description="EMI & repayment status"
            />
            <PortalCard
              icon={<CalendarClock className="h-4 w-4" />}
              title="EMI Calendar"
              description="Upcoming payment schedule"
            />
            <PortalCard
              icon={<CreditCard className="h-4 w-4" />}
              title="Disbursements"
              description="Loan disbursement tracking"
            />
          </PortalSection>

          {/* OPERATIONS */}
          <PortalSection title="Operations">
            <PortalCard
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Scrub Queue"
              description="Pending scrub approvals"
            />
            <PortalCard
              icon={<FileText className="h-4 w-4" />}
              title="Document Vault"
              description="Centralised doc management"
            />
            <PortalCard
              icon={<ClipboardList className="h-4 w-4" />}
              title="Compliance"
              description="Regulatory & audit tracker"
            />
          </PortalSection>

        </div>
      </div>
    </div>
  );
};

export default PortalPage;
