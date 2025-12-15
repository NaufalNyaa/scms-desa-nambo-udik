import { useState } from 'react';
import { Moon, Sun, Bell, Lock, Shield, Globe, ArrowLeft, Save, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';

interface SettingsPageProps {
  onNavigate?: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'security' | 'privacy' | 'language'>('appearance');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    complaintUpdates: true,
    adminMessages: true,
    language: 'id',
    twoFactorAuth: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
  };

  const handlePasswordChange = () => {
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Semua field password harus diisi');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSuccess('Password berhasil diubah!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const handleSaveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess('Pengaturan berhasil disimpan!');
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handleBackToDashboard = () => {
    if (onNavigate) {
      onNavigate(isAdmin ? 'admin-dashboard' : 'dashboard');
    }
  };

  const tabs = [
    { id: 'appearance' as const, icon: Sun, label: 'Tampilan' },
    { id: 'notifications' as const, icon: Bell, label: 'Notifikasi' },
    { id: 'security' as const, icon: Lock, label: 'Keamanan' },
    { id: 'privacy' as const, icon: Shield, label: 'Privasi' },
    { id: 'language' as const, icon: Globe, label: 'Bahasa' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar currentPage="settings" onNavigate={onNavigate || (() => {})} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="flex items-center space-x-2 mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>

        {/* Alert Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
            <p className="text-green-800 dark:text-green-200 font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✕</span>
            </div>
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-2">Pengaturan</h1>
            <p className="text-blue-50">Kelola preferensi dan keamanan akun Anda</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Appearance Section */}
            {activeTab === 'appearance' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Sun className="h-6 w-6 mr-2 text-yellow-500" />
                  Tampilan
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      {theme === 'dark' ? (
                        <Moon className="h-5 w-5 text-indigo-400" />
                      ) : (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Mode Gelap
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {theme === 'dark' ? 'Aktif' : 'Nonaktif'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setSuccess('Tema berhasil diubah!');
                        setTimeout(() => setSuccess(''), 3000);
                      }}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Bell className="h-6 w-6 mr-2 text-blue-500" />
                  Notifikasi
                </h2>

                <div className="space-y-3">
                  {[
                    { key: 'emailNotifications', label: 'Notifikasi Email', desc: 'Terima pembaruan via email' },
                    { key: 'pushNotifications', label: 'Notifikasi Push', desc: 'Notifikasi browser dan aplikasi' },
                    { key: 'smsNotifications', label: 'Notifikasi SMS', desc: 'Terima SMS untuk laporan penting' },
                    { key: 'complaintUpdates', label: 'Update Laporan', desc: 'Pemberitahuan status laporan' },
                    { key: 'adminMessages', label: 'Pesan Admin', desc: 'Tanggapan dari admin desa' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSettingChange(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <Save className="h-5 w-5" />
                  <span>{loading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                </button>
              </div>
            )}

            {/* Security Section */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lock className="h-6 w-6 mr-2 text-red-500" />
                  Keamanan
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Masukkan password saat ini"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Masukkan password baru"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Ulangi password baru"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                  >
                    {loading ? 'Mengubah Password...' : 'Ubah Password'}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Autentikasi Dua Faktor
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tambahan lapisan keamanan untuk akun Anda
                      </p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('twoFactorAuth')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeTab === 'privacy' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-green-500" />
                  Privasi
                </h2>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Data Anda Aman:</strong> Semua data pribadi Anda dilindungi sesuai kebijakan privasi kami.
                    NIK dan alamat Anda tidak dapat diubah tanpa verifikasi admin desa untuk keamanan.
                  </p>
                </div>
              </div>
            )}

            {/* Language Section */}
            {activeTab === 'language' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe className="h-6 w-6 mr-2 text-purple-500" />
                  Bahasa
                </h2>

                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                  <option value="jv">Basa Jawa</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
