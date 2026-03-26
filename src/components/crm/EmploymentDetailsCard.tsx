import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnifiedDatePicker } from "@/components/ui/unified-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmploymentData } from "@/types/client";

const COMPANY_SUGGESTIONS = [
  "Borosil Limited", "Kalyaniwalla & Mistry LLP", "Convergys India Services Pvt. Ltd.",
  "SK Finance Limited", "Nu-Teck Couplings Pvt Ltd", "Richa Global Exports Pvt Ltd",
  "Curia India Pvt Ltd", "V2 Care App Solution Pvt Ltd", "AVROHN PHARMA (I) LIMITED",
  "TVS Credit Ltd", "IndiaFirst Life Insurance Company Limited",
  "Publicis Groupe/Convonix Systems", "Annamal Institute of Hotel Management",
  "Girnar Soft Automobile Pvt Ltd", "MKU Limited", "Gujarat Fluoro Chemicals Ltd",
  "Group Bayport", "Dineshchandra R Agrawal Infracon Private Limited",
  "Emcure Pharmaceuticals", "TRIDENT AUTO COMPONENTS PRIVATE LIMITED",
  "Connekt Electronics Pvt Ltd", "ANIL INFOTECH PRIVATE LIMITED", "Angel One Limited",
  "ESYASOFT TECHNOLOGIES PRIVATE LIMITED", "Sovereign Pharma Pvt. Ltd",
  "AstraZeneca Plc", "WM Universal Solutions Private Limited",
  "Delta Yards Realty Pvt Ltd", "Mercer Mettl", "CAMP SYSTEMS PRIVATE LTD",
  "REVOLUT TECHNOLOGIES INDIA PRIVATE LIMITED", "A3 Tech India Pvt Ltd",
  "Calling Genie", "Omnitech Engineering Limited",
  "J.K.Minerals Balaghat Madhya Pradesh", "Aircheck India Private Limited",
  "Buddha Institute of Technology", "Beejapuri Dairy Private Limited",
  "Amanta Healthcare", "LORVEN FLEX AND SACK INDIA PRIVATE LIMITED",
  "AES Laboratories Pvt Ltd", "Shri Davara University", "PEOPLE EDUCATIONAL SOCIETY",
  "Pramerica Life Insurance Company Limited",
  "SAMHI JV BUSINESS HOTELS PRIVATE LIMITED",
  "Sathguru Software Products Private Limited",
  "RSM Astute Consulting Private Limited", "Sirmiti One", "COMMUNIQUE CONCRETE",
  "IPG Advertising and Business Services LLP", "AOV International LLP",
  "Fluke Technologies", "Aero Plast Ltd",
  "Quinte Financial Technologies Private Limited",
  "Punjab Chemicals and Crop Protection Limited",
  "Equinox Labs Private Limited", "MODIVCARE LABS PRIVATE LIMITED",
  "Satyam Auto Components Pvt. Ltd", "Ranosys",
  "Vishwa Samudra Holdings Private Limited", "VIDYA POLYMER PRIVATE LIMITED",
  "Sri Kripa Forging Pvt Ltd", "Luxoft LLP",
  "ARROWHEAD COMMUNICATIONS PVT LTD", "Newmark CRE Services Private Limited",
  "Kimaya Himalayan Beverages LLP", "Acme Formulation Pvt Ltd", "Nash Industries",
  "BASIL COMMUNICATIONS",
  "Go Sharp Technologies and Consulting Private Limited",
  "ZAMIRA LIFESCIENCES INDIA PRIVATE LIMITED", "Sky Alloys & Power Limited",
  "Advas Health Pvt Ltd", "Thyrocare Technologies Private Limited",
  "KEC SPUR INFRASTRUCTURE PRIVATE", "Machine Research FZCO-IFZA",
  "MSN Laboratories Pvt Ltd", "FYNEHAND CONSULTANTS LLP",
  "DNEG INDIA MEDIA SERVICES LIMITED", "Bayer Pharmaceuticals Pvt. Ltd.",
  "ARIES ENTERPRISES", "Seabridge Marine Agencies Private Limited",
  "Dynamic Techno Medical Pvt Ltd", "GREEN COSMIC INFRA",
  "NAVEDAS TECHNOLOGY SOLUTIONS PRIVATE LIMITED",
  "System Edge Lambda Technologies LLP", "DMCC SPECIALITY CHEMICALS LTD",
  "SAN IT Solutions Pvt Ltd.", "DE MARS CONSULTING PRIVATE LIMITED",
  "Kerala Water Authority", "Bureau Veritas India Pvt Ltd",
  "Dineshchandra R. Agrawal Infracon Pvt. Ltd.", "Gedore India Pvt Ltd",
  "Alpha Interiors and Modulars", "ATIRA DESIGNS PRIVATE LIMITED",
  "Rhenus Logistics India Private Limited", "NIIT Learning Systems Ltd", "IVP Ltd",
  "R R Hospitality", "BDX India Private Limited", "Shreeji Woodcraft Pvt Ltd",
  "Makita Power Tools India Pvt Ltd", "Safina Motors", "MAAC Bhopal",
  "Greenwich Meridian Logistics India Pvt Ltd", "TACC LIMITED",
  "Precision Biomed Pvt Ltd", "Saptechnical", "Farvat India Private Limited",
  "SABIO EAGLE INFRAPROJECTS PRIVATE LIMITED", "DIGI GLOBAL TECH",
  "DISTRICT ATTORNEY TARN TARAN", "Green Grow Diams", "Nysaa Retail Pvt. Ltd.",
  "Uniorbit Technologies Pvt Ltd", "Ceragon Networks India Pvt. Ltd.",
  "Indepesca Overseas Pvt Ltd", "ECLAT HEALTH SOLUTIONS",
  "ARPINT PRIVATE LIMITED", "INTAS PHARMACEUTICALS",
  "Rakuten Symphony India Pvt. Ltd.", "Hilti India Pvt Ltd",
  "IG Hospitality India Pvt. Ltd.",
  "Kalpana Chawla Government Medical College", "Otica Healthcare Pvt. Ltd",
  "BASF India Limited", "Greenply Industries Ltd",
  "AVS HOLIDAYS PRIVATE LIMITED", "SOPRA STERIA INDIA LIMITED",
  "Forplanet Ingredients Private Limited", "Fine Handling and Automation Pvt Ltd",
  "Artkonnect Management Pvt Ltd", "Capacite",
  "The Boral Union Co-operative Bank Limited",
  "Jubilant Agri and Consumer Products Limited",
  "O/o the MSVP Jalpaiguri Government Medical College & Hospital",
  "AANEEL TECHNOLOGY SOLUTIONS PRIVATE LIMITED",
  "INDIASSETZ INFRA SERVICES PRIVATE LIMITED",
  "Radiant Systems India Pvt. Ltd", "ASHTAVINAYAK INDUSTRIES",
  "Wings Finserve", "Sanofi Consumer Healthcare India Ltd",
  "Jeevan Raksha Complete Cancer Care LLP", "Suraj Govind Tea Estates Pvt Ltd",
  "Pagnism Innovations Private", "JSW Renewable Energy Dolvi Three Ltd",
  "G P Tronics Pvt Ltd", "Delhi Duty Free", "VR Dakshin Private Limited",
  "PUDHARI PUBLICATIONS PVT LTD", "MAHINDRA EDUCATIONAL INSTITUTIONS",
  "Williamson Financial Services Limited", "Ijay Hospitalities Pvt Ltd",
  "LTIMindtree", "ASHWANI TRADING COMPANY", "Outleap Technologies Pvt Ltd",
  "Trinity Air Travel & Tours Pvt Ltd", "Global IT Search Pvt Ltd",
  "McLeod Russel India Limited", "D.S.Enterprises",
  "KANAKIA HOTELS & RESORTS PVT. LTD", "Indian Hydrocolloids",
  "Fortis Healthcare Limited", "Indrox Global Private Limited",
  "Govt Elementary Education", "Raaj Dairy Food Pvt Ltd",
  "Advanced Medtech Solutions Pvt Ltd", "Akasa Air",
  "Coffer Internet Services Pvt. Ltd.", "Atul Rubber Corporation",
  "Mohan Gold Water Breweries Ltd", "Sanfrieght Logistics Pvt Ltd",
  "SYNERGENIUS GROWTH PRIVATE LIMITED", "G1 Offshore and Marine Pvt Ltd",
  "HCT SUN (INDIA) PVT. LTD", "ACS GLOBAL TECH SOLUTIONS PRIVATE LIMITED",
  "Trio Techdesign Pvt Ltd", "GUIDEHOUSE INDIA PVT LTD",
  "Indian Hotels Company Limited",
  "Karnataka Rural Infrastructure Development Limited",
  "PricewaterhouseCoopers Services LLP",
  "BRIISK INSUR-FINTECH PRIVATE LIMITED",
  "Briisk Powering Insurance Private Limited",
  "D I MANAGEMENT INTERNATIONAL SERVICES PRIVATE LIMITED",
  "SARASWAT CO OPERATIVE BANK LIMITED", "Affine Analytics Private Ltd",
  "Athena BPO Pvt Ltd", "CG Power and Industries Solutions Ltd",
  "YOUNG EMPEROR SERVICE PRIVATE LIMITED", "Mifamed Medical Pvt Ltd",
  "VISION PLUS SECURITY CONTROL PRIVATE LIMITED", "Atul Ltd",
  "Manju Shree Properties Pvt Ltd", "MAHARASHTRA HOSIERY", "Honest",
  "KOGTA FINANCIAL I LTD", "PASCO AUTOMOBILES",
  "Kirloskar Electric Company Ltd",
  "ANDROMEDA SALES & DISTRIBUTION PRIVATE LIMITED",
  "Perficient India Pvt Ltd", "Ramagya School",
  "Marathwada Auto Compo Pvt Ltd", "Tata Communication Limited",
  "Mind Merchant Global Private Limited", "VENTURA INDIA PRIVATE LIMITED",
  "Birlasoft Limited", "Zanini India Private Limited", "Trent Limited",
  "Careers Opportunities in CMA CGM Group", "Vintech Industries PVT Ltd",
  "STONES FIRE INDIA PVT LTD", "CMA CGM Logistics Park (Dadri) Pvt. Ltd.",
  "RHENUS CONTRACT LOGISTICS INDIA PRIVATE LIMITED", "Mphasis Company",
  "National Institute of Technology", "Lenovo India Pvt Ltd",
  "SANOFI CONSUMER HEALTHCARE INDIA LIMITED", "SENATE LABORATORIES",
  "Aon Consulting Pvt Ltd", "Nord Drivesystems Pvt Ltd",
  "Birsa Munda Government Medical College Shahdol", "Government Medical College",
  "JK Fenner India Ltd", "EBIX TRAVELS PRIVATE LIMITED",
  "Neon Motors Private Limited", "Tek Infotree Private Limited",
  "Cellcomm Solutions Ltd", "Margadarsi Chit Fund Private Limited",
  "Modi Pipes Pvt. Ltd.", "Infotree Global Solutions",
  "Roto Pumps Private Limited", "Lifestyle International Pvt Ltd",
  "Ajit Industries Pvt Ltd", "Tutors Tactic Private Limited",
  "Vaibhav Inter Decor Pvt Ltd", "Shree Cement Ltd",
  "Sapphire Foods India Pvt Ltd", "Linfox Logistics India",
  "McIver Software LLP", "SFO Technologies", "Innomotics India Pvt. Ltd",
  "CNH Industrial (India) Pvt. Ltd.", "Xeliumtech Solutions Pvt Ltd",
  "Peninsula Pictures Pvt. Ltd", "Netprophets Cyberworks Pvt Ltd",
  "Monier Roofing Pvt Ltd", "Atos GITSS Pvt Ltd",
  "EasyFix Handy Solution India PVT Ltd", "Aditya Birla Capital",
  "Nureca Limited", "Mechatronics Energenics Pvt Ltd",
  "Bee Logistics SCM Pvt Ltd", "Ashoka Hawai & Shoes Pvt. Ltd.",
  "MNS Credit Management Group Pvt Ltd", "Tata Electronics Pvt Ltd",
  "Iprime Services Pvt Ltd", "PROVENTECH CONSULTING PRIVATE LIMITED",
  "ICICI SECURITIES LIMITED", "Getix Health", "AXAT Technologies Pvt Ltd",
  "Universal Cables Limited", "TEKsystems Global Services Pvt. Ltd",
  "Craftsman Automation Limited", "Genius Consultant",
  "Lily Worldwide Private Limited", "Lily Packers Private Limited",
  "GHC Advanced Care Pvt. Ltd.", "Finova Capital Pvt Ltd",
];

