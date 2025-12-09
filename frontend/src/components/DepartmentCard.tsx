import { Building2, Hash, Trash2, User } from "lucide-react";
import { type ReactNode } from "react";
import type { Department, User as UserType } from "../types";
export type IsAssignEnable = {
  isEnable: boolean;
  id: string;
  employeeId: string;
  employees?: boolean;
};
type DepartmentCardProps = {
  department: Department;
  handleDelete: (id: string) => void;
  assignManager: (id: string, departmentId: string) => void;
  getManagerName: (manager: string | UserType | undefined) => ReactNode;
  isAssignEnable: IsAssignEnable;
  setIsAssignEnable: ({
    employeeId,
    id,
    isEnable,
    employees,
  }: IsAssignEnable) => void;
  employees: UserType[];
};
export const DepartmentCard = ({
  department,
  handleDelete,
  assignManager,
  getManagerName,
  isAssignEnable,
  setIsAssignEnable,
  employees,
}: DepartmentCardProps) => {
  return (
    <div
      key={department._id}
      className="bg-white md:p-6 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {department.departmentName}
              </h3>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600 md:ml-15 w-full">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>Code: {department.departmentCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                Manager: {getManagerName(department.departmentManager)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {!isAssignEnable.employees &&
            isAssignEnable.isEnable &&
            isAssignEnable.id == department._id && (
              <div className="text-red-500">No employees in the department</div>
            )}
          {isAssignEnable.isEnable &&
          isAssignEnable.employees &&
          isAssignEnable.id == department._id ? (
            <div className="md:flex-row flex-col flex gap-2">
              <select
                name="employees"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                title="select manager"
                value={isAssignEnable.employeeId}
                onChange={(e) => {
                  setIsAssignEnable({
                    id: department._id,
                    employeeId: e.target.value,
                    isEnable: true,
                    employees: true,
                  });
                }}
              >
                {employees
                  .filter(
                    (e) =>
                      typeof e.department == "object" &&
                      e.department._id == department._id
                  )
                  .map((employee) => (
                    <option value={employee._id} key={employee._id}>
                      {employee.username} {employee.employeeCode}
                    </option>
                  ))}
              </select>
              <div className="flex gap-2 items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    assignManager(isAssignEnable.employeeId, department._id);
                    setIsAssignEnable({
                      isEnable: false,
                      id: "",
                      employeeId: "",
                    });
                  }}
                  className="p-2 px-4 text-black bg-slate-300 hover:bg-slate-500 rounded-lg transition-colors cursor-pointer font-semibold text-sm md:text-[12pt]"
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setIsAssignEnable({
                      isEnable: false,
                      id: "",
                      employeeId: "",
                    })
                  }
                  className="p-2 px-4 text-black bg-red-400 hover:bg-red-500 rounded-lg transition-colors cursor-pointer font-semibold text-sm md:text-[12pt]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex">
              <button
                onClick={() => {
                  const emp = employees.filter(
                    (e) =>
                      typeof e.department == "object" &&
                      e.department._id == department._id
                  );
                  setIsAssignEnable({
                    isEnable: true,
                    id: department._id,
                    employeeId: emp.length > 0 ? emp[0]._id : "",
                    employees: emp.length > 0 ? true : false,
                  });
                }}
                className="p-2 md:px-4 text-black bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer font-semibold text-sm md:text-[12pt]"
              >
                Assign manager
              </button>
              <button
                onClick={() => handleDelete(department._id)}
                className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
