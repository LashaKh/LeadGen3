import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ListChecks, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-[#0a061e]">
      <nav className="border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold text-white">LeadGen AI</span>
            </div>
            <div className="flex space-x-8">
              <Link
                to="/app"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/app'
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-gray-300 hover:text-purple-400'
                }`}
              >
                Generate
              </Link>
              <Link
                to="/app/leads"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/app/leads'
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-gray-300 hover:text-purple-400'
                }`}
              >
                Leads
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}