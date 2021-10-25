import React from 'react';
import { useHistory } from 'react-router-dom';

const SifdevsCreative = () => {
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-quicksand text-red-500 mb-6">
        No Direct Access!
      </h1>
      <button
        className="text-xl text-white bg-blue-500 px-4 py-3 rounded font-quicksand hover:bg-blue-700 duration-300"
        role="link"
        onClick={goBack}
      >
        Go back
      </button>
    </div>
  );
};

export default SifdevsCreative;
