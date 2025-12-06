import { Calendar } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
    dispatch(
      setCredentials({ user: companyMutation.data || null, isAuthorized: true })
    );
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company name
              </label>
              <input
                type="text"
                {...register("companyName", {
                  required: "Company name is required",
                })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("companyEmail", {
                  required: "Email is required",
                })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Enter your username or email"
              />
              {errors.companyEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("companyPassword", {
                  required: "Password is required",
                })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              {errors.companyPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company size
              </label>
              <input
                type="number"
                {...register("companySize", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Enter your company size"
              />
              {errors.companySize && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companySize.message}
                </p>
              )}
            </div>

            {companyMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {companyMutation.error.message}
                </p>
              </div>
            )}
            {companyMutation.isSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Company registration successfull
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={companyMutation.isPending}
              className="w-full py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              {companyMutation.isPending ? "Registering..." : "Register"}
            </button>
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
