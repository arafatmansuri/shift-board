import { Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../hooks/useMediaQuery";
export const Navbar = () => {
  const isDesktop: boolean = useMediaQuery("(min-width:768px)");
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-sm max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
      <div className="flex justify-between items-center h-16 gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate("/")}>
          <Calendar className="md:w-8 md:h-8 text-slate-700" />
          <span className="md:text-xl font-semibold text-slate-800">
            ShiftBoard
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            to="/register"
            className="md:px-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors px-4 py-2"
          >
            Register {isDesktop && "your company"}
          </Link>
          <Link
            to="/login"
            className="md:px-6 py-2 border border-slate-300 bg-slate-200 text-slate-900 font-medium rounded-lg hover:bg-slate-300 transition-colors cursor-pointer px-4"
            // className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            Login
          </Link>
        </div>
      </div>
      {/* </div> */}
    </nav>
  );
};
