import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Recommendations from "./pages/Recommendations";
import CareerRoadmap from "./pages/CareerRoadmap";
import CareerStart from "./pages/CareerStart";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { QuizProvider } from "./contexts/QuizContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MentorSignup from "./pages/MentorSignup";
import BrowseCareers from "./pages/BrowseCareers";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mentor-signup" element={<MentorSignup />} />
      <Route path="/index" element={<Navigate to="/" replace />} />
      {isAuthenticated ? (
        <>
          {user?.role === 'mentor' ? (
            <Route path="/" element={<Navigate to="/mentor-dashboard" replace />} />
          ) : user?.hasStartedCareer ? (
            <Route path="/" element={<Dashboard />} />
          ) : (
            <Route path="/" element={<Index />} />
          )}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/career/:careerId" element={<CareerStart />} />
          <Route path="/career-roadmap/:careerId" element={<CareerRoadmap />} />
          <Route path="/browse-careers" element={<BrowseCareers />} />
          <Route path="/profile" element={<Profile />} />
        </>
      ) : (
        <Route path="/" element={<Login />} />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <QuizProvider>
              <AppRoutes />
            </QuizProvider>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;


