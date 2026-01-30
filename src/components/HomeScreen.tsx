import { useState, useEffect } from 'react';
import { UserData } from '../App';
import { Droplets, BookOpen, X } from 'lucide-react';
import { WellbeingSurvey } from './WellbeingSurvey';
import { JournalModal } from './JournalModal';

interface HomeScreenProps {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

export function HomeScreen({ userData, updateUserData }: HomeScreenProps) {
  const [showWellbeingSurvey, setShowWellbeingSurvey] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

  useEffect(() => {
    const lastSurvey = localStorage.getItem('lastWellbeingSurvey');
    const today = new Date().toDateString();

    if (!lastSurvey || lastSurvey !== today) {
      setTimeout(() => setShowWellbeingSurvey(true), 2000);
    }
  }, []);

  // ✅ ADD THIS RIGHT HERE (below the first useEffect)
  useEffect(() => {
    const state =
        userData.flowerGrowth < 25 ? 0 :
            userData.flowerGrowth < 50 ? 1 :
                userData.flowerGrowth < 75 ? 2 : 3;

    fetch("/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: state }),
    }).catch((err) => console.error("Failed to send flower state:", err));
  }, [userData.flowerGrowth]);

  const getFlowerStage = () => {
    if (userData.flowerGrowth < 25) return 'seed';
    if (userData.flowerGrowth < 50) return 'sprout';
    if (userData.flowerGrowth < 75) return 'growing';
    return 'blooming';
  };

  const stage = getFlowerStage();

  const completedTasks = userData.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = userData.tasks?.length || 0;

  return (
      <div className={`flex-1 flex flex-col ${userData.darkMode ? 'bg-gray-800' : 'bg-gradient-to-b from-blue-50 to-green-50'}`}>
        <div className="p-6 pb-24">
          <div className="text-center mb-4">
            <p className={userData.darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Week {userData.currentWeek}
            </p>
          </div>

          {/* Flower Display */}
          <div className="relative h-96 flex items-end justify-center mb-6">
            {/* Soil */}
            <div
                className="absolute bottom-0 w-full h-32 rounded-t-full"
                style={{ backgroundColor: '#8B6F47' }}
            />

            {/* Flower stages */}
            <div className="relative z-10 mb-8 flex flex-col items-center">
              {stage === 'seed' && (
                  <div className="text-6xl">🌱</div>
              )}
              {stage === 'sprout' && (
                  <div className="flex flex-col items-center">
                    <div className="text-7xl">🌿</div>
                    <div className="w-2 h-12" style={{ backgroundColor: '#4A7C59' }}></div>
                  </div>
              )}
              {stage === 'growing' && (
                  <div className="flex flex-col items-center">
                    <div className="text-8xl">🌻</div>
                    <div className="w-3 h-20" style={{ backgroundColor: '#4A7C59' }}></div>
                    <div className="flex gap-2 -mt-4">
                      <div className="text-4xl transform -rotate-45">🍃</div>
                      <div className="text-4xl transform rotate-45">🍃</div>
                    </div>
                  </div>
              )}
              {stage === 'blooming' && (
                  <div className="flex flex-col items-center">
                    <div className="text-9xl animate-pulse">🌻</div>
                    <div className="w-4 h-24" style={{ backgroundColor: '#4A7C59' }}></div>
                    <div className="flex gap-4 -mt-6">
                      <div className="text-5xl transform -rotate-45">🍃</div>
                      <div className="text-5xl transform rotate-45">🍃</div>
                    </div>
                  </div>
              )}

              {/* Progress indicator */}
              <div className="mt-6 text-center">
                <div className="w-48 h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${userData.flowerGrowth}%`,
                        backgroundColor: '#D4A574'
                      }}
                  />
                </div>
                <p className={`mt-2 ${userData.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Growth: {userData.flowerGrowth}%
                </p>
              </div>
            </div>

            {/* Level badge */}
            <div
                className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: '#D4A574' }}
            >
              <div className="text-center">
                <div className="text-xs">Level</div>
                <div>{userData.level}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${userData.darkMode ? 'bg-gray-700' : 'bg-white'} border-2 ${
                userData.darkMode ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <h3 className={`mb-2 ${userData.darkMode ? 'text-white' : 'text-gray-800'}`}>
                Task Progress
              </h3>
              <p className={userData.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {completedTasks} of {totalTasks} tasks completed
              </p>
              {totalTasks > 0 && (
                  <p className={`mt-1 ${userData.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Complete more tasks to grow your flower! 🌱
                  </p>
              )}
            </div>

            <button
                onClick={() => setShowJournal(true)}
                className="w-full py-4 rounded-lg flex items-center justify-center gap-2 text-white"
                style={{ backgroundColor: '#D4A574' }}
            >
              <BookOpen className="w-5 h-5" />
              Open Journal
            </button>
          </div>
        </div>

        {/* Modals */}
        {showWellbeingSurvey && (
            <WellbeingSurvey
                onClose={() => {
                  setShowWellbeingSurvey(false);
                  localStorage.setItem('lastWellbeingSurvey', new Date().toDateString());
                }}
                darkMode={userData.darkMode}
            />
        )}

        {showJournal && (
            <JournalModal
                onClose={() => setShowJournal(false)}
                darkMode={userData.darkMode}
            />
        )}
      </div>
  );
}