type SelectProps = {
  formHook?: any;
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  options: {
    value: string;
    text: string;
  }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  title?: string;
  isLabel?: boolean;
};

const Select = ({
  formHook,
  label,
  isError,
  errorMessage,
  options,
  onChange,
  value,
  title,
  isLabel = true,
}: SelectProps) => {
  return (
    <div>
      {isLabel && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <select
        {...formHook}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
        onChange={onChange}
        value={value}
        title={title}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
      {isError && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

// Input.propTypes = {}

export default Select;
