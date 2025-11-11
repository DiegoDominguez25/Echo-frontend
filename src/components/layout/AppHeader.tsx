import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/images/logo.png";
import profileMock from "@/assets/images/profileMock.png";
import flag from "@/assets/images/american-flag.png";
import { FiLogOut } from "react-icons/fi";
import type { UserApplicationData } from "@/data/interfaces/UserData";
import { userService } from "@/services/api/user/userService";

function AppHeader() {
  const { user, loading: authLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<UserApplicationData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { logout } = useAuth();
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

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await userService.getUserApplication(user.id);
        setProfile(response.data);
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, authLoading]);
  if (authLoading || profileLoading) {
    return <div>Loading profile...</div>;
  }

  if (!user || !profile) {
    return <div>Error loading user data.</div>;
  }
  const handleLogout = () => {
    logout();
    navigate("/auth/login/");
    setIsDropdownOpen(false);
  };

  const profilePic = profileMock;

  return (
    <div>
      <header className="bg-white text-black p-4">
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
                      {profile.username}
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
              <a className="font-bold relative py-2.5" href="#">
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
