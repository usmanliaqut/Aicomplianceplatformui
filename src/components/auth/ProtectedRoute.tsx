import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { me } = useAuth();
  const location = useLocation();

  const hasToken = !!localStorage.getItem("token");

  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (me.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-[#6B7280]">
        Checking session...
      </div>
    );
  }

  if (me.isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
