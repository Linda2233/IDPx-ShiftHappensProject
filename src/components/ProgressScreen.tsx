import { useState, useEffect } from 'react';
import { UserData } from '../App';
import { CheckCircle2, Circle, ChevronRight, Trophy, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  infoLink?: string;
}

interface ProgressScreenProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

export function ProgressScreen({ userData, updateUserData }: ProgressScreenProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; title: string; type: 'task' | 'suggested' } | null>(null);

  const tasks = userData.tasks || [];
  const suggestedTasks = userData.suggestedTasks || [];

  // Initialize week start date if not set
  useEffect(() => {
    if (!userData.weekStartDate) {
      updateUserData({ weekStartDate: new Date().toISOString() });
    }
    // Initialize suggested tasks if not set
    if (!userData.suggestedTasks || userData.suggestedTasks.length === 0) {
      updateUserData({
        suggestedTasks: [
          { id: 'suggested-1', title: 'Understanding Taxes', completed: false, infoLink: 'taxes' },
          { id: 'suggested-2', title: 'Reading Your Payslip', completed: false, infoLink: 'payslip' },
          { id: 'suggested-3', title: 'Creating a Budget', completed: false, infoLink: 'budget' },
        ]
      });
    }
  }, []);

  // Check if all tasks are completed and advance to next week
  useEffect(() => {
    const allTasksCompleted = tasks.length > 0 && tasks.every(t => t.completed);
    
    if (allTasksCompleted && userData.flowerGrowth === 100) {
      // Check if a week has passed
      if (userData.weekStartDate) {
        const weekStart = new Date(userData.weekStartDate);
        const now = new Date();
        const daysPassed = Math.floor((now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysPassed >= 7) {
          // Advance to next week
          const newWeek = userData.currentWeek + 1;
          updateUserData({
            currentWeek: newWeek,
            level: newWeek - 1,
            weekStartDate: new Date().toISOString(),
            flowerGrowth: 0,
            // Optionally reset tasks or add new ones for next week
          });
        }
      }
    }
  }, [tasks, userData.flowerGrowth, userData.weekStartDate, userData.currentWeek]);

  // Send flower growth to Python server whenever it changes
  useEffect(() => {
    const value = userData.flowerGrowth;
    if (typeof value !== 'number' || Number.isNaN(value)) return;

    const controller = new AbortController();
    const url = `http://localhost:8080/api/number?value=${encodeURIComponent(value)}`;

    fetch(url, { method: 'GET', signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json().catch(() => null);
      })
      .then((data) => {
        // Optional: uncomment for debugging
        // console.log('Sent flower growth:', value, 'server response:', data);
      })
      .catch((err) => {
        // Log but do not block UI
        console.error('Failed to send flower growth:', err);
      });

    return () => controller.abort();
  }, [userData.flowerGrowth]);

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    // Calculate flower growth based on BOTH regular tasks AND suggested tasks
    const completedRegular = updatedTasks.filter(t => t.completed).length;
    const completedSuggested = suggestedTasks.filter(t => t.completed).length;
    const totalCompleted = completedRegular + completedSuggested;
    const totalAllTasks = updatedTasks.length + suggestedTasks.length;
    const newGrowth = totalAllTasks > 0 ? Math.floor((totalCompleted / totalAllTasks) * 100) : 0;
    
    updateUserData({ 
      tasks: updatedTasks,
      flowerGrowth: newGrowth,
    });
  };

  const toggleSuggestedTask = (id: string) => {
    const updatedSuggestedTasks = suggestedTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    // Calculate flower growth based on BOTH regular tasks AND suggested tasks
    const completedRegular = tasks.filter(t => t.completed).length;
    const completedSuggested = updatedSuggestedTasks.filter(t => t.completed).length;
    const totalCompleted = completedRegular + completedSuggested;
    const totalAllTasks = tasks.length + updatedSuggestedTasks.length;
    const newGrowth = totalAllTasks > 0 ? Math.floor((totalCompleted / totalAllTasks) * 100) : 0;
    
    updateUserData({ 
      suggestedTasks: updatedSuggestedTasks,
      flowerGrowth: newGrowth,
    });
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
      };
      const updatedTasks = [...tasks, newTask];
      
      // Recalculate flower growth including suggested tasks
      const completedRegular = updatedTasks.filter(t => t.completed).length;
      const completedSuggested = suggestedTasks.filter(t => t.completed).length;
      const totalCompleted = completedRegular + completedSuggested;
      const totalAllTasks = updatedTasks.length + suggestedTasks.length;
      const newGrowth = totalAllTasks > 0 ? Math.floor((totalCompleted / totalAllTasks) * 100) : 0;
      
      updateUserData({ 
        tasks: updatedTasks,
        flowerGrowth: newGrowth,
      });
      
      setNewTaskTitle('');
      setNewTaskCategory('');
      setShowAddTask(false);
    }
  };

  const handleDeleteTask = (id: string, title: string, type: 'task' | 'suggested') => {
    setDeleteConfirmation({ id, title, type });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;

    if (deleteConfirmation.type === 'task') {
      const updatedTasks = tasks.filter(t => t.id !== deleteConfirmation.id);
      
      // Recalculate flower growth
      const completedRegular = updatedTasks.filter(t => t.completed).length;
      const completedSuggested = suggestedTasks.filter(t => t.completed).length;
      const totalCompleted = completedRegular + completedSuggested;
      const totalAllTasks = updatedTasks.length + suggestedTasks.length;
      const newGrowth = totalAllTasks > 0 ? Math.floor((totalCompleted / totalAllTasks) * 100) : 0;
      
      updateUserData({ 
        tasks: updatedTasks,
        flowerGrowth: newGrowth,
      });
    } else {
      const updatedSuggestedTasks = suggestedTasks.filter(t => t.id !== deleteConfirmation.id);
      
      // Recalculate flower growth
      const completedRegular = tasks.filter(t => t.completed).length;
      const completedSuggested = updatedSuggestedTasks.filter(t => t.completed).length;
      const totalCompleted = completedRegular + completedSuggested;
      const totalAllTasks = tasks.length + updatedSuggestedTasks.length;
      const newGrowth = totalAllTasks > 0 ? Math.floor((totalCompleted / totalAllTasks) * 100) : 0;
      
      updateUserData({ 
        suggestedTasks: updatedSuggestedTasks,
        flowerGrowth: newGrowth,
      });
    }

    setDeleteConfirmation(null);
  };

  const [weeklyChallenge] = useState('Take 5 breathing breaks during work this week');
  const [weekProgress] = useState(3);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  // Calculate days remaining in current week
  const getDaysRemaining = () => {
    if (!userData.weekStartDate) return 7;
    const weekStart = new Date(userData.weekStartDate);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - daysPassed);
  };

  const daysRemaining = getDaysRemaining();
  const allTasksCompleted = tasks.length > 0 && tasks.every(t => t.completed);

  return (
    <div className={`flex-1 pb-20 ${userData.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: '#D4A574' }}
      >
        <h1>Progress</h1>
        <p className="opacity-90">Track your adulting journey</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Level Info */}
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6" style={{ color: '#D4A574' }} />
              <span className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
                Week {userData.currentWeek}
              </span>
            </div>
            <span className={userData.darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${userData.flowerGrowth}%`,
                backgroundColor: '#D4A574'
              }}
            />
          </div>
          <p className={`mt-2 ${userData.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {allTasksCompleted 
              ? daysRemaining > 0 
                ? `All tasks completed! Wait ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} to advance to next week`
                : 'Ready to advance to next week!'
              : `Complete all tasks to unlock next week`
            }
          </p>
        </div>

        {/* Weekly Progress */}
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <h3 className={`mb-3 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
            This Week
          </h3>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`flex-1 h-2 rounded ${
                  day <= weekProgress ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className={userData.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {weekProgress} of 7 days completed
          </p>
        </div>

        {/* Weekly Challenge */}
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-blue-900' : 'bg-blue-50'} border-2 border-blue-300`}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎯</div>
            <div className="flex-1">
              <h4 className={userData.darkMode ? 'text-white' : 'text-blue-900'}>
                Weekly Challenge
              </h4>
              <p className={userData.darkMode ? 'text-blue-200' : 'text-blue-800'}>
                {weeklyChallenge}
              </p>
            </div>
          </div>
        </div>

        {/* Task Checklist */}
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
              Your Tasks
            </h3>
            <span className={userData.darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {completedTasks}/{totalTasks}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  userData.darkMode ? 'bg-gray-600' : 'bg-gray-50'
                } transition-colors`}
              >
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? userData.darkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                        : userData.darkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id, task.title, 'task');
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Learning Tasks */}
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
              Suggested Tasks
            </h3>
          </div>

          <div className="space-y-3">
            {suggestedTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  userData.darkMode ? 'bg-gray-600' : 'bg-gray-50'
                } transition-colors`}
              >
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleSuggestedTask(task.id)}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? userData.darkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                        : userData.darkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id, task.title, 'suggested');
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Custom Task */}
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Add Custom Task
        </button>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md ${userData.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6`}>
            <h2 className={`mb-4 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
              Add Custom Task
            </h2>
            
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className={`w-full p-3 rounded-lg mb-3 ${
                userData.darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white border-gray-300'
              } border`}
            />

            <select 
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className={`w-full p-3 rounded-lg mb-4 ${
                userData.darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white border-gray-300'
              } border`}
            >
              <option value="">Select topic (optional)</option>
              <option value="work">💼 Work Life</option>
              <option value="finance">💰 Finance</option>
              <option value="wellness">🧘 Wellness</option>
              <option value="housing">🏠 Housing</option>
              <option value="other">📋 Other</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskTitle('');
                  setNewTaskCategory('');
                }}
                className={`flex-1 py-3 rounded-lg ${
                  userData.darkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className={`flex-1 py-3 rounded-lg text-white ${
                  newTaskTitle.trim()
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md ${userData.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6`}>
            <h2 className={`mb-4 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
              Delete Task
            </h2>
            
            <p className={`mb-4 ${userData.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to delete the task "{deleteConfirmation.title}"?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className={`flex-1 py-3 rounded-lg ${
                  userData.darkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`flex-1 py-3 rounded-lg text-white ${
                  userData.darkMode 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}