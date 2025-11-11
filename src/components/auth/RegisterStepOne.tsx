import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "@/services/api/user/userService";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import landing from "@/assets/images/landing.png";

const RegisterStepOne: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await userService.createAccount({
        name,
        email,
        password,
      });
      console.log("RESPUESTA REAL DE LA API:", response.data);
      const tempUserId = response.data.doc_id;

      if (!tempUserId) {
        throw new Error("No se recibió el ID de documento del Paso 1.");
      }

      navigate(`/auth/complete-profile/${tempUserId}`, {
        state: { email, name },
      });
    } catch (err: unknown) {
      console.error(err);

      let errorMessage = "Create account error.";

      if (typeof err === "object" && err !== null && "response" in err) {
        const errorResponse = (
          err as { response?: { data?: { message?: string } } }
        ).response;

        if (
          errorResponse?.data?.message &&
          typeof errorResponse.data.message === "string"
        ) {
          errorMessage = errorResponse.data.message;
        }
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 justify-around">
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create your account
          </h2>

          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-[#8BA1E9] hover:text-blue-600"
            >
              Log in here
            </Link>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="relative mt-1">
                <FiUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9] focus:ring-1"
                />
              </div>
            </div>

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
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9] focus:ring-1"
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
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9] focus:ring-1"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md border border-transparent bg-[#8BA1E9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#8BA1E9] focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-center lg:w-1/2">
        <img src={landing} className="object-contain h-1/2 w-auto" />
      </div>
    </div>
  );
};

export default RegisterStepOne;
