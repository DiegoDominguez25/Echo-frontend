import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div>
        <Header />
      </div>

      <main className="flex-grow">{children}</main>

      <div className="">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
