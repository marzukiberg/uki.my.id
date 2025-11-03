import React, { useEffect } from "react";

const HaditsHarian = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "https://hadits-harian.netlify.app/";
    }, 2000);
  }, []);
  return (
    <div
      className="font-roboto container mx-auto max-w-xs py-6 md:max-w-md lg:max-w-lg"
      id="app"
    >
      <span>Mengalihkan...</span>
    </div>
  );
};

export default HaditsHarian;
