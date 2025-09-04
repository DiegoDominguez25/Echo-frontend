import logo from "@/assets/images/logo.png";
import profileMock from "@/assets/images/profileMock.png";
import flag from "@/assets/images/american-flag.png";

function AppHeader() {
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

          <div className="justify-self-center">
            <a href="#">
              <img
                src={profileMock}
                alt="Profile picture"
                className="h-12 w-auto object-cover rounded-full"
              />
            </a>
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
