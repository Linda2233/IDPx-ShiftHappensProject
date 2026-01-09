import { useState } from 'react';
import { User, Lock, Calendar, Target } from 'lucide-react';

interface ProfileSetupScreenProps {
  initialName: string;
  initialPassword?: string;
  initialAge?: string;
  initialGoals?: string;
  onComplete: (profileData: ProfileData) => void;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export interface ProfileData {
  name: string;
  password: string;
  age: string;
  goals: string;
}

export function ProfileSetupScreen({ 
  initialName, 
  initialPassword = '', 
  initialAge = '', 
  initialGoals = '', 
  onComplete,
  isEditMode = false,
  onCancel 
}: ProfileSetupScreenProps) {
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState(initialPassword);
  const [age, setAge] = useState(initialAge);
  const [goals, setGoals] = useState(initialGoals);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim() && age.trim() && goals.trim()) {
      onComplete({
        name: name.trim(),
        password: password.trim(),
        age: age.trim(),
        goals: goals.trim(),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8DCC8' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌱</div>
            <h1 className="text-gray-800 mb-2">{isEditMode ? 'Edit Your Profile' : 'Set Up Your Profile'}</h1>
            <p className="text-gray-600">
              {isEditMode ? 'Update your information' : "Let's personalize your journey to adulting!"}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-gray-700">
                <User className="w-4 h-4" style={{ color: '#8B6F47' }} />
                <span>Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-gray-700">
                <Lock className="w-4 h-4" style={{ color: '#8B6F47' }} />
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>

            {/* Age Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-gray-700">
                <Calendar className="w-4 h-4" style={{ color: '#8B6F47' }} />
                <span>Age</span>
              </label>
              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                min="18"
                max="100"
                required
              />
            </div>

            {/* Goals Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-gray-700">
                <Target className="w-4 h-4" style={{ color: '#8B6F47' }} />
                <span>Goals for Next Year</span>
              </label>
              <textarea
                placeholder="What do you want to achieve in the next year?"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 resize-none"
                required
              />
            </div>
            
            {isEditMode && onCancel ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded bg-gray-400 text-white transition-colors hover:opacity-90"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#8B6F47' }}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: '#8B6F47' }}
              >
                Complete Setup
              </button>
            )}
          </form>
        </div>
      </div>
      
      <div className="h-24" style={{ backgroundColor: '#D4A574' }}></div>
    </div>
  );
}