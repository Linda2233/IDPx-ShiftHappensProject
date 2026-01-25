import { useState } from 'react';
import { UserData, Screen, Task } from '../App';
import { ChevronRight, BookOpen, DollarSign, Briefcase, Home, Heart, PiggyBank } from 'lucide-react';

interface InfoScreenProps {
  userData: UserData;
  setCurrentScreen: (screen: Screen) => void;
  updateUserData: (updates: Partial<UserData>) => void;
}

interface InfoTopic {
  id: string;
  title: string;
  icon: any;
  relevantLevel: number;
  description: string;
  hasActionableTasks: boolean;
  tasks?: Task[];
  sources?: string[];
}

export function InfoScreen({ userData, setCurrentScreen, updateUserData }: InfoScreenProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics: InfoTopic[] = [
    {
      id: 'taxes',
      title: 'Understanding Taxes',
      icon: DollarSign,
      relevantLevel: 0,
      description: 'Learn about income tax, tax brackets, deductions, and how to file your first tax return.',
      hasActionableTasks: true,
      tasks: [
        { id: 'tax-1', title: 'Research your tax code', completed: false },
        { id: 'tax-2', title: 'Keep records of work expenses', completed: false },
        { id: 'tax-3', title: 'Learn about tax deductions', completed: false },
      ],
      sources: [
        'https://www.eu-gleichbehandlungsstelle.de/eugs-en/eu-citizens/information-center/taxes',
        'https://www.gov.uk/income-tax-rates',
      ],
    },
    {
      id: 'payslip',
      title: 'Reading Your Payslip',
      icon: Briefcase,
      relevantLevel: 0,
      description: 'Understand gross pay, net pay, deductions, and what all those numbers mean.',
      hasActionableTasks: true,
      tasks: [
        { id: 'payslip-1', title: 'Identify your gross pay', completed: false },
        { id: 'payslip-2', title: 'Understand your net pay', completed: false },
        { id: 'payslip-3', title: 'Review all deductions', completed: false },
      ],
      sources: [
        'https://www.simplegermany.com/german-payslip-explained/',
        'https://www.firma.de/en/accountancy/lohnabrechnung-how-to-read-a-german-payslip/',
      ],
    },
    {
      id: 'budgeting',
      title: 'Creating a Budget',
      icon: PiggyBank,
      relevantLevel: 1,
      description: 'Learn the 50/30/20 rule and how to manage your money effectively.',
      hasActionableTasks: true,
      tasks: [
        { id: 'budget-1', title: 'Set up a monthly budget', completed: false },
        { id: 'budget-2', title: 'Track your spending for a week', completed: false },
        { id: 'budget-3', title: 'Apply the 50/30/20 rule', completed: false },
      ],
      sources: [
        'Dave Ramsey - Budget Planning Guide',
        'NerdWallet - Budgeting Basics',
        'YNAB (You Need A Budget)',
      ],
    },
    {
      id: 'housing',
      title: 'Renting Your First Place',
      icon: Home,
      relevantLevel: 1,
      description: 'What to know about rental contracts, deposits, and tenant rights.',
      hasActionableTasks: true,
      tasks: [
        { id: 'housing-1', title: 'Review rental contract terms', completed: false },
        { id: 'housing-2', title: 'Learn about tenant rights', completed: false },
        { id: 'housing-3', title: 'Document apartment condition', completed: false },
      ],
      sources: [
        'Shelter - Tenant Rights Guide',
        'Citizens Advice - Renting',
        'UK Government - Rented Housing Guide',
      ],
    },
    {
      id: 'wellness',
      title: 'Work-Life Balance',
      icon: Heart,
      relevantLevel: 0,
      description: 'Tips for maintaining mental health and setting boundaries at work.',
      hasActionableTasks: false,
      sources: [
        'Mind - Work and Mental Health',
        'Mental Health Foundation',
        'ACAS - Work-Life Balance',
      ],
    },
  ];

  const TopicDetail = ({ topic }: { topic: InfoTopic }) => {
    const Icon = topic.icon;
    
    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
        <div 
          className={`w-full max-w-md ${userData.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto`}
        >
          <div 
            className="p-6 text-white sticky top-0"
            style={{ backgroundColor: '#6B9BD1' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-6 h-6" />
              <h2>{topic.title}</h2>
            </div>
            <p className="opacity-90">
              Suggested at Level {topic.relevantLevel}+
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className={`mb-3 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
                About this topic
              </h3>
              <p className={userData.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {topic.description}
              </p>
            </div>

            {topic.id === 'taxes' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`mb-2 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Key Concepts
                  </h4>
                  <ul className={`space-y-2 ${userData.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Income tax is deducted from your salary automatically (PAYE)</li>
                    <li>• Your tax code determines how much tax you pay</li>
                    <li>• You may be entitled to tax refunds or deductions</li>
                    <li>• Keep records of work-related expenses</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-blue-900' : 'bg-blue-50'} border border-blue-300`}>
                  <h4 className={`mb-2 ${userData.darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                    Did you know?
                  </h4>
                  <p className={userData.darkMode ? 'text-blue-200' : 'text-blue-800'}>
                    In many countries, you can claim back tax on work-from-home expenses, professional development courses, and work equipment!
                  </p>
                </div>
              </div>
            )}

            {topic.sources && topic.sources.length > 0 && (
              <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`mb-3 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Sources
                </h4>
                <ul className={`space-y-2 ${userData.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {topic.sources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {topic.hasActionableTasks && (
              <button
                onClick={() => {
                  // Add tasks to the user's task list
                  if (topic.tasks && topic.tasks.length > 0) {
                    const existingTaskIds = new Set(userData.tasks.map(t => t.id));
                    const newTasks = topic.tasks.filter(task => !existingTaskIds.has(task.id));
                    
                    if (newTasks.length > 0) {
                      updateUserData({
                        tasks: [...userData.tasks, ...newTasks]
                      });
                    }
                  }
                  setSelectedTopic(null);
                  setCurrentScreen('progress');
                }}
                className="w-full py-3 rounded-lg text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#D4A574' }}
              >
                Add Tasks to Progress
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setSelectedTopic(null)}
              className={`w-full py-3 rounded-lg ${
                userData.darkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-1 pb-20 ${userData.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: '#6B9BD1' }}
      >
        <h1>Information Hub</h1>
        <p className="opacity-90">Learn at your own pace</p>
      </div>

      <div className="p-6 space-y-4">
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-blue-900' : 'bg-blue-50'} border border-blue-200`}>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className={userData.darkMode ? 'text-blue-200' : 'text-blue-900'}>
                Topics are suggested based on your current level and journey timeline. Click any topic to learn more!
              </p>
            </div>
          </div>
        </div>

        {topics.map((topic) => {
          const Icon = topic.icon;
          const isRelevant = userData.level >= topic.relevantLevel;
          
          return (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`p-4 rounded-lg ${
                userData.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
              } shadow-sm cursor-pointer transition-colors`}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: isRelevant ? '#D4A574' : '#9CA3AF' }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
                      {topic.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                  <p className={userData.darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {topic.description.slice(0, 60)}...
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {isRelevant ? (
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        Relevant now
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-600">
                        Level {topic.relevantLevel}+
                      </span>
                    )}
                    {topic.hasActionableTasks && (
                      <span className={`text-xs ${userData.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        • Has tasks
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTopic && (
        <TopicDetail topic={topics.find(t => t.id === selectedTopic)!} />
      )}
    </div>
  );
}