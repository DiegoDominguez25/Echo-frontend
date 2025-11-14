import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/images/logo.png";
import profileMock from "@/assets/images/profileMock.png";
import flag from "@/assets/images/american-flag.png";
import { FiLogOut } from "react-icons/fi";

function AppHeader() {
  const { user, profile, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login/");
    setIsDropdownOpen(false);
  };

  const profilePic =
    profile &&
    profile.profile_picture &&
    profile.profile_picture !== "default.png"
      ? profile.profile_picture
      : profileMock;

  const displayName = profile?.username || user?.name || "User";

  return (
    <div>
      <header className="bg-white text-black py-4 px-8">
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <img
              src={logo}
              alt="Echo - English Practice"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="justify-self-center relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-12 w-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <img
                src={profilePic}
                alt="Profile picture"
                className="h-full w-full object-cover"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg left-1/2 -translate-x-1/2">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Welcome,</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayName}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 mt-1 text-sm text-red-700 rounded-md hover:bg-red-50"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="justify-self-end">
            <div className="flex items-center gap-2">
              <img
                src={flag}
                alt="Select language"
                className="h-8 w-auto object-contain"
              />
              <a className="font-bold relative pr-5" href="#">
                EN
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default AppHeader;
