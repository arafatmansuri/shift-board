import { Building2, Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DepartmentCard } from "../components/DepartmentCard";
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
import { Button } from "../components/Button";
import { setCredentials } from "../store/userSlice";
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
            dispatch(setCredentials({user:null,isAuthorized:false}))
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
        <Button
          text="Create Department"
          varient="primary"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate("/dashboard/departments/create")}
        />
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
            <DepartmentCard
              assignManager={assignManager}
              department={department}
              employees={employees}
              getManagerName={getManagerName}
              handleDelete={handleDelete}
              isAssignEnable={isAssignEnable}
              setIsAssignEnable={setIsAssignEnable}
              key={department._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
