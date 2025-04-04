
import React from 'react';
import { FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onNotesChange }) => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-800">Trip Notes</h3>
      </div>
      <Textarea
        placeholder="Add your personal notes about this trip here..."
        className="min-h-[120px]"
        value={notes}
        onChange={onNotesChange}
      />
      <p className="text-xs text-gray-500 mt-2">
        These notes are saved locally and will help you remember important details about your trip planning.
      </p>
    </div>
  );
};

export default NotesSection;
