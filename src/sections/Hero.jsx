import React from 'react';

const Hero = () => {
  return (
    <section className="relative flex h-screen items-center">
      <img
        src="/img/blob1.png"
        alt="Blob"
        className="absolute left-0 top-0"
        style={{ zIndex: -1 }}
      />
      <img
        src="/img/blob4.png"
        alt="Blob"
        className="absolute right-0 top-0"
        style={{ zIndex: -1 }}
      />
      <div className="container mx-auto max-w-7xl px-8">
        <div className="relative">
          <div className="text-center space-y-4 mt-32" data-aos="zoom-in">
            <p className="text-3xl font-poppins">Hello, I am</p>
            <h2 className="text-6xl md:text-6xl font-semibold tracking-widest font-poppins">
              Marz<span className="text-blue-400">uki</span>
            </h2>
            <p className="text-lg space-x-3 text-gray-500 font-poppins">
              <span>Frontend Web Developer</span> <span>|</span>{' '}
              <span>React Native Developer</span>
            </p>
          </div>
          <img
            src="/img/logos.png"
            alt="Logos"
            className="hidden md:block mx-auto md:-mt-28 "
            data-aos="fade-in"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
