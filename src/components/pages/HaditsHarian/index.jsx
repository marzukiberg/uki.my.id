import React, { useEffect } from "react";

const HaditsHarian = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "https://hadits-harian.netlify.app/";
    }, 2000);
  }, []);
  return (
    <div
      className="container mx-auto max-w-xs md:max-w-md lg:max-w-lg py-6 font-roboto"
      id="app"
    >
      <span>Mengalihkan...</span>
    </div>
  );
};

export default HaditsHarian;
