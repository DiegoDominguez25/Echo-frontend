import { Routes, Route } from "react-router-dom";
import { Login, Register } from "@/pages/auth";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AuthRoutes;
