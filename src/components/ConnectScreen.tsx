import { useState } from 'react';
import { UserData } from '../App';
import { MessageCircle, Users, Award, Send } from 'lucide-react';

interface ConnectScreenProps {
  userData: UserData;
}

interface Question {
  id: string;
  user: string;
  avatar: string;
  question: string;
  category: string;
  answers: number;
  isAnswered: boolean;
  userLevel?: number;
}

// Initial default questions
const defaultQuestions: Question[] = [
  {
    id: '1',
    user: 'Sarah Martinez',
    avatar: '👩',
    question: 'How do you handle work stress during your first month?',
    category: 'work',
    answers: 5,
    isAnswered: true,
    userLevel: 2,
  },
  {
    id: '2',
    user: 'James Wilson',
    avatar: '👨',
    question: 'What percentage of salary should I save each month?',
    category: 'finance',
    answers: 8,
    isAnswered: true,
    userLevel: 3,
  },
  {
    id: '3',
    user: 'Anonymous',
    avatar: '🎭',
    question: 'Feeling overwhelmed with adult responsibilities. Any tips?',
    category: 'wellness',
    answers: 12,
    isAnswered: true,
    userLevel: 1,
  },
  {
    id: '4',
    user: 'Emma Thompson',
    avatar: '👩',
    question: 'First apartment viewing - what should I look for?',
    category: 'housing',
    answers: 3,
    isAnswered: false,
  },
];

// Load questions from localStorage or use defaults
const loadQuestions = (): Question[] => {
  try {
    const saved = localStorage.getItem('adulting101_community_questions');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading questions:', error);
  }
  return defaultQuestions;
};

// Save questions to localStorage
const saveQuestions = (questions: Question[]) => {
  try {
    localStorage.setItem('adulting101_community_questions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving questions:', error);
  }
};

export function ConnectScreen({ userData }: ConnectScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(loadQuestions());
  const [questionText, setQuestionText] = useState('');
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState('');

  // Random avatars for user questions
  const userAvatars = ['🧑', '👨', '👩', '🧔', '👱', '👴', '👵'];
  const getRandomAvatar = () => userAvatars[Math.floor(Math.random() * userAvatars.length)];

  const handleSubmitQuestion = () => {
    // Validate inputs
    if (!questionText.trim() || !selectedQuestionCategory) {
      alert('Please enter a question and select a category');
      return;
    }

    // Create new question
    const newQuestion: Question = {
      id: Date.now().toString(),
      user: isAnonymous ? 'Anonymous' : userData.name || 'User',
      avatar: isAnonymous ? '🎭' : getRandomAvatar(),
      question: questionText.trim(),
      category: selectedQuestionCategory,
      answers: 0,
      isAnswered: false,
      userLevel: userData.currentLevel || 1,
    };

    // Add to questions array (newest first)
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);

    // Reset form
    setQuestionText('');
    setSelectedQuestionCategory('');
    setIsAnonymous(false);
    setShowAskQuestion(false);
  };

  const categories = [
    { id: 'all', label: 'All', icon: '📱' },
    { id: 'work', label: 'Work Life', icon: '💼' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
    { id: 'housing', label: 'Housing', icon: '🏠' },
  ];

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  return (
    <div className={`flex-1 pb-20 ${userData.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: '#8B6F47' }}
      >
        <h1>Connect & Q&A</h1>
        <p className="opacity-90">Learn from the community</p>
      </div>

      {/* Categories */}
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? userData.darkMode 
                    ? 'bg-yellow-700 text-white'
                    : 'bg-yellow-100 text-yellow-900'
                  : userData.darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-white text-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Build Network Section */}
      <div className="px-6 mb-4">
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5" style={{ color: '#D4A574' }} />
            <h3 className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
              Build Your Network
            </h3>
          </div>
          <p className={`mb-4 ${userData.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Connect with colleagues inside your company or find mentors outside. You can choose to stay anonymous.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded text-white" style={{ backgroundColor: '#6B9BD1' }}>
              Inside Company
            </button>
            <button className="flex-1 py-2 rounded text-white" style={{ backgroundColor: '#8B6F47' }}>
              Outside Company
            </button>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="px-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
            Community Questions
          </h3>
          <button
            onClick={() => setShowAskQuestion(true)}
            className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
            style={{ backgroundColor: '#D4A574' }}
          >
            <MessageCircle className="w-4 h-4" />
            Ask
          </button>
        </div>

        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">{q.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
                    {q.user}
                  </span>
                  {q.userLevel && q.userLevel >= 2 && (
                    <Award className="w-4 h-4 text-yellow-500" title="Advanced Helper" />
                  )}
                </div>
                <p className={userData.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {q.question}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs ${
                userData.darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {categories.find(c => c.id === q.category)?.label}
              </span>
              <span className={userData.darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {q.answers} {q.answers === 1 ? 'answer' : 'answers'}
              </span>
              {q.isAnswered && (
                <span className="text-green-600 text-xs">✓ Answered</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className={`w-full max-w-md ${userData.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-2xl sm:rounded-2xl p-6`}>
            <h2 className={`mb-4 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
              Ask a Question
            </h2>
            
            <select 
              className={`w-full p-3 rounded-lg mb-4 ${
                userData.darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white border-gray-300'
              } border`}
              value={selectedQuestionCategory}
              onChange={(e) => setSelectedQuestionCategory(e.target.value)}
            >
              <option value="">Select category...</option>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>

            <textarea
              placeholder="Type your question here..."
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className={`w-full p-3 rounded-lg mb-4 ${
                userData.darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white border-gray-300'
              } border resize-none`}
            />

            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={userData.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Post anonymously
              </span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAskQuestion(false)}
                className={`flex-1 py-3 rounded-lg ${
                  userData.darkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuestion}
                className="flex-1 py-3 rounded-lg text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#D4A574' }}
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}