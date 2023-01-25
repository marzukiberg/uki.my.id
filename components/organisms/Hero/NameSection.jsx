import React from "react";

const NameSection = () => {
  return (
    <div className="inline-block md:p-5">
      <p className="text-3xl font-poppins">Hello, I am</p>
      <h2 className="text-6xl md:text-6xl font-semibold tracking-widest font-poppins">
        Marz<span className="text-blue-400">uki</span>
      </h2>
      <p className="text-lg space-x-3 text-gray-500 font-poppins">
        <span>Frontend Web Developer</span> <span>|</span>{" "}
        <span>React Native Developer</span>
      </p>
    </div>
  );
};

export default NameSection;
