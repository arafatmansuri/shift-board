import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { useDepartmentMutation } from "../queries/departmentQueries";
import type { CreateDepartmentData } from "../store/departmentSlice";
import { toggleSidebar } from "../store/sidebarSlice";

export const CreateDepartment = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentData>();
  const navigate = useNavigate();
  const departmentMutation = useDepartmentMutation();
  const RefTokenMutation = useLoginMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (departmentMutation.isError && departmentMutation.error.status == 401) {
      RefTokenMutation.mutate(
        { endpoint: "refreshaccesstoken", method: "POST" },
        {
          onError() {
            navigate("/login");
          },
        }
      );
    }
  }, [departmentMutation.isError, departmentMutation.error]);
  const onSubmit = (data: CreateDepartmentData) => {
    departmentMutation.mutate(
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
          Create Department
        </h1>
        <Menu
          className="mt-2 md:hidden"
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Department Name
          </label>
          <input
            type="text"
            {...register("departmentName", {
              required: "Department name is required",
            })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter department name"
          />
          {errors.departmentName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departmentName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Department Code
          </label>
          <input
            type="text"
            {...register("departmentCode", {
              required: "Department code is required",
            })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter department code"
          />
          {errors.departmentCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departmentCode.message}
            </p>
          )}
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Department Manager
          </label>
          <select
            {...register("departmentManager", {
              required: "Manager is required",
            })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">Select Manager</option>
            {employees.map((emp: User) => (
              <option key={emp._id} value={emp._id}>
                {emp.username} ({emp.employeeCode})
              </option>
            ))}
          </select>
          {errors.departmentManager && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departmentManager.message}
            </p>
          )}
        </div> */}
        {departmentMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {departmentMutation.error.message}
            </p>
          </div>
        )}
        {departmentMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              Department created successfully
            </p>
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={departmentMutation.isPending}
            className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {departmentMutation.isPending ? "Creating..." : "Create Department"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/departments");
              reset();
            }}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
