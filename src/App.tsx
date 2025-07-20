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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <QuizProvider>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
            <Route path="/mentor-signup" element={user ? <Navigate to="/" replace /> : <MentorSignup />} />
            <Route path="/index" element={<Navigate to="/" replace />} />
            
            {user ? (
              <>
                {user.role === 'mentor' ? (
                  <>
                    <Route path="/" element={<MentorDashboard />} />
                    <Route path="/mentor-dashboard" element={<MentorDashboard />} />
                  </>
                ) : user.hasStartedCareer ? (
                  <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </>
                ) : (
                  <Route path="/" element={<Index />} />
                )}
                
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
          <Toaster />
          <Sonner />
        </QuizProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


