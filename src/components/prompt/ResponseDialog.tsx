
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ResponseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  onSubmit: (answer: string) => void;
  options?: Array<{text: string, value: string}>;
}

const ResponseDialog: React.FC<ResponseDialogProps> = ({
  isOpen,
  onClose,
  question,
  onSubmit,
  options = []
}) => {
  const [textResponse, setTextResponse] = useState('');

  const handleSubmit = () => {
    if (textResponse.trim()) {
      onSubmit(textResponse);
      setTextResponse('');
    }
  };

  const handleOptionClick = (value: string) => {
    onSubmit(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{question}</DialogTitle>
        </DialogHeader>
        
        {options.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        )}
        
        <div className="space-y-2">
          <Textarea
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            placeholder="Type your response here..."
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!textResponse.trim()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResponseDialog;
