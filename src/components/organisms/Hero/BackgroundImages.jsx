import React from 'react';

const BackgroundImages = () => {
  return (
    <>
      <img src="/img/logos.png" alt="Logos" className="" data-aos="fade-in" />
      <div data-aos="fade-in">
        <img
          src="/img/profile.jpeg"
          alt="Profile Picture"
          className="w-[300px] absolute left-1/2 bottom-0 transform translate-x-[-50%]"
        />
      </div>
    </>
  );
};

export default BackgroundImages;
