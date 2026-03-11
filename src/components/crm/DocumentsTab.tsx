import DocumentManager from "./DocumentManager";
import RequestDocument from "./RequestDocument";
import AgreementAnalysis from "./AgreementAnalysis";

interface DocumentsTabProps {
  isEditing?: boolean;
}

const DocumentsTab = ({ isEditing = false }: DocumentsTabProps) => {
  return (
    <div className="space-y-5">
      <DocumentManager isEditing={isEditing} />
      <RequestDocument />
      <AgreementAnalysis />
    </div>
  );
};

export default DocumentsTab;
