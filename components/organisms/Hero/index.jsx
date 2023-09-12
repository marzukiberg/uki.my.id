import React from "react";
import BackgroundImages from "./BackgroundImages";
import Blobs from "./Blobs";
import NameSection from "./NameSection";
import Image from "next/legacy/image";
import { imgLoader } from "../../../utils/img-loader";

const Hero = () => {
  return (
    <section className="relative flex h-screen">
      <Blobs />
      <div className="container mx-auto mt-32 max-w-7xl px-8">
        <div className="space-y-4 text-center" data-aos="zoom-in">
          <NameSection />

          <div className="mx-auto h-[300px] w-[300px]">
            <Image
              layout="fixed"
              width={300}
              height={300}
              loader={imgLoader}
              className="rounded-full"
              src="/img/umai.jpeg"
              alt="Profile Picture Umairah"
              objectFit="cover"
            />
          </div>
        </div>

        {/* <div className="absolute bottom-32 left-1/2 z-[-1] hidden w-[90%] -translate-x-1/2 transform md:block">
          <BackgroundImages />
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
