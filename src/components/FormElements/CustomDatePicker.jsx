import React, { useState } from "react";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
  CalendarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import "react-day-picker/dist/style.css";

const CustomDatePickerSimple = ({ label, value, onChange, error, errorMessage }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <Popover placement="bottom">
        <PopoverHandler>
          <div
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            tabIndex={0}
            className={`flex items-center justify-between cursor-pointer border rounded-md px-3 h-12 w-full transition-colors ${
              error
                ? "border-red-500"
                : focused
                ? "border-purple-600"
                : "border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span
                className={`text-sm w-full text-left truncate ${
                  value ? "text-black" : "text-gray-400"
                }`}
              >
                {value ? format(value, "MM/dd/yyyy") : "MM/DD/AAAA"}
              </span>
            </div>
          
          </div>
        </PopoverHandler>
        <PopoverContent className="z-[9999] p-4 bg-white shadow-lg rounded-2xl overflow-visible w-auto">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={onChange}
            showOutsideDays
            className="w-full custom-calendar"
            components={{
              IconLeft: (props) => (
                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
              ),
              IconRight: (props) => (
                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
              ),
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}

      {/* Custom calendar styles */}
      <style jsx>{`
        .custom-calendar .rdp-day:hover {
          background-color: #f9fafb; /* gray-50 */
          border-radius: 4px;
        }
        .custom-calendar .rdp-day_selected {
          background-color: #7e22ce !important; /* Primary violet */
          color: white !important;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default CustomDatePickerSimple;
