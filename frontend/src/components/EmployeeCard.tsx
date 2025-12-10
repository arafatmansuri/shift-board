import { Hash, Mail, Trash2, UsersIcon } from "lucide-react";
import type { Department } from "../types";
type EmployeeCardProps = {
  name: string;
  email: string;
  code?: string;
  department?: string | Department;
  id: string;
  role: string;
  handleDelete: (id: string) => void;
  getDepartmentName: (dept: string | Department | undefined) => string;
};
export const EmployeeCard = ({
  code,
  department,
  email,
  getDepartmentName,
  handleDelete,
  id,
  name,
  role,
}: EmployeeCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                {role}
              </span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600 ml-15">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>Code: {code || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              <span>Department: {getDepartmentName(department)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleDelete(id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
