import { ReactNode } from "react";
import DocumentManager from "./DocumentManager";
import RequestDocument from "./RequestDocument";
import AgreementAnalysis from "./AgreementAnalysis";

interface DocumentsTabProps {
  isEditing?: boolean;
  onSetEditPanel?: (content: ReactNode | null) => void;
}

const DocumentsTab = ({ isEditing = false, onSetEditPanel }: DocumentsTabProps) => {
  return (
    <div className="space-y-5">
      <DocumentManager isEditing={isEditing} onSetEditPanel={onSetEditPanel} />
      <RequestDocument />
      <AgreementAnalysis />
    </div>
  );
};

export default DocumentsTab;
