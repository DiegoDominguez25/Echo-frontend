import AppHeader from "./AppHeader";
import Footer from "./Footer";
import PublicHeader from "./PublicHeader";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const isAuthenticated = true;
  return (
    <div className="min-h-screen w-full flex flex-col">
      {isAuthenticated ? <AppHeader /> : <PublicHeader />}

      <main className="flex-1 w-full min-h-0">
        <div className="w-full h-full">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
