import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { userService } from "@/services/api/user/userService";
import { useAuth } from "@/hooks/useAuth";
import type { UserApplicationPayload } from "@/data/interfaces/UserData";
import { FiCalendar, FiUser, FiUsers } from "react-icons/fi";
import work from "@/assets/images/work.png";

const RegisterStepTwo: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { userId } = useParams<{ userId: string }>();

  const location = useLocation();
  const { email, name } = location.state || {};

  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!userId || !email || !name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600">
            Error: No data provided for registration.
          </p>
          <p>
            Please,{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              start over
            </a>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const now = new Date().toISOString();

    try {
      const payload: UserApplicationPayload = {
        user_uid: userId,
        username: username,
        date_of_birth: new Date(dateOfBirth).toISOString(),
        gender: Number(gender),
        profile_picture: "default.png",
        last_login: now,
        creation_date: now,
      };

      const response = await userService.createUserApplication(payload);

      const final_doc_id = response.data.doc_id;

      if (!final_doc_id) {
        throw new Error("No final document ID received.");
      }

      login({
        id: userId,
      });

      navigate("/app/wstbysituation/");
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Error completing profile.";

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
    <div className="flex justify-around min-h-screen bg-gray-50">
      <div className="flex items-center">
        <img src={work} className="object-contain h-1/2 w-auto" />
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Complete Your Profile
            <span className="block text-xl font-normal text-gray-500">
              (Step 2 of 2)
            </span>
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative mt-1">
                <FiUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9] focus:ring-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <div className="relative mt-1">
                <FiCalendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="dateOfBirth"
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9] focus:ring-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <div className="relative mt-1">
                <FiUsers className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  id="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(Number(e.target.value))}
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-[#8BA1E9] focus:border-[#8BA1E9] focus:ring-1"
                >
                  <option value={0}>Prefer not to say</option>
                  <option value={1}>Female</option>
                  <option value={2}>Male</option>
                  <option value={3}>Other</option>
                </select>
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
                {loading ? "Saving..." : "Finish and Enter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStepTwo;
