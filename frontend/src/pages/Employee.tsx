import { Hash, Mail, Menu, Plus, Trash2, Users as UsersIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import {
  useEmployeeMutation,
  useEmployeeQuery,
} from "../queries/employeeQueries";
import { getEmployee } from "../store/employeeSlice";
import { type Department, type User } from "../types";
import { toggleSidebar } from "../store/sidebarSlice";

export const Employees = () => {
  const { user } = useAppSelector((state) => state.user);
  const {
    data: employeesData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useEmployeeQuery(
    typeof user?.company == "object" ? user.company._id : ""
  );
  const employeeMutation = useEmployeeMutation();
  const { employees } = useAppSelector((state) => state.employees);
  const { departments } = useAppSelector((state) => state.departments);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const RefTokenMutation = useLoginMutation();
  useEffect(() => {
    if (isError && error.status == 401) {
      RefTokenMutation.mutate(
        { endpoint: "refreshaccesstoken", method: "POST" },
        {
          onError: () => {
            navigate("/login");
          },
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  }, [isError, error]);
  useEffect(() => {
    if (isSuccess) {
      dispatch(getEmployee(employeesData));
    }
  }, [isSuccess, employeesData]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      employeeMutation.mutate({ endpoint: `delete/${id}`, method: "DELETE" });
    }
  };

  const getDepartmentName = (dept: string | Department | undefined) => {
    if (!dept) return "N/A";
    if (typeof dept === "object") return dept.departmentName;
    const department = departments.find((d: Department) => d._id === dept);
    return department?.departmentName || "N/A";
  };

  return (
    <div className="md:p-8 p-4">
      <div className="mb-8 flex justify-between">
        <div className="">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Employees</h1>
          <p className="text-slate-600">Manage your workforce</p>
        </div>
        <Menu
          className="mt-2 md:hidden"
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        />
      </div>

      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard/employees/create")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-600">
          Loading employees...
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No employees found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.map((employee: User) => (
            <div
              key={employee._id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {employee.username}
                      </h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                        {employee.role}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 ml-15">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span>Code: {employee.employeeCode || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" />
                      <span>
                        Department: {getDepartmentName(employee.department)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
