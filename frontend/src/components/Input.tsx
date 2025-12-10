import { type HTMLInputTypeAttribute } from "react";

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
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        type={type ? type : "text"}
        {...formHook}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        placeholder={placeholder}
      />
      {isError && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

// Input.propTypes = {}

export default Input;
