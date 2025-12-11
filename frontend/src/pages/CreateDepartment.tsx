import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Box } from "../components/ErrorSuccessBox";
import Input from "../components/Input";
import { useAppDispatch } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { useDepartmentMutation } from "../queries/departmentQueries";
import type { CreateDepartmentData } from "../store/departmentSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import { setCredentials } from "../store/userSlice";

export const CreateDepartment = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentData>();
  const navigate = useNavigate();
  // const {employees} = useAppSelector(state=>state.employees);
  const departmentMutation = useDepartmentMutation();
  const RefTokenMutation = useLoginMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (departmentMutation.isError && departmentMutation.error.status == 401) {
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
        <Input
          isError={errors.departmentName ? true : false}
          label={"Department name"}
          placeholder="Enter department name"
          errorMessage={errors.departmentName && errors.departmentName.message}
          formHook={{
            ...register("departmentName", {
              required: "Department name is required",
            }),
          }}
        />
        <Input
          isError={errors.departmentCode ? true : false}
          label={"Department Code"}
          placeholder="Enter department code"
          errorMessage={errors.departmentCode && errors.departmentCode.message}
          formHook={{
            ...register("departmentCode", {
              required: "Department code is required",
            }),
          }}
        />
        {/* <Select
          isError={errors.departmentManager ? true : false}
          label={"Department manager"}
          errorMessage={errors.departmentManager && errors.departmentManager.message}
          formHook={{
            ...register("departmentManager", {
              required: "Department manager is required",
            }),
          }}
          options={employees.map((e) => ({
            value: e._id,
            text: `${e.username} (${e.employeeCode})`,
          }))}
        /> */}
        {departmentMutation.isError && (
          <Box message={departmentMutation.error.message} type="error" />
        )}
        {departmentMutation.isSuccess && (
          <Box message={"Department created successfully"} type="success" />
        )}
        <div className="flex gap-3 pt-4">
          <Button
            text={
              departmentMutation.isPending ? "Creating..." : "Create Department"
            }
            varient="primary"
            isDisabled={departmentMutation.isPending}
            type="submit"
            classes="font-normal flex-1"
          />
          <Button
            text={"Cancel"}
            varient="secondary"
            type="reset"
            onClick={() => {
              navigate("/dashboard/departments");
              reset();
            }}
          />
        </div>
      </form>
    </div>
  );
};
