import { Routes, Route } from "react-router-dom";
import { Login } from "@/pages/auth";
import RegisterStepTwo from "@/components/auth/RegisterStepTwo";
import RegisterStepOne from "@/components/auth/RegisterStepOne";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterStepOne />} />

      <Route path="/complete-profile/:userId" element={<RegisterStepTwo />} />
    </Routes>
  );
}

export default AuthRoutes;
