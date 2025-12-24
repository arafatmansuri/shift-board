import { ArrowLeft, Calendar } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "../hooks";
import { useLoginMutation } from "../queries/authQueries";
import { useCompanyMutation } from "../queries/companyQueries";
import { setCredentials } from "../store/userSlice";
import type { AuthRequest } from "../types";
import { Button } from "./Button";
import { Box } from "./ErrorSuccessBox";
import Input from "./Input";

type AuthProps = {
  type: "register" | "login" | "forgotMail" | "forgotOTP" | "registerOTP";
};

const formHeader = {
  register: "Register your company",
  login: "Login to your account",
  forgotMail: "Forgot Password",
  forgotOTP: "Forgot Password",
  registerOTP: "Verify your email",
};

const buttonText = {
  register: { isPending: "Registering...", default: "Register" },
  login: { isPending: "Logging in...", default: "Login" },
  forgotMail: {
    isPending: "Sending reset email...",
    default: "Send Reset Email",
  },
  forgotOTP: { isPending: "Resetting password...", default: "Reset Password" },
  registerOTP: { isPending: "Verifying email...", default: "Verify Email" },
};

const successMessage = {
  register: "Company registered successfully",
  login: "Logged in successfully",
  forgotMail: "Password reset email sent",
  forgotOTP: "Password reset successfully",
  registerOTP: "Email verified successfully",
};

const additionalText = {
  register: {
    question: "Already registered? ",
    linkText: "Login",
    linkTo: "/login",
  },
  login: {
    question: "Don't have an account? ",
    linkText: "Register",
    linkTo: "/register",
  },
  forgotMail: {
    question: "Remembered your password? ",
    linkText: "Login",
    linkTo: "/login",
  },
  forgotOTP: {
    question: "Go back to login? ",
    linkText: "Login",
    linkTo: "/login",
  },
  registerOTP: {
    question: "Go back to login? ",
    linkText: "Login",
    linkTo: "/login",
  },
};

export const Auth = ({ type }: AuthProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRequest>();
  const companyMutation = useCompanyMutation();
  const loginMutation = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = (data: AuthRequest) => {
    if (type == "register")
      companyMutation.mutate({ data, endpoint: "create", method: "POST" });
    else loginMutation.mutate({ data, endpoint: type, method: "POST" });
  };
  useEffect(() => {
    if (companyMutation.isSuccess || loginMutation.isSuccess) {
      dispatch(
        setCredentials({
          user: companyMutation.data || loginMutation.data || null,
          isAuthorized: true,
        })
      );
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }, [companyMutation.isSuccess, loginMutation.isSuccess]);
  return (
      <div className="bg-white rounded-xl shadow-lg p-8 pt-4 flex flex-col items-center justify-center sm:w-[70%] md:w-[60%] lg:w-[40%] w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer self-start mb-3 -ml-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        {/* {type !== "forgotOTP" && type !== "registerOTP" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Calendar className="w-10 h-10 text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-900">ShiftBoard</h1>
            </div>
          )} */}
        {type !== "forgotOTP" && type !== "registerOTP" && (
          <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
            {formHeader[type]}
          </h2>
        )}
        {(type == "registerOTP" || type == "forgotOTP") && (
          <p className="text-sm text-center mb-2">
            OTP has been sent to your registered email. Please enter the OTP
            {type == "forgotOTP" ? " and your new password to proceed." : "."}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
          {type == "register" ||
            (type == "login" && (
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
            ))}
          {type !== "forgotOTP" && type !== "registerOTP" && (
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
          )}
          {(type == "registerOTP" || type == "forgotOTP") && (
            <Input
              isError={errors["OTP"] ? true : false}
              label={"OTP"}
              placeholder={"Enter your OTP"}
              errorMessage={errors.OTP && errors.OTP.message}
              formHook={{
                ...register("OTP", {
                  required: "OTP is required",
                }),
              }}
              type="number"
            />
          )}
          {(type == "register" || type == "login" || type == "forgotOTP") && (
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
          )}
          {type == "register" && (
            <Input
              isError={errors["companySize"] ? true : false}
              label={"Company size"}
              placeholder={"Enter your company size"}
              errorMessage={errors.companySize && errors.companySize.message}
              formHook={{
                ...register("companySize", { valueAsNumber: true }),
              }}
              type="number"
            />
          )}

          {companyMutation.isError && (
            <Box message={companyMutation.error.message} type="error" />
          )}
          {loginMutation.isError && (
            <Box message={loginMutation.error.message} type="error" />
          )}
          {companyMutation.isSuccess && (
            <Box message={successMessage[type]} type="success" />
          )}
          {loginMutation.isSuccess && (
            <Box message={successMessage[type]} type="success" />
          )}
          <Button
            isDisabled={companyMutation.isPending || loginMutation.isPending}
            type="submit"
            text={
              buttonText[type][
                companyMutation.isPending || loginMutation.isPending
                  ? "isPending"
                  : "default"
              ]
            }
            varient="primary"
            isWidthFull={true}
          />
        </form>

        <div className="mt-6 text-center">
          {additionalText[type].question}
          <Link
            to={additionalText[type].linkTo}
            className="text-blue-500 underline"
            // className="text-sm text-slate-600 hover:text-slate-900"
          >
            {additionalText[type].linkText}
          </Link>
        </div>
    </div>
  );
};