interface EmploymentDetailsCardProps {
  data: EmploymentData;
  onChange: (data: EmploymentData) => void;
  requestedDetailIds?: string[];
}

const EmploymentDetailsCard = ({ data, onChange }: EmploymentDetailsCardProps) => {
  const update = (key: keyof EmploymentData, value: string) =>
    onChange({ ...data, [key]: value });

  const [companyOpen, setCompanyOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCompanies = COMPANY_SUGGESTIONS.filter(
    (c) => c.toLowerCase().includes(data.companyName.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Employment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="crm-field-label">Occupation</Label>
          <Select value={data.occupation} onValueChange={(v) => update("occupation", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5" ref={companyRef}>
          <Label className="crm-field-label">Company Name</Label>
          <div className="relative">
            <Input value={data.companyName}
              onChange={(e) => { update("companyName", e.target.value); setCompanyOpen(true); }}
              onFocus={() => setCompanyOpen(true)}
              className="h-9 text-sm" placeholder="Search or type company" />
            {companyOpen && (
              <div className="absolute z-50 bg-card border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto w-full">
                <button type="button"
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors border-b"
                  onClick={() => { update("companyName", ""); setCompanyOpen(false); }}>
                  + Other (Add New)
                </button>
                {filteredCompanies.map((c) => (
                  <button key={c} type="button"
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors"
                    onClick={() => { update("companyName", c); setCompanyOpen(false); }}>
                    {c}
                  </button>
                ))}
                {filteredCompanies.length === 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">No matches — type to add custom</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Inhand Salary (₹)</Label>
          <Input type="number" value={data.inhandSalary} onChange={(e) => update("inhandSalary", e.target.value)} className="h-9 text-sm" placeholder="e.g. 80000" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Any Additional Income (₹)</Label>
          <Input type="number" value={data.additionalIncome} onChange={(e) => update("additionalIncome", e.target.value)} className="h-9 text-sm" placeholder="e.g. 5000" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Date of Joining</Label>
          <UnifiedDatePicker value={data.dateOfJoining} onChange={(v) => update("dateOfJoining", v)} placeholder="MM/DD/YYYY" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Total Work Experience</Label>
          <Input value={data.totalWorkExp} onChange={(e) => update("totalWorkExp", e.target.value)} className="h-9 text-sm" placeholder="e.g. 5 years" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Current Designation</Label>
          <Input value={data.currentDesignation} onChange={(e) => update("currentDesignation", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Office Address</Label>
          <Input value={data.officeAddress} onChange={(e) => update("officeAddress", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="crm-field-label">Office Contact Number</Label>
          <Input value={data.officeContactNumber} onChange={(e) => update("officeContactNumber", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>
    </div>
  );
};

export default EmploymentDetailsCard;
