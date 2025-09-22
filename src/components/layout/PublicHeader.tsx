import logo from "@/assets/images/logo.png";

function PublicHeader() {
  return (
    <div>
      <header className="bg-white text-black p-4 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Echo - English Practice"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="flex items-center space-x-4">
          <a className="font-bold relative py-2.5" href="#">
            Login
            <span className="absolute bottom-1 left-0 w-1/2 h-1 bg-black"></span>
          </a>
          <button className="w-full h-full py-2.5 px-5 bg-[#8BA1E9] text-white font-bold rounded-2xl">
            Sign Up
          </button>
        </div>
      </header>
    </div>
  );
}

export default PublicHeader;
