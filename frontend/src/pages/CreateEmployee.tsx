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
import { useDepartmentQuery } from "../queries/departmentQueries";
import { useEmployeeMutation } from "../queries/employeeQueries";
import { getDepartment } from "../store/departmentSlice";
import {
  createEmployee,
  type CreateEmployeeData,
} from "../store/employeeSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import type { User } from "../types";
import { setCredentials } from "../store/userSlice";

export const CreateEmployee = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeData>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const { departments } = useAppSelector((state) => state.departments);
  const departmentQuery = useDepartmentQuery(
    typeof user?.company == "object" ? user.company._id : ""
  );
  const employeeMutation = useEmployeeMutation<User>();
  const RefTokenMutation = useLoginMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (departmentQuery.isError && departmentQuery.error.status == 401) {
      RefTokenMutation.mutate(
        { endpoint: "refreshaccesstoken", method: "POST" },
        {
          onError() {
            dispatch(setCredentials({user:null,isAuthorized:false}))
            navigate("/login");
          },
        }
      );
    }
  }, [departmentQuery.isError, departmentQuery.error]);
  useEffect(() => {
    if (departmentQuery.isSuccess) {
      dispatch(getDepartment(departmentQuery.data));
    }
  }, [departmentQuery.isSuccess]);
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
  useEffect(() => {
    if (employeeMutation.isSuccess) {
      dispatch(createEmployee(employeeMutation.data));
    }
  }, [employeeMutation.isSuccess]);
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
        <Input
          isError={errors.username ? true : false}
          label={"Username"}
          placeholder="Enter username"
          errorMessage={errors.username && errors.username.message}
          formHook={{
            ...register("username", { required: "Username is required" }),
          }}
        />
        <Input
          isError={errors.email ? true : false}
          label={"Email"}
          placeholder="Enter email"
          errorMessage={errors.email && errors.email.message}
          formHook={{
            ...register("email", { required: "Email is required" }),
          }}
        />
        <Input
          isError={errors.password ? true : false}
          label={"Password"}
          placeholder="Enter password"
          errorMessage={errors.password && errors.password.message}
          formHook={{
            ...register("password", { required: "Password is required" }),
          }}
        />
        <Input
          isError={errors.employeeCode ? true : false}
          label={"Employee code"}
          placeholder="Enter employee code"
          errorMessage={errors.employeeCode && errors.employeeCode.message}
          formHook={{
            ...register("employeeCode", {
              required: "Employee code is required",
            }),
          }}
        />

        <Select
          isError={errors.department ? true : false}
          label={"Department"}
          errorMessage={errors.department && errors.department.message}
          formHook={{
            ...register("department", {
              required: "Department is required",
            }),
          }}
          options={departments.map((d) => ({
            value: d._id,
            text: `${d.departmentName} (${d.departmentCode})`,
          }))}
        />
        {employeeMutation.isError && (
          <Box message={employeeMutation.error.message} type="error" />
        )}
        {employeeMutation.isSuccess && (
          <Box message={"Employee created successfully"} type="success" />
        )}
        <div className="flex gap-3 pt-4">
          <Button
            text={employeeMutation.isPending ? "Adding..." : "Add Employee"}
            varient="primary"
            isDisabled={employeeMutation.isPending}
            type="submit"
            classes="font-normal flex-1"
          />
          <Button
            text={"Cancel"}
            varient="secondary"
            type="reset"
            onClick={() => {
              navigate("/dashboard/employees");
              reset();
            }}
          />
        </div>
      </form>
    </div>
  );
};
