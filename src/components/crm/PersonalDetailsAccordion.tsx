import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Send, Save } from "lucide-react";

const PersonalDetailsAccordion = () => {
  const [identity, setIdentity] = useState({
    nameAsPan: "Rahul Sharma",
    fatherName: "Vijay Sharma",
    motherName: "Sunita Sharma",
    pan: "ABCDE1234F",
    aadhaar: "XXXX XXXX 5678",
    dob: "1992-05-15",
    gender: "Male",
    maritalStatus: "Single",
  });

  const [contact, setContact] = useState({
    mobile: "+91 98765 43210",
    personalEmail: "rahul.sharma@gmail.com",
    officialEmail: "rahul.s@infosys.com",
  });

  const [banking, setBanking] = useState({
    accountNumber: "XXXX XXXX 4521",
    ifscCode: "SBIN0001234",
  });

  return (
    <div className="bg-card rounded-lg border">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-foreground">Personal & Login Details</h3>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Send className="h-3.5 w-3.5" />
          Request Missing Details
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["identity", "contact", "banking"]} className="px-5 pb-3">
        <AccordionItem value="identity">
          <AccordionTrigger className="text-sm font-medium py-3">Identity Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-3">
              {Object.entries({
                "Name as per PAN": ["nameAsPan", identity.nameAsPan],
                "Father's Name": ["fatherName", identity.fatherName],
                "Mother's Name": ["motherName", identity.motherName],
                PAN: ["pan", identity.pan],
                Aadhaar: ["aadhaar", identity.aadhaar],
                DOB: ["dob", identity.dob],
                Gender: ["gender", identity.gender],
                "Marital Status": ["maritalStatus", identity.maritalStatus],
              }).map(([label, [key, value]]) => (
                <div key={key} className="space-y-1.5">
                  <Label className="crm-field-label">{label}</Label>
                  <Input
                    value={value}
                    onChange={(e) => setIdentity({ ...identity, [key]: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pb-1">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Save className="h-3 w-3" />
                Save
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger className="text-sm font-medium py-3">Contact Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-3">
              {Object.entries({
                Mobile: ["mobile", contact.mobile],
                "Personal Email": ["personalEmail", contact.personalEmail],
                "Official Email": ["officialEmail", contact.officialEmail],
              }).map(([label, [key, value]]) => (
                <div key={key} className="space-y-1.5">
                  <Label className="crm-field-label">{label}</Label>
                  <Input
                    value={value}
                    onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pb-1">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Save className="h-3 w-3" />
                Save
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="banking">
          <AccordionTrigger className="text-sm font-medium py-3">Banking Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-3">
              {Object.entries({
                "Account Number": ["accountNumber", banking.accountNumber],
                "IFSC Code": ["ifscCode", banking.ifscCode],
              }).map(([label, [key, value]]) => (
                <div key={key} className="space-y-1.5">
                  <Label className="crm-field-label">{label}</Label>
                  <Input
                    value={value}
                    onChange={(e) => setBanking({ ...banking, [key]: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pb-1">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Save className="h-3 w-3" />
                Save
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PersonalDetailsAccordion;
