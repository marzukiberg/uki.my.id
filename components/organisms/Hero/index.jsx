import React, { useEffect, useRef, useState } from "react";
import BackgroundImages from "./BackgroundImages";
import Blobs from "./Blobs";
import NameSection from "./NameSection";

const Hero = () => {
  const nameSectionRef = useRef(null);
  const [nameSectionHeight, setNameSectionHeight] = useState(0);

  useEffect(() => {
    if (nameSectionRef.current) {
      setNameSectionHeight(nameSectionRef.current.offsetHeight);
    }
  }, []);

  return (
    <section className="relative flex h-[calc(100vh-64px)] items-center overflow-hidden">
      <Blobs />
      <div className="container relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-8">
        <div
          className="relative z-20 my-20 space-y-4 text-center md:my-0"
          data-aos="zoom-in"
        >
          <NameSection ref={nameSectionRef} />
        </div>
        <div className="absolute inset-0 z-10">
          <BackgroundImages nameSectionHeight={nameSectionHeight} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
