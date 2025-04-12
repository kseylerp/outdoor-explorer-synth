
import React from 'react';
import ResponseDialog from './ResponseDialog';

interface PromptResponseDialogProps {
  showResponseDialog: boolean;
  currentQuestion: string;
  quickResponseOptions: Array<{text: string, value: string}>;
  setShowResponseDialog: (show: boolean) => void;
  onResponseSubmit: (response: string) => void;
}

const PromptResponseDialog: React.FC<PromptResponseDialogProps> = ({
  showResponseDialog,
  currentQuestion,
  quickResponseOptions,
  setShowResponseDialog,
  onResponseSubmit
}) => {
  return (
    <ResponseDialog 
      isOpen={showResponseDialog}
      onClose={() => setShowResponseDialog(false)}
      question={currentQuestion}
      onSubmit={onResponseSubmit}
      options={quickResponseOptions}
    />
  );
};

export default PromptResponseDialog;
