import { useAuth } from "@/hooks/useAuth";
import { Navigate, Routes, Route } from "react-router-dom";
import { Login, Register } from "@/pages/auth";
import RegisterStepTwo from "@/components/auth/RegisterStepTwo";

function AuthRoutes() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/wstbysituation" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/complete-profile/:userId" element={<RegisterStepTwo />} />
    </Routes>
  );
}

export default AuthRoutes;
