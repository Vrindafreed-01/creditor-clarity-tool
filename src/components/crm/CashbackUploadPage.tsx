import { useState } from "react";
import { Upload, Trash2, CheckCircle2, ChevronDown, ChevronUp, X } from "lucide-react";

// ── Dummy receipt UIs ──────────────────────────────────────────────────────────

const UTRReceiptMock = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 max-w-xs mx-auto font-sans">
    <div className="flex items-center gap-2 mb-3">
      <div className="h-6 w-6 rounded-full bg-[#F37B20] flex items-center justify-center">
        <span className="text-white text-[9px] font-bold">IC</span>
      </div>
      <span className="text-[13px] font-bold text-gray-800">ICICI Bank</span>
    </div>
    <p className="text-[11px] font-semibold text-gray-500 mb-3 uppercase tracking-wide">
      Fund Transfer Acknowledgment
    </p>
    <div className="space-y-2 text-[12px]">
      <div className="flex justify-between">
        <span className="text-gray-500">UTR No:</span>
        <span className="font-semibold text-gray-800">123456789012</span>
      </div>
      <div className="h-px bg-gray-100" />
      <div className="flex justify-between">
        <span className="text-gray-500">Transaction Date:</span>
        <span className="text-gray-700">25-Apr 2024, 12:34 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Type:</span>
        <span className="text-gray-700">NEFT</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Remitter A/C:</span>
        <span className="text-gray-700">XX3823</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Beneficiary:</span>
        <span className="text-gray-700">ICICI BANK LTD</span>
      </div>
      <div className="h-px bg-gray-100" />
      <div className="flex justify-between">
        <span className="text-gray-500">Transfer Amount:</span>
        <span className="font-bold text-[#E53E3E]">₹15,000.00</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Remarks:</span>
        <span className="font-semibold text-gray-700">Loan Payment</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Status:</span>
        <span className="font-bold text-green-600">SUCCESS</span>
      </div>
    </div>
  </div>
);

const BankTransferMock = () => (
  <div className="bg-[#003580] rounded-xl shadow-sm p-4 max-w-xs mx-auto font-sans">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-red-600 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">H</span>
        </div>
        <span className="text-white text-[13px] font-bold">HDFC BANK</span>
      </div>
      <div className="flex gap-1">
        <div className="h-2 w-2 rounded-full bg-white/30" />
        <div className="h-2 w-2 rounded-full bg-white/30" />
        <div className="h-2 w-3 rounded-sm bg-white/60" />
      </div>
    </div>
    <div className="bg-white rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle2 className="h-3 w-3 text-white" />
        </div>
        <span className="text-green-600 font-bold text-[13px]">Transaction successful</span>
      </div>
      <p className="text-gray-500 text-[11px] mb-1">Amount Transferred</p>
      <p className="text-[22px] font-bold text-gray-800 mb-3">₹10,000.00</p>
      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-500">To A/C:</span>
          <span className="text-gray-700 font-medium">ICICI BANK LTD | XX7232</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Transaction ID:</span>
          <span className="text-gray-700 font-medium">HDFCR1234567899</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date:</span>
          <span className="text-gray-700 font-medium">25 Apr 2024, 11:45 AM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Remarks:</span>
          <span className="text-gray-700 font-medium">Loan EMI</span>
        </div>
      </div>
      <div className="mt-2 bg-green-50 border border-green-200 rounded px-2 py-1 text-[10px] text-green-700 font-medium">
        ✓ IMPS transfer HDFCR123456789
      </div>
    </div>
  </div>
);

const CreditorPaymentMock = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 max-w-xs mx-auto font-sans">
    <div className="flex items-center gap-2 mb-3">
      <div className="h-7 w-7 rounded-full bg-[#003580] flex items-center justify-center">
        <span className="text-white text-[10px] font-bold">BF</span>
      </div>
      <div>
        <p className="text-[11px] text-gray-500">via</p>
        <p className="text-[13px] font-bold text-gray-800">BAJAJ FINSERV</p>
      </div>
    </div>
    <div className="flex items-center gap-2 mb-1">
      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
        <CheckCircle2 className="h-3 w-3 text-white" />
      </div>
      <span className="text-blue-600 font-bold text-[13px]">Payment Successful!</span>
    </div>
    <p className="text-[24px] font-bold text-blue-600 mb-1">₹22,126.00</p>
    <p className="text-[11px] text-gray-500 mb-3">Payment 25 Apr 2024, 01:10 PM</p>
    <div className="bg-gray-50 rounded-lg p-2.5 space-y-1.5 text-[11px]">
      <p className="font-semibold text-gray-600 mb-1">Payment Details:</p>
      <div className="flex justify-between">
        <span className="text-gray-500">Loan Account:</span>
        <span className="text-gray-700 font-medium">XXXX6903</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Transaction ID:</span>
        <span className="text-gray-700 font-medium">FT1234567890998</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Credited:</span>
        <span className="text-gray-700 font-medium">Bajaj Finance Limited</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">UTR Number:</span>
        <span className="text-gray-700 font-medium">SBINR123456789</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Payment Method:</span>
        <span className="text-gray-700 font-medium">Net Banking</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Remarks:</span>
        <span className="text-gray-700 font-medium">EMIs Paid</span>
      </div>
    </div>
  </div>
);

