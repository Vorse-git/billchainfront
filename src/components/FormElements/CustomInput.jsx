import { useState } from "react";

const CustomInputSimple = ({ label, value, onChange, type = "text" }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full">
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <input
        type={type}
        value={value}
        placeholder="Insert"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`h-12 w-full rounded-md border px-3 text-sm outline-none transition-colors ${
          focused ? "border-purple-600" : "border-gray-300"
        }`}
      />
    </div>
  );
};

export default CustomInputSimple;
