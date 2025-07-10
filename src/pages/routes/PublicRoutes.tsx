import { Routes, Route } from "react-router-dom";
import { Landing } from "@/pages/public";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default PublicRoutes;
