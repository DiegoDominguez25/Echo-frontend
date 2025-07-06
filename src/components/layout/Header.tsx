function Header() {
  return (
    <>
      <header className="bg-gray-800 text-white p-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold">Echo</h1>
        <nav className="mt-2">
          <ul className="flex space-x-4 justify-center">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
