import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "@/services/api/user/userService";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/images/logo.png";
import { FiLock, FiMail } from "react-icons/fi";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const loginResponse = await userService.login({ email, password });
      const { user_id, access_token } = loginResponse.data;

      if (!user_id || !access_token) {
        throw new Error("Login response incomplete. Missing ID or Token.");
      }

      localStorage.setItem("token", access_token);

      const accountResponse = await userService.getUserApplication(user_id);
      const accountData = accountResponse.data;

      const authUserData = {
        id: user_id,
        name: accountData.username,
      };

      login(authUserData, access_token);

      console.log("LoginPage: 'login(context)' llamado con:", authUserData);

      navigate("/app/wstbysituation");
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Error during login, please check your credentials.";

      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { detail?: string } } })
          .response;
        if (response?.data?.detail) {
          errorMessage = response.data.detail;
        }
      }

      localStorage.removeItem("token");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-around">
      <div className="flex items-center justify-center w-full p-8 bg-white lg:w-1/2">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Login
          </h2>

          <div className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?
            <Link
              to="/auth/register"
              className="font-medium text-[#8BA1E9] hover:text-blue-600"
            >
              Register here
            </Link>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9]"
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-[#8BA1E9] border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BA1E9] disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:flex lg:w-1/2 justify-center items-center bg-gray-100/50 w-full min-h-screen">
        <img src={logo} className="h-22 w-auto object-contain" alt="Logo" />
      </div>
    </div>
  );
};

export default Login;
