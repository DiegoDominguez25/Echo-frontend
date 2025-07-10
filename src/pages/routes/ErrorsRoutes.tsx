import { Routes, Route } from "react-router-dom";
import { NotFound, Unauthorized } from "@/pages/errors";

function ErrorsRoutes() {
  return (
    <Routes>
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default ErrorsRoutes;