const PaymentSuccessReceiptMock = () => (
  <div className="bg-white rounded-xl border-2 border-green-200 shadow-sm p-4 max-w-xs mx-auto font-sans">
    <div className="text-center mb-3">
      <p className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">ICICI BANK LTD</p>
      <p className="text-[11px] text-gray-500">Loan Account: XXXX7232</p>
    </div>
    <div className="flex items-center justify-center gap-2 mb-3">
      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
        <CheckCircle2 className="h-4 w-4 text-white" />
      </div>
      <span className="text-green-600 font-bold text-[15px]">Payment Successful!</span>
    </div>
    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-[12px]">
      <div className="flex justify-between">
        <span className="text-gray-500">Paid On:</span>
        <span className="font-semibold text-gray-800">25 Apr 2024, 02:50 PM</span>
      </div>
      <div className="h-px bg-gray-200" />
      <div className="flex justify-between">
        <span className="text-gray-500">Amount:</span>
        <span className="font-bold text-gray-800">₹15,000.00</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Transaction Ref:</span>
        <span className="font-semibold text-gray-800">FREED456790123</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Payment Method:</span>
        <span className="text-gray-700">UPI</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Paid From:</span>
        <span className="text-gray-700">SBI Bank (A/c- XXXX5823)</span>
      </div>
    </div>
    <p className="text-[10px] text-gray-400 text-center mt-3">
      A copy of this receipt will be emailed to you shortly.
    </p>
  </div>
);

// ── Receipt type config ────────────────────────────────────────────────────────

const RECEIPT_TYPES = [
  {
    id: "utr",
    label: "UTR / Transaction receipt",
    color: "orange",
    description: "Bank-issued fund transfer acknowledgment with UTR number",
    mock: <UTRReceiptMock />,
  },
  {
    id: "bank-transfer",
    label: "Bank transfer screenshot",
    color: "green",
    description: "Mobile banking app screenshot showing successful transfer",
    mock: <BankTransferMock />,
  },
  {
    id: "creditor-payment",
    label: "Creditor payment confirmation",
    color: "orange",
    description: "Payment confirmation from the creditor's app or portal",
    mock: <CreditorPaymentMock />,
  },
  {
    id: "payment-success",
    label: "Payment success receipt",
    color: "green",
    description: "Official receipt showing amount, date & reference number",
    mock: <PaymentSuccessReceiptMock />,
  },
] as const;

type ReceiptId = (typeof RECEIPT_TYPES)[number]["id"];

// ── Chip ──────────────────────────────────────────────────────────────────────

const Chip = ({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: "orange" | "green";
  active: boolean;
  onClick: () => void;
}) => {
  const base =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium cursor-pointer transition-all select-none";
  const styles = {
    orange: active
      ? "bg-orange-500 border-orange-500 text-white shadow-sm"
      : "bg-white border-orange-400 text-orange-600 hover:bg-orange-50",
    green: active
      ? "bg-green-600 border-green-600 text-white shadow-sm"
      : "bg-white border-green-600 text-green-700 hover:bg-green-50",
  };
  return (
    <button className={`${base} ${styles[color]}`} onClick={onClick}>
      {label}
      {active ? (
        <X className="h-3 w-3 ml-0.5" />
      ) : (
        <span className="text-[10px] opacity-60 ml-0.5">→</span>
      )}
    </button>
  );
};

// ── What can you upload section ────────────────────────────────────────────────

const WhatCanYouUpload = () => {
  const [activeId, setActiveId] = useState<ReceiptId | null>(null);

  const activeType = RECEIPT_TYPES.find((r) => r.id === activeId);

  const toggle = (id: ReceiptId) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gray-200" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          What can you upload?
        </p>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-1">
        {RECEIPT_TYPES.map((r) => (
          <Chip
            key={r.id}
            label={r.label}
            color={r.color}
            active={activeId === r.id}
            onClick={() => toggle(r.id)}
          />
        ))}
      </div>

      {/* Hint */}
      {!activeId && (
        <p className="text-center text-[11px] text-gray-400 mt-2">
          Tap any option above to see an example
        </p>
      )}

      {/* Preview panel */}
      {activeType && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200">
            <div>
              <p className="text-[12px] font-semibold text-gray-800">{activeType.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{activeType.description}</p>
            </div>
            <button
              onClick={() => setActiveId(null)}
              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mock receipt */}
          <div className="p-4">{activeType.mock}</div>

          {/* Must show footer */}
          <div className="mx-4 mb-4 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
            <p className="text-[10px] text-orange-600 mb-1">Must clearly show:</p>
            <p className="text-[11px] font-bold text-orange-800">
              Amount · Date · UTR/Reference · Creditor name
            </p>
          </div>
        </div>
      )}

      {/* Static must-show when nothing selected */}
      {!activeId && (
        <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5">
          <p className="text-[10px] text-orange-600 mb-0.5">Must clearly show:</p>
          <p className="text-[12px] font-bold text-orange-800">
            Amount · Date · UTR/Reference · Creditor name
          </p>
        </div>
      )}
    </div>
  );
};

