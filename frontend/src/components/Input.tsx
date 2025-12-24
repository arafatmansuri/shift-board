import { EyeIcon, EyeOff } from "lucide-react";
import { useState, type HTMLInputTypeAttribute } from "react";

type InputProps = {
  type?: HTMLInputTypeAttribute;
  placeholder: string;
  formHook?: any;
  label: string;
  isError: boolean;
  errorMessage?: string;
};

const Input = ({
  type,
  placeholder,
  formHook,
  label,
  isError,
  errorMessage,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        type={type != "password" ? type : showPassword ? "text" : "password"}
        {...formHook}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        placeholder={placeholder}
      />
      {type == "password" && !showPassword && (
        <EyeIcon
          className="absolute right-3 top-10 cursor-pointer"
          onClick={() => setShowPassword((p) => !p)}
        />
      )}
      {type == "password" && showPassword && (
        <EyeOff
          className="absolute right-3 top-10 cursor-pointer"
          onClick={() => setShowPassword((p) => !p)}
        />
      )}
      {isError && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

// Input.propTypes = {}

export default Input;
