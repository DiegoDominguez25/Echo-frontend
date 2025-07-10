import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "@pages/errors/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />

      <Route path="/auth/*" element={<AuthRoutes />} />

      <Route path="/app/*" element={<PrivateRoutes />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
