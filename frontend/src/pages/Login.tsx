import { ArrowLeft, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Box } from "../components/ErrorSuccessBox";
import Input from "../components/Input";
import { useAppDispatch } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { setCredentials } from "../store/userSlice";
import type { LoginRequest } from "../types";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();
  const loginMutation = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(
      { data, endpoint: "login", method: "POST" },
      {
        onSuccess(data) {
          dispatch(setCredentials({ user: data, isAuthorized: true }));
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 pt-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer self-start mb-3 -ml-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className="w-10 h-10 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">ShiftBoard</h1>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            Login to your account
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
              isError={errors["email"] ? true : false}
              label={"Email"}
              placeholder={"Enter your email"}
              errorMessage={errors.email && errors.email.message}
              formHook={{
                ...register("email", {
                  required: "Email is required",
                }),
              }}
              type={"email"}
            />
            <Input
              isError={errors["password"] ? true : false}
              label={"Password"}
              placeholder={"Enter your password"}
              errorMessage={errors.password && errors.password.message}
              formHook={{
                ...register("password", {
                  required: "Password is required",
                }),
              }}
              type="password"
            />

            {loginMutation.isError && (
              <Box type="error" message={loginMutation.error.message} />
            )}

            <Button
              isDisabled={loginMutation.isPending}
              type="submit"
              text={loginMutation.isPending ? "Logingin..." : "Login"}
              varient="primary"
              isWidthFull={true}
            />
          </form>

          <div className="mt-6 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 underline"
              // className="text-sm text-slate-600 hover:text-slate-900"
            >
              Register
            </Link>
          </div>
        </div>
        {/* <div className="mt-10 bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Demo Credentials:
          </h1>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Admin:
            </h2>
            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                email: hire-me@anshumat.org
              </p>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                password: HireMe@2025!
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Employee:
            </h2>
            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                email: employee1@gmail.com
              </p>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                password: User@123
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
