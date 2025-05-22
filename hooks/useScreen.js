import { useState, useEffect } from "react";

const useScreen = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    isMobile: false,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        isMobile: mobileQuery.matches,
      });
    };

    // Initial check
    if (typeof window !== "undefined") {
      updateScreenSize();
    }

    // Add listeners
    window.addEventListener("resize", updateScreenSize);
    mobileQuery.addListener(updateScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateScreenSize);
      mobileQuery.removeListener(updateScreenSize);
    };
  }, []);

  return screenSize;
};

export default useScreen;
