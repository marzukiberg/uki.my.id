import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const Popover = ({ children, content, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsVisible(false);
        setTooltip(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    if (typeof content === "function") {
      return content(setTooltip);
    }
    return content;
  };

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <div onClick={() => setIsVisible(!isVisible)}>{children}</div>
      <div
        className={`absolute -right-12 z-10 mt-2 w-max transform rounded-3xl border bg-white shadow-lg transition-all duration-200 ease-in-out md:right-0 ${
          isVisible
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-2">{renderContent()}</div>
      </div>
      {tooltip && (
        <div
          className="absolute z-20 rounded-2xl border bg-white p-2 shadow-lg"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          <Image
            src={tooltip.img}
            alt={tooltip.title}
            width={150}
            height={100}
            className="rounded"
            unoptimized
          />
        </div>
      )}
    </div>
  );
};

export default Popover;
