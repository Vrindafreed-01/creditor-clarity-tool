import DocumentManager from "./DocumentManager";
import RequestDocument from "./RequestDocument";
import AgreementAnalysis from "./AgreementAnalysis";

const DocumentsTab = () => {
  return (
    <div className="space-y-5">
      {/* DocumentManager always in edit mode on the dedicated Documents tab */}
      <DocumentManager />
      <RequestDocument />
      <AgreementAnalysis />
    </div>
  );
};

export default DocumentsTab;
