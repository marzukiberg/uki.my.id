import React from "react";

const Brand = ({
  className = "text-2xl font-bold flex justify-center md:justify-start",
}) => {
  return (
    <h1 className={className}>
      <span className="text-blue-500">U</span>
      <span className="text-red-500">k</span>
      <span className="text-yellow-500">a</span>
      <span className="text-blue-500">y</span>
      <span className="text-gray-500">.</span>
      <span className="text-green-500">d</span>
      <span className="text-red-500">e</span>
      <span className="text-blue-500">v</span>
    </h1>
  );
};

export default Brand;
