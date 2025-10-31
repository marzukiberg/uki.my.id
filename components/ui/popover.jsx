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

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const renderContent = () => {
        if (typeof content === 'function') {
            return content(setTooltip);
        }
        return content;
    };

    return (
        <div className={`relative ${className}`} ref={popoverRef}>
            <div onClick={() => setIsVisible(!isVisible)}>
                {children}
            </div>
            <div className={`absolute -right-12 md:right-0 mt-2 w-max bg-white border rounded-3xl shadow-lg z-10 transition-all duration-200 ease-in-out transform ${isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'} overflow-hidden`}>
                <div className="p-2">
                    {renderContent()}
                </div>
            </div>
            {tooltip && (
                <div className="absolute z-20 p-2 bg-white border rounded-2xl shadow-lg" style={{ top: tooltip.y, left: tooltip.x }}>
                    <Image src={tooltip.img} alt={tooltip.title} width={150} height={100} className="rounded" unoptimized />
                </div>
            )}
        </div>
    );
};

export default Popover;