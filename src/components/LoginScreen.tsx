import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8DCC8' }}>
      <div className="flex-1 flex items-center justify-center px-6 bg-[rgba(48,79,181,0)]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-gray-800 mb-2">Welcome to</h1>
            <h2 className="text-gray-800">Adulting 101</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            
            <button
              type="submit"
              className="w-full py-3 rounded text-white transition-colors"
              style={{ backgroundColor: '#8B6F47' }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
      
      <div className="h-24" style={{ backgroundColor: '#D4A574' }}></div>
    </div>
  );
}
