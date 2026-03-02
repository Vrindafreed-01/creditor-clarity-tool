import DocumentManager from "./DocumentManager";
import RequestDocument from "./RequestDocument";
import AgreementAnalysis from "./AgreementAnalysis";

const DocumentsTab = () => {
  return (
    <div className="space-y-5">
      <DocumentManager />
      <RequestDocument />
      <AgreementAnalysis />
    </div>
  );
};

export default DocumentsTab;
