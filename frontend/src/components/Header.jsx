import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); // check login state

  const handleLogout = () => {
    localStorage.removeItem('token'); // remove login token
    navigate('/login'); // redirect to login
  };

  return (
    <header className="w-full py-4 border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
            V
          </div>
          <div>
            <div className="font-semibold">Vetri Finance</div>
            <div className="text-xs text-gray-500">Personal & Shared finance</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-sm text-gray-700 hover:text-orange-500 transition"
          >
            Home
          </Link>

          {isLoggedIn && (
            <Link 
              to="/dashboard" 
              className="text-sm text-gray-700 hover:text-orange-500 transition"
            >
              Dashboard
            </Link>
          )}

          {!isLoggedIn && (
            <Link 
              to="/login" 
              className="text-sm text-gray-700 hover:text-orange-500 transition"
            >
              Login
            </Link>
          )}

          {/* Buttons based on login state */}
          {!isLoggedIn ? (
            <button
              onClick={() => navigate('/get-started')}
              className="ml-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
