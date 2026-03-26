export interface PersonalData {
  nameAsPan: string;
  nameAsAadhaar: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  panNo: string;
  aadhaar: string;
  dob: string;
  mobile: string;
  alternateMobile: string;
  personalEmail: string;
  officialEmail: string;
  gender: string;
  maritalStatus: string;
}

export interface AddressData {
  aadhaarAddress: string;
  aadhaarOwnership: string;
  permanentAddress: string;
  permanentOwnership: string;
  currentAddress: string;
  currentOwnership: string;
  yearsAtPresentAddress: string;
  yearsAtPermanentAddress: string;
}

export interface EmploymentData {
  occupation: string;
  companyName: string;
  inhandSalary: string;
  additionalIncome: string;
  dateOfJoining: string;
  totalWorkExp: string;
  currentDesignation: string;
  officeAddress: string;
  officeContactNumber: string;
}

export interface BankData {
  bankName: string;
  ifscCode: string;
  accountNumber: string;
}

export interface RefPersonData {
  name: string;
  relation: string;
  mobile: string;
  email: string;
  address: string;
  pinCode: string;
}

export interface SentDetailItem {
  id: string;
  label: string;
  comment?: string;
}

export interface SentDetailRequest {
  id: string;
  sentAt: string;
  items: SentDetailItem[];
}

export interface SentDocItem {
  docTypeId: string;
  docLabel: string;
  months: string[];
  comment: string;
}

export interface SentDocumentRequest {
  id: string;
  sentAt: string;
  items: SentDocItem[];
}

// Compute which requestable detail IDs are empty given current form data
export function getEmptyDetailIds(
  personal: PersonalData,
  address: AddressData,
  employment: EmploymentData,
  bank: BankData,
  ref1: RefPersonData,
  ref2: RefPersonData,
): string[] {
  const checks: Record<string, boolean> = {
    pan: !personal.panNo,
    aadhaar: !personal.aadhaar,
    dob: !personal.dob,
    father: !personal.fatherName,
    mother: !personal.motherName,
    marital: !personal.maritalStatus,
    address_current: !address.currentAddress,
    address_permanent: !address.permanentAddress,
    employer: !employment.companyName,
    designation: !employment.currentDesignation,
    work_exp: !employment.totalWorkExp,
    salary: !employment.inhandSalary,
    bank_acc: !bank.accountNumber,
    ifsc: !bank.ifscCode,
    ref1: !ref1.name,
    ref2: !ref2.name,
    existing_loans: true, // no direct form field
    credit_card: true,    // no direct form field
  };
  return Object.entries(checks).filter(([, empty]) => empty).map(([id]) => id);
}

// Check if a specific detail ID is filled given current form data
export function isDetailFilled(
  id: string,
  personal: PersonalData,
  address: AddressData,
  employment: EmploymentData,
  bank: BankData,
  ref1: RefPersonData,
  ref2: RefPersonData,
): boolean {
  switch (id) {
    case "pan": return !!personal.panNo;
    case "aadhaar": return !!personal.aadhaar;
    case "dob": return !!personal.dob;
    case "father": return !!personal.fatherName;
    case "mother": return !!personal.motherName;
    case "marital": return !!personal.maritalStatus;
    case "address_current": return !!address.currentAddress;
    case "address_permanent": return !!address.permanentAddress;
    case "employer": return !!employment.companyName;
    case "designation": return !!employment.currentDesignation;
    case "work_exp": return !!employment.totalWorkExp;
    case "salary": return !!employment.inhandSalary;
    case "bank_acc": return !!bank.accountNumber;
    case "ifsc": return !!bank.ifscCode;
    case "ref1": return !!ref1.name;
    case "ref2": return !!ref2.name;
    default: return false;
  }
}

export const INITIAL_PERSONAL_DATA: PersonalData = {
  nameAsPan: "", nameAsAadhaar: "", fatherName: "", motherName: "",
  spouseName: "", panNo: "", aadhaar: "", dob: "", mobile: "", alternateMobile: "",
  personalEmail: "", officialEmail: "", gender: "", maritalStatus: "",
};

export const INITIAL_ADDRESS_DATA: AddressData = {
  aadhaarAddress: "", aadhaarOwnership: "",
  permanentAddress: "", permanentOwnership: "",
  currentAddress: "", currentOwnership: "",
  yearsAtPresentAddress: "", yearsAtPermanentAddress: "",
};

export const INITIAL_EMPLOYMENT_DATA: EmploymentData = {
  occupation: "", companyName: "", inhandSalary: "", additionalIncome: "",
  dateOfJoining: "", totalWorkExp: "", currentDesignation: "", officeAddress: "", officeContactNumber: "",
};

export const INITIAL_BANK_DATA: BankData = {
  bankName: "", ifscCode: "", accountNumber: "",
};

export const INITIAL_REF_DATA: RefPersonData = {
  name: "", relation: "", mobile: "", email: "", address: "", pinCode: "",
};
