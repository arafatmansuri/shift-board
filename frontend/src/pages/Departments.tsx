import { Building2, Hash, Menu, Plus, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import {
  useDepartmentMutation,
  useDepartmentQuery,
} from "../queries/departmentQueries";
import { useEmployeeMutation } from "../queries/employeeQueries";
import { getDepartment } from "../store/departmentSlice";
import { getEmployee } from "../store/employeeSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import type { Department, User as UserType } from "../types";
export const Departments = () => {
  const { user } = useAppSelector((state) => state.user);
  const [isAssignEnable, setIsAssignEnable] = useState<{
    isEnable: boolean;
    id: string;
    employeeId: string;
    employees?: boolean;
  }>({ isEnable: false, id: "", employeeId: "", employees: true });
  const {
    data: departmentsData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useDepartmentQuery(
    typeof user?.company == "object" ? user.company._id : ""
  );
  const { employees } = useAppSelector((state) => state.employees);
  const { departments } = useAppSelector((state) => state.departments);
  const departmentMutation = useDepartmentMutation();
  const employeeMutation = useEmployeeMutation<UserType[]>();

  useEffect(() => {
    if (departments.length > 0) {
      employeeMutation.mutate({
        endpoint: `view/${
          typeof user?.company == "object" ? user.company._id : ""
        }`,
        method: "GET",
      });
    }
  }, [departments]);
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
  useEffect(() => {
    if (employeeMutation.isSuccess) {
      dispatch(getEmployee(employeeMutation.data));
    }
  }, [employeeMutation.isSuccess, employeeMutation.data]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      departmentMutation.mutate({ endpoint: `delete/${id}`, method: "DELETE" });
    }
  };
  const assignManager = (id: string, departmentId: string) => {
    departmentMutation.mutate({
      endpoint: `assign/${departmentId}`,
      method: "PUT",
      data: { departmentManager: id, departmentCode: "", departmentName: "" },
    });
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
                    isAssignEnable.id == department._id && (
                      <div className="text-red-500">
                        No employees in the department
                      </div>
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
                            assignManager(
                              isAssignEnable.employeeId,
                              department._id
                            );
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
          ))}
        </div>
      )}
    </div>
  );
};
