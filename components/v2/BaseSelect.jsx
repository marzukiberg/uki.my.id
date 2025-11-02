import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Popover from '../ui/popover';

const BaseSelect = React.forwardRef(({
    placeholder = "",
    value,
    onChange,
    options = [],
    className = "",
    required = false,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    const selectedOption = options.find(option => option.value === value);

    const baseClasses = "rounded-full bg-gray-100 px-6 py-3 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer flex items-center justify-between min-w-0";

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
                        if (typeof ref === 'function') {
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
                <span className={`truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border rounded-3xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-6 py-3 transition-colors first:rounded-t-3xl last:rounded-b-3xl border-b border-gray-100 last:border-b-0 ${option.value === value
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'hover:bg-gray-50 text-gray-900'
                                }`}
                        >
                            <div className="font-medium">{option.label}</div>
                            {option.description && (
                                <div className="text-sm text-gray-500 mt-1">{option.description}</div>
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
});

BaseSelect.displayName = "BaseSelect";

export { BaseSelect };