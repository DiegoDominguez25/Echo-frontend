import { Routes, Route } from "react-router-dom";
import { Dashboard, WSTBySituation } from "@/pages/dashboard";
import ResourcesView from "../dashboard/ResourceView";

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/wstbysituation" element={<WSTBySituation />} />
      <Route
        path="/resources/:type/:resource_uid"
        element={<ResourcesView />}
      />
    </Routes>
  );
}

export default PrivateRoutes;
