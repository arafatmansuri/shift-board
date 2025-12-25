import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const UnauthorizedLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="flex justify-center items-center p-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UnauthorizedLayout;
