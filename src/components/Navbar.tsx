import { useState } from 'react';
import { Home, LogOut, LayoutDashboard, FileText, Settings, BarChart3, Users, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmDialog from './ConfirmDialog';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, signOut, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  const userMenuItems = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'create-complaint', label: 'Buat Laporan', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Admin - Laporan', icon: FileText },
    { id: 'statistics', label: 'Statistik', icon: BarChart3 },
    { id: 'users', label: 'Data Warga', icon: Users },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  // Helper to get default page based on role
  const getDefaultPage = () => isAdmin ? 'admin-dashboard' : 'dashboard';

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <button
              onClick={() => onNavigate(getDefaultPage())}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg shadow-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Desa Nambo Udik</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sistem Pengaduan Masyarakat</p>
              </div>
            </button>

            {/* Menu Items */}
            <div className="flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden lg:inline text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Right Section: Theme Toggle, Profile, Logout */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>

                {/* Profile Button */}
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm font-medium">Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleSignOut}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari sistem?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}
