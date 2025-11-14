import { Routes, Route, Navigate } from "react-router-dom";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default PublicRoutes;
