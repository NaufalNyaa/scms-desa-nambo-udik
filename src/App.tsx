import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfilePage from "./pages/UserProfilePage";
import AdminProfilePage from "./pages/AdminProfilePage";
import CreateComplaint from "./pages/CreateComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import AdminComplaintDetail from "./pages/AdminComplaintDetail";
import StatisticsPage from "./pages/StatisticsPage";
import ResidentsPage from "./pages/ResidentsPage";
import SettingsPage from "./pages/SettingsPage";
function AppContent() {
  const { user, isAdmin, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  useEffect(() => {
    if (!loading && user) {
      if (
        currentPage === "landing" ||
        currentPage === "login" ||
        currentPage === "register"
      ) {
        setCurrentPage(isAdmin ? "admin-dashboard" : "dashboard");
      }
    } else if (!loading && !user) {
      if (
        currentPage !== "landing" &&
        currentPage !== "login" &&
        currentPage !== "register"
      ) {
        setCurrentPage("landing");
      }
    }
  }, [user, loading, isAdmin]);
  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    if (data) {
      setSelectedComplaint(data);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Memuat aplikasi...
          </p>
        </div>
      </div>
    );
  }
  // Public pages
  if (!user) {
    switch (currentPage) {
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  }
  // Profile page - role-based routing
  if (currentPage === "profile") {
    return isAdmin ? (
      <AdminProfilePage onNavigate={handleNavigate} />
    ) : (
      <UserProfilePage onNavigate={handleNavigate} />
    );
  }
  // Admin pages
  if (isAdmin) {
    switch (currentPage) {
      case "admin-dashboard":
        return <AdminDashboard onNavigate={handleNavigate} />;
      case "admin-complaint-detail":
        return selectedComplaint ? (
          <AdminComplaintDetail
            complaint={selectedComplaint}
            onNavigate={handleNavigate}
          />
        ) : (
          <AdminDashboard onNavigate={handleNavigate} />
        );
      case "statistics":
        return <StatisticsPage onNavigate={handleNavigate} />;
      case "users":
        return <ResidentsPage onNavigate={handleNavigate} />;
      case "settings":
        return <SettingsPage onNavigate={handleNavigate} />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  }
  // User pages
  switch (currentPage) {
    case "dashboard":
      return <UserDashboard onNavigate={handleNavigate} />;
    case "create-complaint":
      return <CreateComplaint onNavigate={handleNavigate} />;
    case "complaint-detail":
      return selectedComplaint ? (
        <ComplaintDetail
          complaint={selectedComplaint}
          onNavigate={handleNavigate}
        />
      ) : (
        <UserDashboard onNavigate={handleNavigate} />
      );
    case "settings":
      return <SettingsPage onNavigate={handleNavigate} />;
    default:
      return <UserDashboard onNavigate={handleNavigate} />;
  }
}
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
