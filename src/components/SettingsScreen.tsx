import { UserData } from '../App';
import { Moon, Sun, User, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface SettingsScreenProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  onLogout: () => void;
  onEditProfile: () => void;
}

export function SettingsScreen({ userData, updateUserData, onLogout, onEditProfile }: SettingsScreenProps) {
  const toggleDarkMode = () => {
    updateUserData({ darkMode: !userData.darkMode });
  };

  return (
    <div className={`flex-1 pb-20 ${userData.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: '#8B6F47' }}
      >
        <h1>Settings</h1>
        <p className="opacity-90">Manage your account</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white"
              style={{ backgroundColor: '#D4A574' }}
            >
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
                {userData.name}
              </h3>
              <p className={userData.darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Level {userData.level} • {userData.wateringStreak} day streak
              </p>
            </div>
          </div>
          <button className="w-full py-2 rounded-lg text-white" style={{ backgroundColor: '#6B9BD1' }} onClick={onEditProfile}>
            Edit Profile
          </button>
        </div>

        {/* Appearance */}
        <div className={`rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <h3 className={`p-4 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
            Appearance
          </h3>
          <div className="border-t border-gray-200 dark:border-gray-600">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={toggleDarkMode}
            >
              <div className="flex items-center gap-3">
                {userData.darkMode ? (
                  <Moon className="w-5 h-5 text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-400" />
                )}
                <span className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
                  {userData.darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div 
                className={`w-12 h-6 rounded-full transition-colors ${
                  userData.darkMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div 
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                    userData.darkMode ? 'translate-x-6' : 'translate-x-1'
                  } mt-0.5`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className={`rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <h3 className={`p-4 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
            Account
          </h3>
          <div className="border-t border-gray-200 dark:border-gray-600">
            {[
              { icon: User, label: 'Personal Information', color: '#6B9BD1' },
              { icon: Bell, label: 'Notifications', color: '#D4A574' },
              { icon: HelpCircle, label: 'Help & Support', color: '#8B6F47' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  <span className={userData.darkMode ? 'text-white' : 'text-gray-800'}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Display Preference */}
        <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
          <h3 className={`mb-3 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
            Display Preference
          </h3>
          <p className={`mb-3 ${userData.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose how much information you want to see
          </p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded bg-blue-500 text-white">
              Detailed
            </button>
            <button className={`flex-1 py-2 rounded ${
              userData.darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              Minimal
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full p-4 rounded-lg bg-red-500 text-white flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}