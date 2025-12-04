import { Building2, Hash, Menu, Plus, Trash2, User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import {
  useDepartmentMutation,
  useDepartmentQuery,
} from "../queries/departmentQueries";
import { getDepartment } from "../store/departmentSlice";
import type { Department, User as UserType } from "../types";
import { toggleSidebar } from "../store/sidebarSlice";

export const Departments = () => {
  const {
    data: departmentsData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useDepartmentQuery();
  const { employees } = useAppSelector((state) => state.employees);
  const { departments } = useAppSelector((state) => state.departments);
  const departmentMutation = useDepartmentMutation();

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
      dispatch(getDepartment(departmentsData));
    }
  }, [isSuccess, departmentsData]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      departmentMutation.mutate({ endpoint: `delete/${id}`, method: "DELETE" });
    }
  };

  const getManagerName = (manager: string | UserType | undefined) => {
    if (!manager) return "N/A";
    if (typeof manager === "object") return manager.username;
    const employee = employees.find((e: UserType) => e._id === manager);
    return employee?.username || "N/A";
  };

  return (
    <div className="md:p-8 p-5">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Departments
          </h1>
          <p className="text-slate-600">
            Organize your workforce by departments
          </p>
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
          onClick={() => navigate("/dashboard/departments/create")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Department
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-600">
          Loading departments...
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No departments found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {departments.map((department: Department) => (
            <div
              key={department._id}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
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
                  <div className="space-y-2 text-sm text-slate-600 ml-15">
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
                <button
                  onClick={() => handleDelete(department._id)}
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
