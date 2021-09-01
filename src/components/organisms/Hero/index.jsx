import React from 'react';
import BackgroundImages from './BackgroundImages';
import Blobs from './Blobs';
import NameSection from './NameSection';

const Hero = () => {
  return (
    <section className="relative flex h-screen items-center">
      <Blobs />
      <div className="container mx-auto max-w-7xl px-8">
        <div className="text-center space-y-4" data-aos="zoom-in">
          <NameSection />
        </div>

        <div className="hidden md:block absolute bottom-0 left-1/2 w-[90%] transform -translate-x-1/2 z-[-1]">
          <BackgroundImages />
        </div>
      </div>
    </section>
  );
};

export default Hero;
