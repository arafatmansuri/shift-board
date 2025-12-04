import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { useShiftMutation } from "../queries/shiftQueries";
import { createShift } from "../store/shiftSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import type { Shift, User } from "../types";

export const CreateShift = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Shift>();
  const navigate = useNavigate();
  const { employees } = useAppSelector((state) => state.employees);
  const shiftMutation = useShiftMutation();
  const dispatch = useAppDispatch();
  const RefTokenMutation = useLoginMutation();
  useEffect(() => {
    if (shiftMutation.isError && shiftMutation.error.status == 401) {
      RefTokenMutation.mutate(
        { endpoint: "refreshaccesstoken", method: "POST" },
        {
          onError() {
            navigate("/login");
          },
        }
      );
    }
  }, [shiftMutation.isError, shiftMutation.error]);
  const onSubmit = (data: Shift) => {
    shiftMutation.mutate(
      { endpoint: "shifts", method: "POST", data },
      {
        onSuccess: () => {
          dispatch(createShift(data));
          reset();
        },
      }
    );
  };
  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="md:text-3xl text-2xl font-bold text-slate-900 mb-2">
          Create Shift
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
            Date
          </label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Start Time
          </label>
          <input
            type="time"
            {...register("startTime", {
              required: "Start time is required",
            })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            End Time
          </label>
          <input
            type="time"
            {...register("endTime", { required: "End time is required" })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.endTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Employee
          </label>
          <select
            {...register("employeeId", {
              required: "Employee is required",
            })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">Select Employee</option>
            {employees.map((emp: User) => (
              <option key={emp._id} value={emp._id}>
                {emp.username} ({emp.employeeCode})
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.employeeId.message}
            </p>
          )}
        </div>
        {shiftMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {shiftMutation.error.message}
            </p>
          </div>
        )}
        {shiftMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">Shift created successfully</p>
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={shiftMutation.isPending}
            className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {shiftMutation.isPending ? "Creating..." : "Create Shift"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/shifts");
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
