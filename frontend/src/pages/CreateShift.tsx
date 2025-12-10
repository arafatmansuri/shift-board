import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Box } from "../components/ErrorSuccessBox";
import Input from "../components/Input";
import Select from "../components/Select";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { useEmployeeQuery } from "../queries/employeeQueries";
import { useShiftMutation } from "../queries/shiftQueries";
import { getEmployee } from "../store/employeeSlice";
import { createShift } from "../store/shiftSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import type { Shift } from "../types";

export const CreateShift = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Shift>();
  const navigate = useNavigate();
  const { employees } = useAppSelector((state) => state.employees);
  const { user } = useAppSelector((state) => state.user);
  const employeesQuery = useEmployeeQuery(
    typeof user?.company == "object" ? user.company._id : ""
  );
  const shiftMutation = useShiftMutation();
  const dispatch = useAppDispatch();
  const RefTokenMutation = useLoginMutation();
  useEffect(() => {
    if (employeesQuery.isError && employeesQuery.error.status == 401) {
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
  useEffect(() => {
    if (employeesQuery.isSuccess) {
      dispatch(getEmployee(employeesQuery.data));
    }
  }, [employeesQuery.isSuccess]);
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
        <Input
          type="date"
          isError={errors.date ? true : false}
          label={"Shift date"}
          placeholder="Enter date"
          errorMessage={errors.date && errors.date.message}
          formHook={{
            ...register("date", { required: "Date is required" }),
          }}
        />
        <Input
          type="time"
          isError={errors.startTime ? true : false}
          label={"Start time"}
          placeholder="Enter start time"
          errorMessage={errors.startTime && errors.startTime.message}
          formHook={{
            ...register("startTime", { required: "Start time is required" }),
          }}
        />
        <Input
          type="time"
          isError={errors.endTime ? true : false}
          label={"End time"}
          placeholder="Enter end time"
          errorMessage={errors.endTime && errors.endTime.message}
          formHook={{
            ...register("endTime", { required: "End time is required" }),
          }}
        />
        <Select
          isError={errors.employeeId ? true : false}
          label={"Employee"}
          errorMessage={errors.employeeId && errors.employeeId.message}
          formHook={{
            ...register("employeeId", {
              required: "Employee is required",
            }),
          }}
          options={employees.map((e) => ({
            value: e._id,
            text: `${e.username} (${e.employeeCode})`,
          }))}
        />
        {shiftMutation.isError && (
          <Box message={shiftMutation.error.message} type="error" />
        )}
        {shiftMutation.isSuccess && (
          <Box message={"Shift created successfully"} type="success" />
        )}
        <div className="flex gap-3 pt-4">
          <Button
            text={shiftMutation.isPending ? "Creating..." : "Create Shift"}
            varient="primary"
            isDisabled={shiftMutation.isPending}
            type="submit"
            classes="font-normal flex-1"
          />
          <Button
            text={"Cancel"}
            varient="secondary"
            type="reset"
            onClick={() => {
              navigate("/dashboard/shifts");
              reset();
            }}
          />
        </div>
      </form>
    </div>
  );
};
