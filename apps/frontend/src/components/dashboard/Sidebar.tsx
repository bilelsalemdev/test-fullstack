import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { clearDashboard } from '../../store/slices/dashboardSlice';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(clearDashboard());
    dispatch(logoutUser());
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: '/assets/sidebar-icons/home-outline.svg',
      path: '/dashboard',
    },
    {
      name: 'Orders',
      icon: '/assets/sidebar-icons/apps.svg',
      path: '/orders',
    },
    {
      name: 'Collections',
      icon: '/assets/sidebar-icons/shopping-bag.svg',
      path: '/collections',
    },
    {
      name: 'Analytics',
      icon: '/assets/sidebar-icons/layout-template.svg',
      path: '/analytics',
    },
    {
      name: 'Cards',
      icon: '/assets/sidebar-icons/images.svg',
      path: '/cards',
    },
  ];

  const bottomNavigationItems = [
    {
      name: 'Settings',
      icon: '/assets/sidebar-icons/settings-outline.svg',
      path: '/settings',
    },
    {
      name: 'Log Out',
      icon: '/assets/sidebar-icons/log-out-outline.svg',
      path: '/logout',
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#0F0036] border-r border-purple-800/30 flex flex-col transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="pt-10">
        <img
          src="/assets/logo.svg"
          alt="kolct Logo"
          className="w-full h-11 object-contain"
        />
      </div>

      {/* Main Navigation */}
      <nav className="p-4 space-y-2 mt-10">
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-poppins cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-purple-300 hover:text-white hover:bg-purple-600/10'
              }`}
            >
              <span>
                {typeof item.icon === 'string' ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`}
                    style={{
                      filter: isActive
                        ? 'brightness(0) saturate(100%) invert(8%) sepia(100%) saturate(7471%) hue-rotate(316deg) brightness(95%) contrast(107%)'
                        : 'brightness(0) saturate(100%) invert(80%) sepia(16%) saturate(1348%) hue-rotate(229deg) brightness(98%) contrast(100%)',
                    }}
                  />
                ) : (
                  <div className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`}>
                    {item.icon}
                  </div>
                )}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-2 h-2 bg-[#FF04B4] rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation (Settings & Logout) */}
      <div className="px-4 space-y-2  pt-4 mt-10">
        {bottomNavigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={
                item.name === 'Log Out'
                  ? handleLogout
                  : () => handleNavigation(item.path)
              }
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-poppins cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-purple-300 hover:text-white hover:bg-purple-600/10'
              }`}
            >
              <span>
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`}
                  style={{
                    filter: isActive
                      ? 'brightness(0) saturate(100%) invert(8%) sepia(100%) saturate(7471%) hue-rotate(316deg) brightness(95%) contrast(107%)'
                      : 'brightness(0) saturate(100%) invert(80%) sepia(16%) saturate(1348%) hue-rotate(229deg) brightness(98%) contrast(100%)',
                  }}
                />
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-2 h-2 bg-[#FF04B4] rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-8 w-6 h-6 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
        >
          <svg
            className={`w-3 h-3 text-white transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
