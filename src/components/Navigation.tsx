import { Screen } from '../App';
import { Home, BarChart3, BookOpen } from 'lucide-react';

interface NavigationProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  darkMode: boolean;
}

export function Navigation({ currentScreen, setCurrentScreen, darkMode }: NavigationProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'progress' as Screen, icon: BarChart3, label: 'Progress' },
    { id: 'info' as Screen, icon: BookOpen, label: 'Info' },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-t`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? darkMode 
                    ? 'text-yellow-400' 
                    : 'text-yellow-700'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              style={isActive ? { backgroundColor: darkMode ? '#374151' : '#FEF3C7' } : {}}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