// ── File item ─────────────────────────────────────────────────────────────────

const FileItem = ({ name }: { name: string }) => (
  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
    <div className="h-8 w-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
      <span className="text-[9px] font-bold text-blue-500">PDF</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-medium text-gray-800 truncate">{name}</p>
      <div className="h-1 bg-blue-500 rounded-full mt-1 w-3/4" />
    </div>
    <button className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-gray-100 text-gray-400 shrink-0">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </div>
);

// ── Terms accordion ────────────────────────────────────────────────────────────

const TermsAccordion = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-white text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[12px] font-semibold text-gray-700">Offer terms and conditions</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-3 bg-white border-t border-gray-100">
          <ul className="text-[11px] text-gray-500 space-y-1 list-disc pl-3 mt-2">
            <li>This reward can be used for your next FREED settlement.</li>
            <li>Cashback is applied within 5–7 business days after verification.</li>
            <li>Only one cashback per settled account is applicable.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────

const CashbackUploadPage = () => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7f0] flex justify-center py-6 px-4">
      <div className="w-full max-w-sm">

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-b from-[#e8f5e2] to-[#f0f9e8] border border-green-200 px-5 py-6 text-center mb-4 shadow-sm">
          <p className="text-[13px] font-semibold text-green-800 mb-1">Get Cashback of flat</p>
          <p className="text-[48px] font-black text-green-700 leading-none mb-2">₹1000</p>
          <p className="text-[12px] text-green-700">
            Upload your payment receipt and<br />
            <span className="font-semibold">save on your next settlement.</span>
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-4 shadow-sm">
          <p className="text-[13px] font-bold text-gray-800 mb-3">How it works</p>
          <ul className="space-y-2">
            {[
              <>For your <strong>settled account</strong>, upload your <strong>payment receipt</strong> here.</>,
              <>Our team will <strong>verify</strong> your receipt.</>,
              <>After verification, <strong>cashback</strong> will be added to FREED's contribution fund.</>,
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-orange-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-gray-600">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Settled account card */}
        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-gray-200" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Settled Accounts
            </p>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="mt-3 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#F37B20] flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">IC</span>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-gray-800">ICICI Bank</p>
                  <p className="text-[10px] text-gray-400">CC · XXXX 0234</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-orange-500">Upload pending</span>
            </div>

            {/* Upload zone */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 text-center hover:border-gray-400 cursor-pointer transition-colors">
              <div className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white text-[12px] font-semibold px-4 py-2 rounded-lg mb-2">
                <Upload className="h-3.5 w-3.5" />
                Upload
              </div>
              <p className="text-[11px] font-medium text-gray-600">Upload multiple files</p>
              <p className="text-[10px] text-gray-400">JPG, PNG or PDF · Max 10 MB</p>
            </div>
          </div>

          {/* Uploaded files */}
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-500 mb-2">Your Files</p>
            <div className="space-y-2">
              <FileItem name="January_Salary_Slip.pdf" />
              <FileItem name="Payment_Receipt_Apr24.pdf" />
            </div>
          </div>

          {/* What can you upload - redesigned */}
          <WhatCanYouUpload />

          {/* Terms */}
          <TermsAccordion />

          {/* Confirm checkbox */}
          <div className="flex items-start gap-2.5 mt-4">
            <button
              onClick={() => setConfirmed((v) => !v)}
              className={`h-5 w-5 rounded flex items-center justify-center border-2 shrink-0 mt-0.5 transition-colors ${
                confirmed
                  ? "bg-orange-500 border-orange-500"
                  : "bg-white border-gray-400"
              }`}
            >
              {confirmed && <CheckCircle2 className="h-3 w-3 text-white" />}
            </button>
            <p className="text-[12px] text-gray-600">
              I confirm this receipt is for the account shown above
            </p>
          </div>

          {/* Submit */}
          <button
            className={`w-full mt-4 py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all ${
              confirmed
                ? "bg-[#1e3a5f] text-white shadow-md hover:bg-[#162d4d]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!confirmed}
          >
            Submit
            <span className="text-base">✈</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CashbackUploadPage;
