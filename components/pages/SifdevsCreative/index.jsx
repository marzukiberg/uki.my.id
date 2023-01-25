import React from "react";
import { useNavigate } from "react-router-dom";

const SifdevsCreative = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="font-qs mb-6 text-3xl text-red-500">No Direct Access!</h1>
      <button
        className="font-qs rounded bg-blue-500 px-4 py-3 text-xl text-white duration-300 hover:bg-blue-700"
        role="link"
        onClick={goBack}
      >
        Go back
      </button>
    </div>
  );
};

export default SifdevsCreative;
