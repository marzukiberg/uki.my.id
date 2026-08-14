import React from "react";

const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "primary",
      size = "default",
      as: Component = "button",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary:
        "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 border border-gray-200",
      ghost:
        "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
      light:
        "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
      download: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    };

    const sizes = {
      default: "px-8 py-3",
      sm: "px-4 py-2 text-sm",
      lg: "px-10 py-4 text-lg",
    };

    const classes =
      `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return (
      <Component className={classes} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export { Button };
