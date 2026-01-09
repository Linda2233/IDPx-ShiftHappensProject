import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface JournalModalProps {
  onClose: () => void;
  darkMode: boolean;
}

export function JournalModal({ onClose, darkMode }: JournalModalProps) {
  const [entry, setEntry] = useState('');
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const prompts = [
    "What's one thing you learned today?",
    "What are you grateful for?",
    "What challenged you today?",
    "What's your goal for tomorrow?",
  ];

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleSave = () => {
    // Save journal entry
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.48)] bg-opacity-50 z-50 flex items-end sm:items-center justify-center px-[0px] py-[88px]">
      <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto`}>
        <div 
          className="p-6 text-white sticky top-0"
          style={{ backgroundColor: '#D4A574' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2>Journal</h2>
            <button onClick={onClose} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <Calendar className="w-4 h-4" />
            <p>{today}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className={`mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Writing Prompts
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedPrompt === prompt
                      ? 'bg-yellow-100 text-yellow-900 border-2 border-yellow-400'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {selectedPrompt && (
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} border border-blue-300`}>
              <p className={darkMode ? 'text-blue-200' : 'text-blue-900'}>
                {selectedPrompt}
              </p>
            </div>
          )}

          <div>
            <h3 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Your Entry
            </h3>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              rows={8}
              placeholder="Start writing..."
              className={`w-full p-4 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white border-gray-300'
              } border resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-lg text-white"
              style={{ backgroundColor: '#6B9BD1' }}
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
