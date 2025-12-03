import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
// import { useLogin } from "../hooks/useAuth";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className="w-10 h-10 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">ShiftBoard</h1>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                {...register("username", {
                  required: "Username or email is required",
                })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Enter your username or email"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {loginMutation.error.message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
