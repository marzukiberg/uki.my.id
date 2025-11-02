import React from 'react';

const BaseInput = React.forwardRef(({
    type = "text",
    placeholder = "",
    value,
    onChange,
    className = "",
    required = false,
    ...props
}, ref) => {
    const baseClasses = "rounded-full bg-gray-100 px-6 py-3 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

    return (
        <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${baseClasses} ${className}`.trim()}
            required={required}
            {...props}
        />
    );
});

BaseInput.displayName = "BaseInput";

export { BaseInput };