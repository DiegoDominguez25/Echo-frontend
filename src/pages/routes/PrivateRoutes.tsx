import { Routes, Route } from "react-router-dom";
import { Dashboard, WSTBySituation } from "@/pages/dashboard";

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/wstbysituation" element={<WSTBySituation />} />
    </Routes>
  );
}

export default PrivateRoutes;
