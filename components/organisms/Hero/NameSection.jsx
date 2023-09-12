import React from "react";

const NameSection = () => {
  return (
    <div className="inline-block md:p-5">
      <p className="font-poppins text-3xl">Hello, I am</p>
      <h2 className="font-poppins text-6xl font-semibold tracking-widest md:text-6xl">
        Umairah <span className="text-blue-400">Rizkya</span> Gurning
      </h2>
      <p className="font-poppins space-x-3 text-lg text-gray-500">
        <span>Data Scientist</span> <span>|</span> <span>Data Mining</span>{" "}
        <span>|</span>
        <span>Researcher</span>
      </p>
    </div>
  );
};

export default NameSection;
