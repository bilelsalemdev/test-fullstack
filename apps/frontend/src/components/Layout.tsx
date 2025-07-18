import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getCurrentUser, logoutUser } from '../store/slices/authSlice';
import Sidebar from './dashboard/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#120036] flex overflow-x-auto">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="bg-[#0F0036]/50 border-b border-purple-800/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative ml-6">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <img
                  src="/assets/dashboard-icons/search.svg"
                  alt="search"
                  className="w-5 h-5"
                />
              </div>
              <input
                type="text"
                placeholder="Search Here"
                className="w-80 h-10 pl-10 pr-4 bg-[#1D0054]  rounded-lg text-white placeholder-[#68676E] focus:outline-none focus:border-[#FF04B4] transition-colors font-poppins"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-purple-300 hover:text-white transition-colors cursor-pointer">
                <img
                  src="/assets/dashboard-icons/mode.svg"
                  alt="theme toggle"
                  className="w-5 h-5"
                />
              </button>

              <button className="relative p-2 text-purple-300 hover:text-white transition-colors cursor-pointer">
                <img
                  src="/assets/dashboard-icons/bell.svg"
                  alt="notifications"
                  className="w-5 h-5"
                />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F81DFB] rounded-full"></span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-purple-800/30 rounded-lg p-2 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.first_name?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-white text-sm font-medium">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-purple-300 text-xs">{user?.email}</p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1D0054] border border-purple-400/30 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-700/50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-purple-700/50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="flex-1 overflow-auto p-6">{children}</section>
      </div>
    </div>
  );
};

export default Layout;
