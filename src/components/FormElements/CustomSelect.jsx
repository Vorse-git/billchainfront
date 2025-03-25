import { useState, useRef, useEffect } from "react";

const CustomSelectSimple = ({ label, options = [], onChange, value, error, errorMessage }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <div
        onClick={() => setOpen(!open)}
        className={`h-12 w-full border rounded-md px-3 flex items-center justify-between cursor-pointer bg-white ${
          error ? "border-red-500" : open ? "border-purple-600" : "border-gray-300"
        }`}
      >
        <span className={`text-sm ${value ? "text-black" : "text-gray-400"}`}>
          {value ? options.find((option) => option.value === value)?.label : "Select"}
        </span>
        <svg
          className={`w-4 h- text-gray-400 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
      {open && (
        <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto w-full">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelectSimple;

