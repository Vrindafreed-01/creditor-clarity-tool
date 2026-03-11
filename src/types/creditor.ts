export interface Creditor {
  id: string;
  name: string;
  debtType: string;
  accountNumber: string;
  openDate: string;
  sanctionedAmount: number;
  currentBalance: number;
  closureAmount: number;
  tenure: number;
  currentROI: string;
  emi: number;
}

export const DEBT_TYPES = [
  "CREDIT_CARD",
  "PERSONAL_LOAN",
  "HOME_LOAN",
  "AUTO_LOAN",
  "BUSINESS_LOAN",
];

export const fmt = (n: number) => `₹${Math.round(n).toLocaleString()}`;

export const INITIAL_INCLUDED: Creditor[] = [
  { id: "1", name: "SOUTH INDIAN BANK", debtType: "CREDIT_CARD", accountNumber: "XXXXXXXXXXXXXXX2379", openDate: "18 Jul 23", sanctionedAmount: 115361, currentBalance: 100000, closureAmount: 100000, tenure: 0, currentROI: "--", emi: 5000 },
  { id: "2", name: "Aditya Birla Capital Limited", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXXXXXX7905", openDate: "21 Jan 25", sanctionedAmount: 294427, currentBalance: 227879, closureAmount: 227879, tenure: 0, currentROI: "--", emi: 11000 },
  { id: "3", name: "Krazybee Services Pvt. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXURRL", openDate: "12 Jul 25", sanctionedAmount: 246000, currentBalance: 197786, closureAmount: 197786, tenure: 30, currentROI: "--", emi: 7000 },
  { id: "4", name: "HDFC BANK LTD", debtType: "PERSONAL_LOAN", accountNumber: "XXXXX7969", openDate: "26 Aug 25", sanctionedAmount: 511541, currentBalance: 468092, closureAmount: 468092, tenure: 0, currentROI: "--", emi: 13000 },
  { id: "5", name: "Respo Financial Capital Pvt. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "12345", openDate: "1 Oct 25", sanctionedAmount: 200000, currentBalance: 180000, closureAmount: 180000, tenure: 0, currentROI: "--", emi: 12000 },
];

export const INITIAL_EXCLUDED: Creditor[] = [
  { id: "e1", name: "HDFC BANK LTD", debtType: "CREDIT_CARD", accountNumber: "XXXXXXXXXXXXXXX9181", openDate: "28 Sep 23", sanctionedAmount: 208530, currentBalance: 198834, closureAmount: 198834, tenure: 0, currentROI: "--", emi: 9942 },
  { id: "e2", name: "Responce Investments Limited", debtType: "PERSONAL_LOAN", accountNumber: "123456", openDate: "2 Oct 26", sanctionedAmount: 1, currentBalance: 1, closureAmount: 1, tenure: 0, currentROI: "--", emi: 0 },
  { id: "e3", name: "SMFG India Credit Co. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXX3029", openDate: "7 Jul 25", sanctionedAmount: 60000, currentBalance: 32311, closureAmount: 32311, tenure: 0, currentROI: "--", emi: 7000 },
  { id: "e4", name: "Early Salary Pvt. Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXXXXXXXXXXX3284", openDate: "6 Nov 25", sanctionedAmount: 8000, currentBalance: 5451, closureAmount: 5451, tenure: 0, currentROI: "--", emi: 5000 },
  { id: "e5", name: "HDB Financial Services Ltd.", debtType: "PERSONAL_LOAN", accountNumber: "XXXX0586", openDate: "6 Nov 25", sanctionedAmount: 32000, currentBalance: 21801, closureAmount: 21801, tenure: 6, currentROI: "--", emi: 0 },
];
