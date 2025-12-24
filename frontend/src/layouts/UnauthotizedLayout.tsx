import { Outlet } from "react-router";
import { Footer } from "../components/footer";
import { Navbar } from "../components/Navbar";

const UnauthorizedLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UnauthorizedLayout;
