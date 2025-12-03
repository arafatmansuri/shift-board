import {
  Building2,
  Calendar,
  LogOut,
  MoreVertical,
  User,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { toggleSidebar } from "../store/sidebarSlice";
import { logout } from "../store/userSlice";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.user);
  const logoutMutation = useLoginMutation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    logoutMutation.mutate(
      { endpoint: "logout", method: "POST" },
      {
        onSuccess() {
          navigate("/login");
          dispatch(logout());
        },
      }
    );
  };
  const sidebar = useAppSelector((state) => state.sidebar);
  return (
    <div
      className={`w-64 bg-white border-r border-slate-200 md:flex flex-col h-screen ${
        sidebar ? "flex fixed right-0" : "md:hidden"
      }`}
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-slate-700" />
            <h1 className="text-xl font-bold text-slate-900">ShiftBoard</h1>
          </div>
          <X
            className="mt-1 md:hidden"
            onClick={() => {
              dispatch(toggleSidebar());
            }}
          />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/dashboard/shifts"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/dashboard/shifts") ||
            isActive("/dashboard/shifts/create")
              ? "bg-slate-100 text-slate-900 font-medium"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-5 h-5" />
          Shifts
        </Link>
        {user?.role === "admin" && (
          <>
            <Link
              to="/dashboard/employees"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard/employees")
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Users className="w-5 h-5" />
              Employees
            </Link>

            <Link
              to="/dashboard/departments"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard/departments")
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-5 h-5" />
              Departments
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="relative">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1 hover:bg-slate-200 rounded"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {showProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
