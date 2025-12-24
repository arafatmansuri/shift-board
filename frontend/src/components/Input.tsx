import { EyeIcon, EyeOff } from "lucide-react";
import { useState, type HTMLInputTypeAttribute } from "react";
import { Link } from "react-router";

type InputProps = {
  type?: HTMLInputTypeAttribute;
  placeholder: string;
  formHook?: any;
  label: string;
  isError: boolean;
  errorMessage?: string;
  forgotOption?: boolean;
};

const Input = ({
  type,
  placeholder,
  formHook,
  label,
  isError,
  errorMessage,
  forgotOption = false,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="relative">
      <label
        className={`text-sm font-medium text-slate-700 mb-2 ${
          forgotOption ? "flex justify-between items-center" : "block"
        }`}
      >
        <span>{label}</span>
        {forgotOption && (
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Forgot password?
          </Link>
        )}
      </label>
      <input
        type={type != "password" ? type : showPassword ? "text" : "password"}
        {...formHook}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {type == "password" && !showPassword && inputValue && (
        <EyeIcon
          className="absolute right-3 top-10 cursor-pointer text-gray-900"
          onClick={() => setShowPassword((p) => !p)}
        />
      )}
      {type == "password" && showPassword && inputValue && (
        <EyeOff
          className="absolute right-3 top-10 cursor-pointer text-gray-900"
          onClick={() => setShowPassword((p) => !p)}
        />
      )}
      {isError && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

// Input.propTypes = {}

export default Input;
