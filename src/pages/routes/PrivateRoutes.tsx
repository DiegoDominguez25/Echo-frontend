// PrivateRoutes.tsx (CÓDIGO CORREGIDO)
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Routes, Route } from "react-router-dom";
import WSTBySituation from "@/pages/dashboard/WSTBySituation";
import ResourceView from "@/pages/dashboard/ResourceView";

function PrivateRoutes() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Routes>
      <Route path="/wstbysituation" element={<WSTBySituation />} />
      <Route path="/resources/:type/:resource_uid" element={<ResourceView />} />
    </Routes>
  );
}

export default PrivateRoutes;
