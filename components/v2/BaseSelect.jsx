import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Popover from "../ui/popover";

const BaseSelect = React.forwardRef(
  (
    {
      placeholder = "",
      value,
      onChange,
      options = [],
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    const selectedOption = options.find((option) => option.value === value);

    const baseClasses =
      "rounded-full bg-gray-100 px-6 py-3 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer flex items-center justify-between min-w-0";

    const handleSelect = (optionValue) => {
      onChange({ target: { value: optionValue } });
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <div
          ref={(node) => {
            triggerRef.current = node;
            if (ref) {
              if (typeof ref === "function") {
                ref(node);
              } else {
                ref.current = node;
              }
            }
          }}
          className={`${baseClasses} ${className}`.trim()}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          <span
            className={`truncate ${
              !selectedOption ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`ml-2 h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-[200px] overflow-y-auto rounded-3xl border bg-white shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full border-b border-gray-100 px-6 py-3 text-left transition-colors first:rounded-t-3xl last:rounded-b-3xl last:border-b-0 ${
                  option.value === value
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="mt-1 text-sm text-gray-500">
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Overlay to close popover when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }
);

BaseSelect.displayName = "BaseSelect";

export { BaseSelect };
