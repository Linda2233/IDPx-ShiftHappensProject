import { useState } from 'react';
import { X } from 'lucide-react';

interface WellbeingSurveyProps {
  onClose: () => void;
  darkMode: boolean;
}

export function WellbeingSurvey({ onClose, darkMode }: WellbeingSurveyProps) {
  const [responses, setResponses] = useState({
    breathing: 0,
    boundaries: 0,
    overwhelmed: 0,
  });

  const handleSubmit = () => {
    // Save responses
    onClose();
  };

  const questions = [
    { id: 'breathing', label: 'I took breathing breaks during work today', range: '0 - 10' },
    { id: 'boundaries', label: 'I enforced my work-life boundaries', range: '0 - 10' },
    { id: 'overwhelmed', label: 'I did NOT feel overwhelmed at work today', range: '0 - 10' },
  ];

  //bg-black 
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.48)] bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={darkMode ? 'text-white' : 'text-gray-800'}>
            My Wellness Awareness
          </h2>
          <button onClick={onClose} className="p-1">
            <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          How did you do today?
        </p>

        <div className="space-y-6 mb-6">
          {questions.map((q) => (
            <div key={q.id}>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {q.label}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={responses[q.id as keyof typeof responses]}
                onChange={(e) => setResponses({ 
                  ...responses, 
                  [q.id]: parseInt(e.target.value) 
                })}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>0</span>
                <span className={darkMode ? 'text-white' : 'text-gray-800'}>
                  {responses[q.id as keyof typeof responses]}
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>10</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            My thoughts
          </label>
          <textarea
            rows={3}
            placeholder="How are you feeling about work today?"
            className={`w-full p-3 rounded-lg ${
              darkMode 
                ? 'bg-gray-600 text-white border-gray-500' 
                : 'bg-white border-gray-300'
            } border resize-none`}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg text-white"
          style={{ backgroundColor: '#6B9BD1' }}
        >
          Done →
        </button>
      </div>
    </div>
  );
}
