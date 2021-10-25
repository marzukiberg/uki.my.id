import React from 'react';

const BackgroundAndBlobs = () => {
  return (
    <>
      <div
        className="absolute bg-blue-400 bg-opacity-25 w-full h-full rounded-r-md left-0 top-4 md:left-4 z-[-1]"
        data-aos="fade-in"
      ></div>
      <img
        src="/img/blob2.png"
        alt="Blob"
        className="absolute left-0 -top-6 md:top-0"
      />
      <img
        src="/img/blob3.png"
        alt="Blob"
        className="absolute right-0 bottom-0"
      />
    </>
  );
};

export default BackgroundAndBlobs;
