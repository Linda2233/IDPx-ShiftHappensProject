import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { InfoScreen } from './components/InfoScreen';
import { Navigation } from './components/Navigation';
import { ProfileSetupScreen, ProfileData } from './components/ProfileSetupScreen';

export type Screen = 'login' | 'home' | 'progress' | 'info' | 'connect' | 'settings';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  infoLink?: string;
}

export interface UserData {
  isLoggedIn: boolean;
  name: string;
  level: number;
  currentLevel?: number;
  flowerGrowth: number;
  wateringStreak: number;
  lastWatered: string | null;
  darkMode: boolean;
  tasks: Task[];
  suggestedTasks: Task[];
  weekStartDate: string | null;
  currentWeek: number;
  profileSetupComplete?: boolean;
  password?: string;
  age?: string;
  goals?: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    isLoggedIn: true,
    name: '',
    level: 0,
    flowerGrowth: 0,
    wateringStreak: 0,
    lastWatered: null,
    darkMode: false,
    tasks: [
      { id: '1', title: 'Complete profile setup', completed: true },
      { id: '2', title: 'Learn about tax basics', completed: false, infoLink: 'taxes' },
      { id: '3', title: 'Set up bank account documents', completed: false },
      { id: '4', title: 'Understanding your first payslip', completed: false, infoLink: 'payslip' },
      { id: '5', title: 'Create a monthly budget', completed: false },
    ],
    suggestedTasks: [
      { id: '6', title: 'Schedule a doctor\'s appointment', completed: false },
      { id: '7', title: 'Organize your closet', completed: false },
      { id: '8', title: 'Plan a weekend getaway', completed: false },
    ],
    weekStartDate: null,
    currentWeek: 1,
    profileSetupComplete: true,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('adultingAppData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData({ ...parsed, profileSetupComplete: true });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adultingAppData', JSON.stringify(userData));
  }, [userData]);

  const handleLogin = (name: string) => {
    setUserData({ ...userData, isLoggedIn: true, name, profileSetupComplete: false });
  };

  const handleProfileSetupComplete = (profileData: ProfileData) => {
    setUserData({ 
      ...userData, 
      name: profileData.name,
      password: profileData.password,
      age: profileData.age,
      goals: profileData.goals,
      profileSetupComplete: true 
    });
    setShowProfileEdit(false);
    setCurrentScreen('home');
  };

  const handleProfileEdit = (profileData: ProfileData) => {
    setUserData({ 
      ...userData, 
      name: profileData.name,
      password: profileData.password,
      age: profileData.age,
      goals: profileData.goals,
    });
    setShowProfileEdit(false);
  };

  const handleLogout = () => {
    setUserData({
      isLoggedIn: true,
      name: '',
      level: 0,
      flowerGrowth: 0,
      wateringStreak: 0,
      lastWatered: null,
      darkMode: userData.darkMode,
      tasks: [],
      suggestedTasks: [],
      weekStartDate: null,
      currentWeek: 1,
      profileSetupComplete: true,
    });
    setCurrentScreen('home');
  };

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData({ ...userData, ...updates });
  };

  // Show profile setup screen if user hasn't completed it yet
  /*
  if (!userData.profileSetupComplete) {
    return (
      <ProfileSetupScreen 
        initialName={userData.name}
        initialPassword={userData.password || ''}
        initialAge={userData.age || ''}
        initialGoals={userData.goals || ''}
        onComplete={handleProfileSetupComplete}
        isEditMode={false}
      />
    );
  }
  */


  return (
    <div className={`min-h-screen ${userData.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        {currentScreen === 'home' && (
          <HomeScreen userData={userData} updateUserData={updateUserData} />
        )}
        {currentScreen === 'progress' && (
          <ProgressScreen userData={userData} updateUserData={updateUserData} />
        )}
        {currentScreen === 'info' && (
          <InfoScreen 
            userData={userData} 
            setCurrentScreen={setCurrentScreen} 
            updateUserData={updateUserData}
          />
        )}
        {currentScreen === 'connect' && (
          <ConnectScreen userData={userData} />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen 
            userData={userData} 
            updateUserData={updateUserData}
            onLogout={handleLogout}
            onEditProfile={() => setShowProfileEdit(true)}
          />
        )}
        
        <Navigation 
          currentScreen={currentScreen} 
          setCurrentScreen={setCurrentScreen}
          darkMode={userData.darkMode}
        />

        {/* Profile Edit Overlay */}
        {showProfileEdit && (
          <div className="fixed inset-0 z-50">
            <ProfileSetupScreen 
              initialName={userData.name}
              initialPassword={userData.password || ''}
              initialAge={userData.age || ''}
              initialGoals={userData.goals || ''}
              onComplete={handleProfileEdit}
              isEditMode={true}
              onCancel={() => setShowProfileEdit(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;