import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { useEmployeeMutation } from "../queries/employeeQueries";
import type { CreateEmployeeData } from "../store/employeeSlice";
import type { Department } from "../types";
import { toggleSidebar } from "../store/sidebarSlice";
import { Menu } from "lucide-react";

export const CreateEmployee = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeData>();
  const navigate = useNavigate();
  const { departments } = useAppSelector((state) => state.departments);
  const employeeMutation = useEmployeeMutation();
  const RefTokenMutation = useLoginMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (employeeMutation.isError && employeeMutation.error.status == 401) {
      RefTokenMutation.mutate(
        { endpoint: "refreshaccesstoken", method: "POST" },
        {
          onError() {
            navigate("/login");
          },
        }
      );
    }
  }, [employeeMutation.isError, employeeMutation.error]);
  const onSubmit = (data: CreateEmployeeData) => {
    employeeMutation.mutate(
      { endpoint: "create", method: "POST", data },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };
  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="md:text-3xl text-2xl font-bold text-slate-900 mb-2">
          Create Employee
        </h1>
        <Menu
          className="mt-2 md:hidden"
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Username
          </label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Employee Code
          </label>
          <input
            type="text"
            {...register("employeeCode", {
              required: "Employee code is required",
            })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter employee code"
          />
          {errors.employeeCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.employeeCode.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Department
          </label>
          <select
            {...register("department", {
              required: "Department is required",
            })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept: Department) => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentName} ({dept.departmentCode})
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">
              {errors.department.message}
            </p>
          )}
        </div>
        {employeeMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {employeeMutation.error.message}
            </p>
          </div>
        )}
        {employeeMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              Employee created successfully
            </p>
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={employeeMutation.isPending}
            className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {employeeMutation.isPending ? "Adding..." : "Add Employee"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/employees");
              reset();
            }}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
