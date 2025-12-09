import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";

import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Overview } from "./components/dashboard/Overview";
import { ProjectList } from "./components/dashboard/ProjectList";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-[#0F172A]">
          <Toaster position="top-center" reverseOrder={false} />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="projects" element={<ProjectList />} />
              <Route
                path="settings"
                element={
                  <div className="p-6">
                    <h2 className="mb-4">Settings</h2>
                    <p className="text-[#6B7280]">Settings page coming soon...</p>
                  </div>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
