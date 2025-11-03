import React from "react";

const IconButton = React.forwardRef(
  (
    {
      children,
      loading = false,
      disabled = false,
      className = "",
      size = "default",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
      sm: "w-8 h-8",
      default: "w-12 h-12",
      lg: "w-16 h-16",
    };

    const classes = `${baseClasses} ${sizes[size]} ${className}`.trim();

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
