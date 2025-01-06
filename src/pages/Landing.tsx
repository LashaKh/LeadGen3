import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a061e] flex flex-col">
      <nav className="border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold text-white">LeadGen AI</span>
            </div>
            <div className="flex space-x-4">
              {user ? (
                <Link
                  to="/app"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-purple-500/10"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-xl mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Generate Leads with AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Transform your business with AI-powered lead generation. Get qualified leads tailored to your product and market.
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <Link
                to="/app"
                className="px-8 py-3 border border-transparent rounded-lg text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Generate Leads
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 border border-transparent rounded-lg text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border border-purple-500 rounded-lg text-lg font-medium text-purple-500 hover:bg-purple-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
