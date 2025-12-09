import { Calendar } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Box } from "../components/ErrorSuccessBox";
import Input from "../components/Input";
import { useAppDispatch } from "../hooks";
import { useCompanyMutation } from "../queries/companyQueries";
import { setCredentials } from "../store/userSlice";
import type { Company } from "../types";

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Company>();
  const companyMutation = useCompanyMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = (data: Company) => {
    companyMutation.mutate({ data, endpoint: "create", method: "POST" });
  };
  useEffect(() => {
    if (companyMutation.isSuccess) {
      dispatch(
        setCredentials({
          user: companyMutation.data || null,
          isAuthorized: true,
        })
      );
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }, [companyMutation.isSuccess]);
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Calendar className="w-10 h-10 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">ShiftBoard</h1>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            Register your company
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              isError={errors["companyName"] ? true : false}
              label={"Company name"}
              placeholder={"Enter your company name"}
              errorMessage={errors.companyName && errors.companyName.message}
              formHook={{
                ...register("companyName", {
                  required: "Company name is required",
                }),
              }}
            />
            <Input
              isError={errors["companyEmail"] ? true : false}
              label={"Email"}
              placeholder={"Enter your email"}
              errorMessage={errors.companyEmail && errors.companyEmail.message}
              formHook={{
                ...register("companyEmail", {
                  required: "Company email is required",
                }),
              }}
              type={"email"}
            />
            <Input
              isError={errors["companyPassword"] ? true : false}
              label={"Password"}
              placeholder={"Enter your password"}
              errorMessage={
                errors.companyPassword && errors.companyPassword.message
              }
              formHook={{
                ...register("companyPassword", {
                  required: "Password is required",
                }),
              }}
              type="password"
            />
            <Input
              isError={errors["companySize"] ? true : false}
              label={"Company size"}
              placeholder={"Enter your company size"}
              errorMessage={errors.companySize && errors.companySize.message}
              formHook={{ ...register("companySize", { valueAsNumber: true }) }}
              type="number"
            />

            {companyMutation.isError && (
              <Box message={companyMutation.error.message} type="error" />
            )}
            {companyMutation.isSuccess && (
              <Box message={"Company registered successfully"} type="success" />
            )}
            <Button
              isDisabled={companyMutation.isPending}
              type="submit"
              text={companyMutation.isPending ? "Registering..." : "Register"}
              varient="primary"
              isWidthFull={true}
            />
          </form>

          <div className="mt-6 text-center">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-blue-500 underline"
              // className="text-sm text-slate-600 hover:text-slate-900"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
